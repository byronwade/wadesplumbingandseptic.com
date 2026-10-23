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

const sourceFiles = ["app", "components", "lib"].flatMap((root) =>
	fs
		.readdirSync(root, { recursive: true, withFileTypes: true })
		.filter((entry) => entry.isFile() && /\.[cm]?[jt]sx?$/.test(entry.name))
		.map((entry) => path.join(entry.parentPath, entry.name)),
)

test("app, components and lib grids keep a phone-width column", () => {
	assert.ok(
		sourceFiles.length > 100,
		`only ${sourceFiles.length} source files found`,
	)
	const problems = sourceFiles.flatMap((file) =>
		implicitColumnIssues(fs.readFileSync(file, "utf8"), file),
	)
	assert.deepEqual(problems, [])
})

function declarationOf(css: string, selector: string, property: string) {
	const pattern = new RegExp(`(?:^|;|\\s)${property}:\\s*([^;]+);`, "g")
	return cssRules(css)
		.filter((rule) => rule.selectors.includes(selector))
		.flatMap((rule) =>
			[...rule.body.matchAll(pattern)].map((m) => m[1]!.trim()),
		)
		.at(-1)
}

// rem insets double with 200% text. On a 320px phone the gutter, the list
// indent and the checklist badge each took a word's worth of width, so text
// broke mid-word. Capping them in px keeps 100% text identical.
// Evaluates a clamp/min/max length made of px, rem and vw at a given root
// font size and viewport width, so the gutter is tested by what it renders.
function lengthAt(value: string, rootPx: number, viewportPx: number) {
	const tokens = value.match(/[\d.]+(?:px|rem|vw)?|[a-z]+|[(),+\-*/]/g) ?? []
	let at = 0
	const take = (expected?: string) => {
		const token = tokens[at++]
		if (token === undefined || (expected && token !== expected)) {
			throw new Error(`unexpected ${token} in ${value}`)
		}
		return token
	}
	const unit = { px: 1, rem: rootPx, vw: viewportPx / 100 } as const
	const fns: Record<string, (...args: number[]) => number> = {
		clamp: (lo, v, hi) => Math.max(lo!, Math.min(v!, hi!)),
		min: Math.min,
		max: Math.max,
	}
	const factor = (): number => {
		const token = take()
		if (token === "(") {
			const inner = sum()
			take(")")
			return inner
		}
		if (token in fns) {
			take("(")
			const args = [sum()]
			while (tokens[at] === ",") {
				take(",")
				args.push(sum())
			}
			take(")")
			return fns[token]!(...args)
		}
		const match = token.match(/^([\d.]+)(px|rem|vw)?$/)
		if (!match) throw new Error(`unexpected ${token} in ${value}`)
		return (
			Number(match[1]) * (match[2] ? unit[match[2] as keyof typeof unit] : 1)
		)
	}
	const product = () => {
		let result = factor()
		while (tokens[at] === "*" || tokens[at] === "/") {
			result = take() === "*" ? result * factor() : result / factor()
		}
		return result
	}
	const sum = () => {
		let result = product()
		while (tokens[at] === "+" || tokens[at] === "-") {
			result = take() === "+" ? result + product() : result - product()
		}
		return result
	}
	const result = sum()
	assert.equal(at, tokens.length, `unparsed tail in ${value}`)
	return result
}

test("lengthAt evaluates nested clamp, min and calc-style subtraction", () => {
	assert.equal(lengthAt("clamp(min(1.25rem, 20px), 4vw, 2.5rem)", 16, 320), 20)
	assert.equal(lengthAt("clamp(12px, 100vw - 15rem, 20px)", 32, 320), 12)
	assert.equal(lengthAt("clamp(12px, 100vw - 15rem, 20px)", 16, 256), 16)
})

const gutter = declarationOf(globals, ":root", "--space-page-x") ?? ""

test("the page gutter is unchanged at normal text on 260px and wider", () => {
	const before = "clamp(min(1.25rem, 20px), 4vw, 2.5rem)"
	for (let width = 260; width <= 1600; width += 10) {
		assert.equal(
			lengthAt(gutter, 16, width),
			lengthAt(before, 16, width),
			`${width}px`,
		)
	}
})

// rem insets double with 200% text. On a 320px phone a 20px gutter left a
// 280px line, and "Plumbing" at headline size is 280.4px, so it broke.
test("the page gutter gives enlarged text more room on phones", () => {
	// The floor drops to 12px, so the 4vw preferred value shows through.
	for (const width of [320, 360, 390, 430]) {
		const expected = Math.max(12, width * 0.04)
		assert.equal(lengthAt(gutter, 32, width), expected, `${width}px at 200%`)
	}
	for (let root = 16; root <= 48; root += 2) {
		for (const width of [280, 320, 390, 430]) {
			const value = lengthAt(gutter, root, width)
			assert.ok(value >= 12 && value <= 20, `${width}px at ${root}px text`)
		}
	}
})

test("prose list indent shrinks toward 1em with enlarged text", () => {
	for (const selector of [".prose ul", ".prose ol"]) {
		assert.match(
			declarationOf(globals, selector, "padding-left") ?? "",
			/^min\([\d.]+rem,\s*max\(\d+px,\s*1em\)\)$/,
		)
	}
})

// The checklist rows: an icon badge beside the text in a flex row.
function uncappedChecklistInsets(source: string, file: string) {
	return [...source.matchAll(/["'`]([^"'`\n]*)["'`]/g)].flatMap((match) => {
		const classes = match[1]!.split(/\s+/)
		const line = source.slice(0, match.index).split("\n").length
		const badge =
			classes.includes("place-items-center") &&
			classes.includes("shrink-0") &&
			classes.includes("mt-0.5")
		const row = classes.includes("panel-inset") && classes.includes("flex")
		const problems: string[] = []
		if (badge && classes.some((name) => /^size-[\d.]+$/.test(name))) {
			problems.push(`${file}:${line}: badge size needs a px cap`)
		}
		if ((badge || row) && classes.some((name) => /^gap-[\d.]+$/.test(name))) {
			problems.push(`${file}:${line}: row gap needs a px cap`)
		}
		return problems
	})
}

for (const source of [
	'<span className="mt-0.5 grid size-8 shrink-0 place-items-center" />',
	'<li className="surface-panel panel-inset flex items-start gap-3" />',
]) {
	test(`rejects an uncapped checklist inset: ${source}`, () => {
		assert.ok(uncappedChecklistInsets(source, "fixture.tsx").length > 0)
	})
}

for (const source of [
	'<span className="mt-0.5 grid size-[min(2rem,32px)] shrink-0 place-items-center" />',
	'<li className="surface-panel panel-inset flex items-start gap-[min(0.75rem,12px)]" />',
	'<div className="surface-panel panel-inset" />',
]) {
	test(`allows a capped checklist inset: ${source}`, () => {
		assert.deepEqual(uncappedChecklistInsets(source, "fixture.tsx"), [])
	})
}

test("checklist badges and row gaps keep their size at enlarged text", () => {
	const problems = sourceFiles.flatMap((file) =>
		uncappedChecklistInsets(fs.readFileSync(file, "utf8"), file),
	)
	assert.deepEqual(problems, [])
})
