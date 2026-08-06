/**
 * Next.js always embeds `polyfill-module` for APIs already native in its
 * supported browserslist (Chrome 111+, Safari 16.4+, …). Lighthouse still
 * flags those ~13 KiB as "legacy JavaScript".
 *
 * Replace the module with a no-op before `next build` so modern clients do not
 * download dead polyfills. Safe for this project's browserslist floor.
 */
import { writeFileSync, existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const nextPkg = require.resolve("next/package.json")
const nextRoot = dirname(nextPkg)

const targets = [
	join(nextRoot, "dist/build/polyfills/polyfill-module.js"),
	join(nextRoot, "dist/esm/build/polyfills/polyfill-module.js"),
]

const stub =
	"/* stripped for modern browserslist - see scripts/strip-next-polyfills.mjs */\n"

let strippedCount = 0
for (const target of targets) {
	if (!existsSync(target)) continue
	writeFileSync(target, stub)
	console.log(`stripped ${target}`)
	strippedCount += 1
}

if (strippedCount === 0) {
	console.warn(
		"strip-next-polyfills: no known polyfill-module path found under " +
			`${nextRoot} - Next.js may have changed its internal layout, ` +
			"so legacy polyfills are shipping unstripped. Update the `targets` " +
			"list in scripts/strip-next-polyfills.mjs.",
	)
}
