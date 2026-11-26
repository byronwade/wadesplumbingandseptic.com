import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"

/*
 * Every page ships whatever the root and route-group layouts import
 * statically. Search (cmdk + Radix Dialog) must stay behind a dynamic
 * import() so it only loads when someone opens it, and the unused sonner
 * toaster must stay out of the shell. The contact card must also keep its
 * optional follow-up sheet out of the initial bundle. Icons must come from the
 * generated duotone data, not @phosphor-icons/react, whose modules carry all
 * six weights of every icon. Walks the static import graph from each entry
 * point; dynamic import() calls are not followed.
 */
const root = resolve(__dirname, "../..")
const entries = [
	"app/layout.tsx",
	"app/(home)/layout.tsx",
	"app/(site)/layout.tsx",
	"components/virtual-business-card.tsx",
	"components/contact-lead.tsx",
]
const bannedPackages = [
	"cmdk",
	"sonner",
	"next-themes",
	"@radix-ui/react-dialog",
]
const bannedModules = [
	"components/command-menu.tsx",
	"components/ui/command.tsx",
	"components/ui/sheet.tsx",
	"components/save-contact-prompt.tsx",
	"components/site-header-nav.tsx",
	"components/site-header-mobile-menu.tsx",
	"components/quote-form.tsx",
]

const staticImport =
	/^\s*(?:import|export)\s+(?:type\s+)?(?:[^"'`;]*?\s+from\s+)?["']([^"']+)["']/gm

function resolveLocal(spec: string, fromFile: string) {
	const base = spec.startsWith("@/")
		? join(root, spec.slice(2))
		: resolve(dirname(fromFile), spec)
	for (const candidate of [
		base,
		`${base}.ts`,
		`${base}.tsx`,
		join(base, "index.ts"),
		join(base, "index.tsx"),
	]) {
		if (/\.(ts|tsx)$/.test(candidate) && existsSync(candidate)) return candidate
	}
	return null
}

const seen = new Set<string>()
const packages = new Map<string, string>()
const queue = entries.map((entry) => join(root, entry))

while (queue.length > 0) {
	const file = queue.pop()!
	if (seen.has(file)) continue
	seen.add(file)
	const source = readFileSync(file, "utf8")
	for (const match of source.matchAll(staticImport)) {
		const statement = match[0]
		const spec = match[1]
		// Type-only imports are erased and add no client weight.
		if (/^\s*(?:import|export)\s+type\b/.test(statement)) continue
		if (spec.startsWith(".") || spec.startsWith("@/")) {
			const target = resolveLocal(spec, file)
			if (target) queue.push(target)
			continue
		}
		const name = spec.startsWith("@")
			? spec.split("/").slice(0, 2).join("/")
			: spec.split("/")[0]
		if (!packages.has(name))
			packages.set(name, relative(root, file).replaceAll("\\", "/"))
	}
}

const reached = [...seen].map((file) =>
	relative(root, file).replaceAll("\\", "/"),
)

for (const name of bannedPackages) {
	assert.ok(
		!packages.has(name),
		`"${name}" is statically imported by ${packages.get(name)}, so it loads before interaction. Load it with import() on demand instead.`,
	)
}
assert.ok(
	!packages.has("@phosphor-icons/react"),
	`"@phosphor-icons/react" is imported at runtime by ${packages.get("@phosphor-icons/react")}, which ships all six weights of every icon to every page. Use @/components/icons; add new icons in scripts/generate-icon-data.mjs.`,
)
for (const banned of bannedModules) {
	assert.ok(
		!reached.includes(banned),
		`${banned} is statically reachable from an initial entry point. Keep optional dialogs behind an on-demand import().`,
	)
}
assert.ok(
	reached.includes("components/app-command-shell.tsx"),
	"The root layout must mount AppCommandShell so Ctrl+K and the header search buttons work on every page.",
)
assert.ok(
	reached.includes("components/deferred-header-nav.tsx"),
	"The header must defer the Radix mega-menu so it stays out of the first load.",
)
assert.ok(
	reached.includes("components/header-toolbar.tsx"),
	"The header toolbar (search, call, mobile menu) must stay on every page.",
)
assert.ok(
	reached.includes("components/office-hours-script.tsx"),
	"The root layout must mount the office-hours boot script so open/closed status works without a React island.",
)
assert.doesNotMatch(
	readFileSync(join(root, "components/office-status.tsx"), "utf8"),
	/^["']use client["']/,
	"Office hours markup must stay a server component. Live status belongs in the boot script.",
)
assert.match(
	readFileSync(join(root, "components/page-view-tracker.tsx"), "utf8"),
	/^["']use client["']/,
	"Page-view beacons must stay a client effect so Next Link navigations still count.",
)
assert.match(
	readFileSync(join(root, "app/layout.tsx"), "utf8"),
	/rel="preload"[\s\S]*href="\/fonts\/inter-latin\.woff2"[\s\S]*as="font"|href="\/fonts\/inter-latin\.woff2"[\s\S]*as="font"[\s\S]*rel="preload"/,
	"Root layout must preload Inter from /fonts so LCP type is not gated on the CSS file.",
)
assert.ok(
	existsSync(join(root, "public/fonts/inter-latin.woff2")),
	"public/fonts/inter-latin.woff2 is the preloaded face. Do not point the preload at a hashed /_next/static/media URL.",
)

console.log(
	`Shell weight passes: ${reached.length} modules reachable from ${entries.length} entry points; search UI, quote form, contact prompt, toaster and unused icon weights stay out of the first load.`,
)
