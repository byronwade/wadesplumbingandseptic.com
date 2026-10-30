import assert from "node:assert/strict"
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import matter from "gray-matter"

import { extractContentConversion } from "../../lib/content-conversion"
import { sanitizeArticleContent } from "../../lib/sanitize-content"
import { parseServiceSections } from "../../lib/service-sections"

const samplePath = path.join(
	path.resolve("."),
	"content/services/septic-filter-cleaning-and-replacement.md",
)
const raw = readFileSync(samplePath, "utf8")
const body = raw.replace(/^---[\s\S]*?---\n/, "")

const { intro, sections } = parseServiceSections(body)

assert.ok(intro, "expected intro band from content before first H2")
assert.equal(intro.kind, "intro")

const kinds = sections.map((section) => section.kind)
assert.ok(
	kinds.includes("overview"),
	`expected overview, got ${kinds.join(",")}`,
)
assert.ok(kinds.includes("signs"), `expected signs, got ${kinds.join(",")}`)
assert.ok(kinds.includes("process"), `expected process, got ${kinds.join(",")}`)
assert.ok(
	kinds.includes("timeline"),
	`expected timeline, got ${kinds.join(",")}`,
)
assert.ok(kinds.includes("tips"), `expected tips, got ${kinds.join(",")}`)
assert.ok(kinds.includes("faq"), `expected faq, got ${kinds.join(",")}`)

const processSection = sections.find((section) => section.kind === "process")
assert.ok(processSection)
assert.ok(
	processSection.steps.length >= 3,
	`expected process steps from H3s, got ${processSection.steps.length}`,
)

const signs = sections.find((section) => section.kind === "signs")
assert.ok(signs)
assert.ok(signs.bullets.length >= 4, "expected sign bullets")

const faq = sections.find((section) => section.kind === "faq")
assert.ok(faq)
assert.ok(faq.faqs.length >= 3, "expected FAQ pairs")

// Headings, step titles and bullets render as plain text, outside Markdown.
const fixture = parseServiceSections(
	[
		"## **What We Do**",
		"",
		"Intro.",
		"",
		"## Our Installation Process",
		"",
		"### 1\\. Initial Consultation",
		"",
		"We visit.",
		"",
		"### 2\\. Final Inspection",
		"",
		"We test.",
	].join("\n"),
)
assert.deepEqual(
	fixture.sections.map((section) => section.heading),
	["What We Do", "Our Installation Process"],
)
assert.deepEqual(
	fixture.sections[1]?.steps.map((step) => step.title),
	["Initial Consultation", "Final Inspection"],
)

// Preserve an authored leading label separately from its explanation. Plain
// bullets and label-only bullets retain their existing single text treatment.
const labeledBullets = parseServiceSections(
	[
		"## Common Causes",
		"",
		"- **Tank Condition** We inspect the tank.",
		"- **Pressure:** Check the pressure.",
		"- **[Filter](/services/filter):** Clean the `filter`.",
		"- __Drainfield__ Check for odors.",
		"- Plain bullet.",
		"- **Label only**",
		"- Text with **emphasis** inside.",
	].join("\n"),
).sections[0]!.bullets
assert.deepEqual(labeledBullets, [
	{ text: "Tank Condition We inspect the tank.", label: "Tank Condition" },
	{ text: "Pressure: Check the pressure.", label: "Pressure:" },
	{
		text: "Filter: Clean the filter.",
		label: "Filter:",
		// Links render as links, so the authored line rides along.
		markdown: "**[Filter](/services/filter):** Clean the `filter`.",
	},
	{ text: "Drainfield Check for odors.", label: "Drainfield" },
	{ text: "Plain bullet." },
	{ text: "Label only" },
	{ text: "Text with emphasis inside." },
])

const MARKDOWN_LEFTOVER = /\*\*|__|\\[\\`*_{}[\]()#+\-.!]|\]\(/
const contentFiles = (dir: string): string[] =>
	readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const file = path.join(dir, entry.name)
		if (entry.isDirectory()) return contentFiles(file)
		return entry.name.endsWith(".md") ? [file] : []
	})

for (const file of contentFiles("content")) {
	const { data, content } = matter(readFileSync(file, "utf8"))
	const slug = path.basename(file, ".md")
	const title = String(data.title ?? slug)
	const parsed = extractContentConversion(sanitizeArticleContent(content), {
		title,
		description: String(data.description ?? ""),
		slug,
		eyebrow: data.eyebrow ? String(data.eyebrow) : undefined,
	})

	const { description } = parsed.conversion
	assert.ok(
		!MARKDOWN_LEFTOVER.test(description) && !description.startsWith("!"),
		`${file}: closing CTA text shows Markdown: ${description}`,
	)
	// A dropped link leaves a word followed straight by punctuation or "and.".
	assert.ok(
		!/\s[,.]|,,|\b(?:and|or|for|at|about)\.$/.test(description),
		`${file}: closing CTA text lost words: ${description}`,
	)

	if (!file.includes(`${path.sep}services${path.sep}`)) continue
	for (const section of parseServiceSections(parsed.content).sections) {
		const plain = [
			section.heading,
			...section.steps.map((step) => step.title),
			...section.bullets.map((bullet) => bullet.text),
		]
		for (const text of plain) {
			assert.ok(
				!MARKDOWN_LEFTOVER.test(text) && text.replace(/\W/g, ""),
				`${file}: "${section.heading}" shows Markdown or is empty: ${text}`,
			)
		}
	}
}

console.log("Service section parsing checks passed ✓")
