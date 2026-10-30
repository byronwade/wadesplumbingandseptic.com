import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"

import matter from "gray-matter"

import { splitContentBands } from "../../lib/content-conversion"
import { extractFaqPairs } from "../../lib/seo"

const dir = path.join("content", "pages", "service-area")
const files = fs.readdirSync(dir).filter((name) => name.endsWith(".md"))

// City pages answer the questions people ask assistants about their town.
// The same section feeds the FAQPage markup in components/content-page.tsx.
for (const file of files) {
	test(`${file} has a FAQ section before its closing call to action`, () => {
		const { content } = matter(fs.readFileSync(path.join(dir, file), "utf8"))
		const { sections } = splitContentBands(content)
		const index = sections.findIndex(
			(section) => section.heading === "Frequently Asked Questions",
		)
		assert.ok(index >= 0, "missing Frequently Asked Questions section")
		assert.ok(index < sections.length - 1, "FAQ must not be the last section")

		const pairs = extractFaqPairs(sections[index]!.body)
		assert.ok(
			pairs.length >= 3,
			`expected at least 3 questions, got ${pairs.length}`,
		)
		for (const pair of pairs) {
			assert.ok(pair.question.endsWith("?"), pair.question)
		}
	})
}
