/**
 * Next.js still emits two polyfill files that this browserslist does not
 * need: `polyfill-module` (Array.at and friends, ~1KB) and
 * `polyfill-nomodule` (full core-js for IE, ~110KB). Turbopack on this
 * Next preview has been serving the nomodule file as a regular blocking
 * script, so every phone downloads 110KB of unused JavaScript.
 *
 * Replace both with a no-op before `next build`. Safe for chrome >= 111 /
 * Safari 16.4.
 */
import { existsSync, readdirSync, statSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const nextPkg = require.resolve("next/package.json")
const nextRoot = dirname(nextPkg)

const stub =
	"/* stripped for modern browserslist - see scripts/strip-next-polyfills.mjs */\n"

const polyfillName = /polyfill-(?:no)?module/

function stripTree(dir) {
	if (!existsSync(dir)) return
	for (const name of readdirSync(dir)) {
		const target = join(dir, name)
		const stat = statSync(target)
		if (stat.isDirectory()) {
			stripTree(target)
			continue
		}
		if (!polyfillName.test(name) || !name.endsWith(".js")) continue
		writeFileSync(target, stub)
		console.log(`stripped ${target}`)
	}
}

stripTree(join(nextRoot, "dist"))
