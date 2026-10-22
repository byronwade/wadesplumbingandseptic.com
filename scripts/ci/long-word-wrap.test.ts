import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"

// Heading sizes are large enough that one long word ("Replacement",
// "Maintenance") is wider than a phone with enlarged text. `anywhere` also
// shrinks min-content, so grid and flex parents sized to the heading narrow too.
const HEADING_CLASSES = [
	"type-cinematic",
	"type-display",
	"type-headline",
	"type-title",
	"type-subtitle",
]

function cssRules(css: string) {
	const source = css.replace(/\/\*[\s\S]*?\*\//g, "")
	return [...source.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match) => ({
		selectors: match[1]!.split(",").map((selector) => selector.trim()),
		body: match[2]!,
	}))
}

function overflowWrapOf(css: string, selector: string) {
	const values = cssRules(css)
		.filter((rule) => rule.selectors.includes(selector))
		.flatMap((rule) =>
			[...rule.body.matchAll(/overflow-wrap:\s*([\w-]+)/g)].map((m) => m[1]),
		)
	return values.at(-1)
}

test("reads overflow-wrap from a shared selector list", () => {
	const css = `.type-title,\n.type-subtitle {\n\tfont-weight: 800;\n\toverflow-wrap: anywhere;\n}`
	assert.equal(overflowWrapOf(css, ".type-title"), "anywhere")
	assert.equal(overflowWrapOf(css, ".type-subtitle"), "anywhere")
})

test("ignores commented-out declarations and other selectors", () => {
	const css = `.type-title {\n\t/* overflow-wrap: anywhere; */\n}\n.type-titles { overflow-wrap: anywhere; }`
	assert.equal(overflowWrapOf(css, ".type-title"), undefined)
})

const globals = fs.readFileSync("app/globals.css", "utf8")

for (const name of HEADING_CLASSES) {
	test(`.${name} wraps long words and lets its parent shrink`, () => {
		assert.equal(overflowWrapOf(globals, `.${name}`), "anywhere")
	})
}

test(".prose wraps long words such as raw URLs used as link text", () => {
	assert.match(
		overflowWrapOf(globals, ".prose") ?? "",
		/^(break-word|anywhere)$/,
	)
})

// Hero and section leads sit in flex and grid parents too.
for (const selector of [
	".type-lead",
	".section-head-row",
	".section-head-row .prose",
]) {
	test(`${selector} lets its parent shrink below one long word`, () => {
		assert.equal(overflowWrapOf(globals, selector), "anywhere")
	})
}

// A grid with columns only from a breakpoint up has one implicit `auto`
// column below it, which grows to the widest word or button instead of the
// screen. `grid-cols-1` is minmax(0, 1fr), which stays at the screen width.
function implicitColumnIssues(source: string, file: string) {
	return [...source.matchAll(/["'`]([^"'`\n]*)["'`]/g)].flatMap((match) => {
		const classes = match[1]!.split(/\s+/)
		if (!classes.includes("grid")) return []
		if (!classes.some((name) => /^[\w-]+:grid-cols-/.test(name))) return []
		if (classes.some((name) => /^(grid-cols-|panel-grid$)/.test(name))) {
			return []
		}
		const line = source.slice(0, match.index).split("\n").length
		return [`${file}:${line}: grid needs a base grid-cols-* for phones`]
	})
}

for (const source of [
	'<ul className="grid gap-4 md:grid-cols-2" />',
	'<div className="reveal grid items-start lg:grid-cols-[minmax(0,1fr)_20rem]" />',
	"cn(`grid gap-3 sm:grid-cols-2`, x)",
]) {
	test(`rejects a grid with breakpoint-only columns: ${source}`, () => {
		assert.ok(implicitColumnIssues(source, "fixture.tsx").length > 0)
	})
}

for (const source of [
	'<ul className="grid grid-cols-1 gap-4 md:grid-cols-2" />',
	'<ul className="panel-grid grid gap-4 lg:grid-cols-3" />',
	'<div className="grid gap-4" />',
	'<div className="hidden md:grid md:grid-cols-2" />',
]) {
	test(`allows a grid with a phone column or no columns: ${source}`, () => {
		assert.deepEqual(implicitColumnIssues(source, "fixture.tsx"), [])
	})
}

test("app, components and lib grids keep a phone-width column", () => {
	const sources = ["app", "components", "lib"].flatMap((root) =>
		fs
			.readdirSync(root, { recursive: true, withFileTypes: true })
			.filter((entry) => entry.isFile() && /\.[cm]?[jt]sx?$/.test(entry.name))
			.map((entry) => path.join(entry.parentPath, entry.name)),
	)
	assert.ok(sources.length > 100, `only ${sources.length} source files found`)
	const problems = sources.flatMap((file) =>
		implicitColumnIssues(fs.readFileSync(file, "utf8"), file),
	)
	assert.deepEqual(problems, [])
})
