import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"

// Surface fills from app/globals.css. Each pairs with a `-foreground` (or is a
// panel background), so as a text color it nearly vanishes on the page behind it.
const SURFACE_TOKENS = [
	"accent",
	"card",
	"muted",
	"panel",
	"panel-elevated",
	"popover",
	"secondary",
	"sunken",
]

const surfaceText = new RegExp(
	String.raw`(?:^|[\s"'\x60:])text-(${SURFACE_TOKENS.join("|")})(?:\/[\d.]+)?(?=$|[\s"'\x60;])`,
	"gm",
)

function surfaceTextIssues(source: string, file: string) {
	return [...source.matchAll(surfaceText)].map((match) => {
		const line = source.slice(0, match.index).split("\n").length
		return `${file}:${line}: text-${match[1]} uses a surface fill as text color`
	})
}

for (const source of [
	'<a className="text-accent underline-offset-4 hover:underline" />',
	'<p className="hover:text-muted" />',
	'<span className="dark:text-card/80 font-bold" />',
	"cn(`text-secondary ${x}`)",
	'<p className="text-panel-elevated" />',
	".link { @apply text-sunken; }",
]) {
	test(`rejects surface token as text color: ${source}`, () => {
		assert.ok(surfaceTextIssues(source, "fixture.tsx").length > 0)
	})
}

for (const source of [
	'<span className="bg-accent text-accent-foreground" />',
	'<p className="text-muted-foreground" />',
	'<p className="text-card-foreground text-primary" />',
	'<span className="text-border" aria-hidden="true" />',
	'<div className="bg-foreground text-background" />',
	'<p className="text-secondary-foreground/80" />',
]) {
	test(`allows foreground tokens: ${source}`, () => {
		assert.deepEqual(surfaceTextIssues(source, "fixture.tsx"), [])
	})
}

test("app, components and lib never use a surface fill as text color", () => {
	const sources = ["app", "components", "lib"].flatMap((root) =>
		fs
			.readdirSync(root, { recursive: true, withFileTypes: true })
			.filter(
				(entry) => entry.isFile() && /\.([cm]?[jt]sx?|css)$/.test(entry.name),
			)
			.map((entry) => path.join(entry.parentPath, entry.name)),
	)
	assert.ok(sources.length > 100, `only ${sources.length} source files found`)
	const problems = sources.flatMap((file) =>
		surfaceTextIssues(fs.readFileSync(file, "utf8"), file),
	)
	assert.deepEqual(problems, [])
})
