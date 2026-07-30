#!/usr/bin/env node
/**
 * Rewrite spaced hyphen asides (" - ") into real punctuation in markdown.
 * Preserves frontmatter fences, list markers, and compound hyphens (no spaces).
 *
 * Usage:
 *   node scripts/ci/rewrite-spaced-dashes.mjs [--write] [paths...]
 */
import fs from "node:fs"
import path from "node:path"

const WRITE = process.argv.includes("--write")
const targets = process.argv.slice(2).filter((a) => a !== "--write")

const ROOT = process.cwd()
const DEFAULT_DIRS = [path.join(ROOT, "content")]

function walkMd(dir) {
	if (!fs.existsSync(dir)) return []
	return fs
		.readdirSync(dir, { withFileTypes: true, recursive: true })
		.filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
		.map((entry) => path.join(entry.parentPath, entry.name))
}

function splitFrontmatter(source) {
	if (!source.startsWith("---\n") && !source.startsWith("---\r\n")) {
		return { fence: "", body: source }
	}
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
	if (!match) return { fence: "", body: source }
	return {
		fence: `---\n${match[1]}\n---\n`,
		body: match[2],
	}
}

/** Spaced hyphen/en/em used as punctuation (not list markers or compounds). */
const DASH_ASIDE = /(?<=\S) (?:-|\u2013|\u2014) (?=\S)/g

function rewriteBody(body) {
	let text = body

	// Quote attributions at end of a line/block:
	// "…" - Name, City  →  "…" (Name, City)
	text = text.replace(
		/("(?:[^"\\]|\\.)*")[ \t]+(?:-|\u2013|\u2014)[ \t]+([A-Z][^\n"]+?)([ \t]*)$/gm,
		(_, quote, credit, trail) => `${quote} (${credit.trim()})${trail}`,
	)

	// Same for blockquotes: > "…" - Name
	text = text.replace(
		/(>[ \t]*"(?:[^"\\]|\\.)*")[ \t]+(?:-|\u2013|\u2014)[ \t]+([A-Z][^\n"]+?)([ \t]*)$/gm,
		(_, quote, credit, trail) => `${quote} (${credit.trim()})${trail}`,
	)

	// Time ranges: 8 AM - 5 PM / 9:00am - 5:00pm
	text = text.replace(
		/(\d{1,2}(?::\d{2})?[ \t]*(?:AM|PM|am|pm))[ \t]+(?:-|\u2013|\u2014)[ \t]+(\d{1,2}(?::\d{2})?[ \t]*(?:AM|PM|am|pm))/g,
		"$1 to $2",
	)

	// Day ranges: Mon - Fri
	text = text.replace(
		/\b(Mon(?:day)?|Tue(?:sday)?|Wed(?:nesday)?|Thu(?:rsday)?|Fri(?:day)?|Sat(?:urday)?|Sun(?:day)?)[ \t]+(?:-|\u2013|\u2014)[ \t]+(Mon(?:day)?|Tue(?:sday)?|Wed(?:nesday)?|Thu(?:rsday)?|Fri(?:day)?|Sat(?:urday)?|Sun(?:day)?)\b/gi,
		"$1 to $2",
	)

	// Paired asides on one line:
	// will not work - steep slopes, … - that is → will not work (steep slopes, …), that is
	text = text.replace(
		/(?<=\S) (?:-|\u2013|\u2014) ([^\n-]{2,180}?) (?:-|\u2013|\u2014) (?=\S)/g,
		(_, mid) => ` (${mid.trim()}), `,
	)

	// Sentence-break asides before a new independent clause.
	text = text.replace(
		/(?<=\S) (?:-|\u2013|\u2014) (?=(?:we|they|it|this|that|you|I|our|their|these|those|most|another)\b)/g,
		". ",
	)
	text = text.replace(
		/\. (we|they|it|this|that|you|i|our|their|these|those|most|another)\b/g,
		(_, word) => `. ${word.charAt(0).toUpperCase()}${word.slice(1)}`,
	)

	// Label elaborations: after short labels prefer a colon in body copy.
	// Avoid bare "CA:" in YAML frontmatter (breaks unquoted mappings); use comma there.
	text = text.replace(
		/(?<=\b(?:services|coverage|Schedule|Call|Note|Warning|Important|Guides?)) (?:-|\u2013|\u2014) (?=\S)/g,
		": ",
	)
	text = text.replace(/(?<=\bCA) (?:-|\u2013|\u2014) (?=\S)/g, ", ")

	// Default remaining prose asides → comma.
	text = text.replace(DASH_ASIDE, ", ")

	return text
}

function countAsideDashes(source) {
	const matches = source.match(DASH_ASIDE)
	return matches?.length ?? 0
}

function rewriteFile(filePath) {
	const source = fs.readFileSync(filePath, "utf8")
	const { fence, body } = splitFrontmatter(source)

	let nextFence = fence
	if (fence) {
		const inner = fence.replace(/^---\n/, "").replace(/\n---\n$/, "")
		nextFence = `---\n${rewriteBody(inner)}\n---\n`
	}

	const next = nextFence + rewriteBody(body)
	const changed = next !== source
	if (changed && WRITE) fs.writeFileSync(filePath, next, "utf8")
	return { filePath, changed, remaining: countAsideDashes(next) }
}

const files = targets.length
	? targets.flatMap((t) => {
			const abs = path.resolve(t)
			if (fs.statSync(abs).isDirectory()) return walkMd(abs)
			return [abs]
		})
	: DEFAULT_DIRS.flatMap(walkMd)

let changedCount = 0
let remainingTotal = 0
const remainingFiles = []

for (const file of files) {
	const result = rewriteFile(file)
	if (result.changed) changedCount += 1
	if (result.remaining > 0) {
		remainingTotal += result.remaining
		remainingFiles.push(`${result.remaining}\t${path.relative(ROOT, file)}`)
	}
}

console.log(
	`${WRITE ? "Rewrote" : "Would rewrite"} ${changedCount}/${files.length} files`,
)
if (remainingFiles.length) {
	console.log(`Remaining spaced dashes: ${remainingTotal}`)
	for (const line of remainingFiles.slice(0, 40)) console.log(`  ${line}`)
} else {
	console.log("No spaced-hyphen asides remain in scanned files")
}
