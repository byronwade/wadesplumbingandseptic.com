import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"

import matter from "gray-matter"

import {
	faqSectionBody,
	normalizeConversion,
} from "../../lib/content-conversion"
import { articleJsonLd, extractFaqPairs, faqPageJsonLd } from "../../lib/seo"
import { siteConfig } from "../../lib/site"
import { jsonLdBusinessFactIssues } from "./business-facts"

const postsDir = path.join("content", "posts")
const postFiles = fs
	.readdirSync(postsDir)
	.filter((name) => name.endsWith(".md"))

const newPostSlugs = [
	"santa-cruz-septic-inspection-at-sale",
	"slab-leak-signs-santa-cruz-homes",
	"how-to-prepare-for-a-re-pipe-santa-cruz",
	"backflow-testing-santa-cruz-county-homes",
	"sewer-camera-inspection-santa-cruz-homes",
	"adding-adu-bedroom-septic-santa-cruz",
	"septic-tank-destruction-sewer-connection-santa-cruz",
	"tankless-water-heater-santa-cruz-homes",
]

test("faqSectionBody reads FAQ and Frequently asked questions headings", () => {
	assert.equal(
		faqSectionBody(
			"## FAQ\n\n### Is this a question?\n\nYes, this answer is long enough.",
		),
		"### Is this a question?\n\nYes, this answer is long enough.",
	)
	assert.equal(
		faqSectionBody(
			"## Frequently asked questions\n\n### Second question here?\n\nAnother answer that clears the length check.",
		),
		"### Second question here?\n\nAnother answer that clears the length check.",
	)
	assert.equal(faqSectionBody("## Sources\n\nNo FAQ here."), undefined)
})

test("blog posts with an FAQ heading emit extractable question pairs", () => {
	const missing: string[] = []
	const thin: string[] = []
	for (const file of postFiles) {
		const { content } = matter(
			fs.readFileSync(path.join(postsDir, file), "utf8"),
		)
		const body = faqSectionBody(content)
		if (!body) {
			missing.push(file)
			continue
		}
		const pairs = extractFaqPairs(body)
		if (pairs.length < 2) thin.push(`${file} (${pairs.length})`)
		for (const pair of pairs) {
			assert.ok(pair.question.endsWith("?"), `${file}: ${pair.question}`)
		}
	}
	assert.deepEqual(missing, [], "posts missing a FAQ heading")
	assert.deepEqual(
		thin,
		[],
		"FAQ sections with fewer than 2 extractable questions",
	)
})

test("new homeowner guides have FAQPage-ready questions and article dates", () => {
	for (const slug of newPostSlugs) {
		const file = path.join(postsDir, `${slug}.md`)
		assert.ok(fs.existsSync(file), file)
		const { data, content } = matter(fs.readFileSync(file, "utf8"))
		const body = faqSectionBody(content)
		assert.ok(body, `${slug} missing FAQ section`)
		const pairs = extractFaqPairs(body!)
		assert.ok(pairs.length >= 3, `${slug} expected at least 3 FAQ pairs`)
		const article = articleJsonLd({
			slug,
			title: String(data.title),
			description: String(data.description),
			date: String(data.date),
			updated: data.updated ? String(data.updated) : String(data.date),
			content,
			conversion: normalizeConversion(null, {
				slug,
				title: String(data.title),
				description: String(data.description),
			}),
		})
		assert.equal(article.author["@id"], `${siteConfig.url}/#business`)
		assert.equal(article.dateModified, String(data.updated ?? data.date))
		assert.deepEqual(
			jsonLdBusinessFactIssues(faqPageJsonLd(pairs)),
			[],
			`${slug} FAQ JSON-LD`,
		)
	}
})
