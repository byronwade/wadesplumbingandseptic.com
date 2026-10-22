import assert from "node:assert/strict"
import fs from "node:fs"
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
