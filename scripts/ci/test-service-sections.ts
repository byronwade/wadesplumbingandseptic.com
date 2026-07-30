import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import path from "node:path"

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

console.log("Service section parsing checks passed ✓")
