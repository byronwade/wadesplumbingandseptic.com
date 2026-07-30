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
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
const nextPkg = require.resolve("next/package.json")
const nextRoot = dirname(nextPkg)

const targets = [
	join(nextRoot, "dist/build/polyfills/polyfill-module.js"),
	join(nextRoot, "dist/esm/build/polyfills/polyfill-module.js"),
]

const stub =
	"/* stripped for modern browserslist - see scripts/strip-next-polyfills.mjs */\n"

for (const target of targets) {
	if (!existsSync(target)) continue
	writeFileSync(target, stub)
	console.log(`stripped ${target}`)
}
