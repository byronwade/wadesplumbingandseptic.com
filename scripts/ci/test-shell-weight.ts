import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"

/*
 * Every page ships whatever the root and route-group layouts import
 * statically. Search (cmdk + Radix Dialog) must stay behind a dynamic
 * import() so it only loads when someone opens it, and the unused sonner
 * toaster must stay out of the shell. Walks the static import graph from each
 * layout; dynamic import() calls are deliberately not followed.
 */
const root = resolve(__dirname, "../..")
const entries = [
	"app/layout.tsx",
	"app/(home)/layout.tsx",
	"app/(site)/layout.tsx",
]
const bannedPackages = ["cmdk", "sonner"]
const bannedModules = [
	"components/command-menu.tsx",
	"components/ui/command.tsx",
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
		`"${name}" is statically imported by ${packages.get(name)}, so every page downloads it. Load it with import() on demand instead.`,
	)
}
for (const banned of bannedModules) {
	assert.ok(
		!reached.includes(banned),
		`${banned} is statically reachable from a layout, so every page downloads it. Keep it behind next/dynamic in components/app-command-shell.tsx.`,
	)
}
assert.ok(
	reached.includes("components/app-command-shell.tsx"),
	"The root layout must mount AppCommandShell so Ctrl+K and the header search buttons work on every page.",
)

console.log(
	`Shell weight passes: ${reached.length} modules reachable from ${entries.length} layouts; search UI and toaster stay out of the first load.`,
)
