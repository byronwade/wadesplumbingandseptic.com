import assert from "node:assert/strict"
import { test } from "node:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { classifyBand } from "../../components/content-section-bands"
import { MarkdownContent } from "../../components/markdown-content"
import { siteConfig } from "../../lib/site"

const image = "![Pipe inspection](/images/inspection.webp)"

function render(content: string) {
	return renderToStaticMarkup(createElement(MarkdownContent, { content }))
}

// Browsers close a paragraph before these elements. If the server emits them
// inside a paragraph, the parsed DOM no longer matches React's hydration tree.
function assertValidParagraphs(html: string) {
	const paragraphs = [...html.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/g)]
	for (const [, body] of paragraphs) {
		assert.doesNotMatch(
			body,
			/<(?:address|article|aside|blockquote|div|dl|fieldset|figcaption|figure|footer|form|h[1-6]|header|hr|main|nav|ol|p|pre|section|table|ul)(?:\s|>)/i,
			"Markdown must not emit block elements inside paragraphs",
		)
	}
}

for (const [name, content] of [
	["standalone image", image],
	["image between text", `Before ${image} after.`],
	["linked image", `[${image}](/contact)`],
	["emphasized image", `**${image}**`],
	["multiple images", `${image} ${image}`],
	["image in a loose list", `- Introduction\n\n  ${image}\n\n- Next item`],
	["image in a blockquote", `> ${image}`],
	["image in a table", `| Photo |\n| --- |\n| ${image} |`],
]) {
	test(`${name} preserves valid paragraph HTML and accessible image data`, () => {
		const html = render(content)
		assertValidParagraphs(html)
		assert.match(html, /<img\s[^>]*alt="Pipe inspection"/)
		assert.match(decodeURIComponent(html), /\/images\/inspection\.webp/)
		assert.match(html, /loading="lazy"/)
		if (name === "linked image") {
			assert.match(html, /href="\/contact"/)
		}
	})
}

test("remote images remain descriptive external links", () => {
	const html = render("![Reference photo](https://example.com/photo.webp)")
	assertValidParagraphs(html)
	assert.doesNotMatch(html, /<img\s/)
	assert.match(html, /href="https:\/\/example\.com\/photo\.webp"/)
	assert.match(html, />Reference photo<\/a>/)
})

test("ordinary paragraphs and contextual links remain intact", () => {
	const html = render(
		"A **helpful** paragraph with a [contact link](/contact).",
	)
	assertValidParagraphs(html)
	assert.match(html, /<p>A <strong>helpful<\/strong> paragraph/)
	assert.match(html, /href="\/contact"/)
	assert.doesNotMatch(html, /<img\s/)
})

test("Markdown call links work in server HTML before JavaScript", () => {
	const html = render(`[Call Wade's](${siteConfig.phoneHref})`)
	assert.ok(html.includes(`href="${siteConfig.phoneHref}"`), html)
	assert.match(html, />Call Wade&#x27;s<\/a>/)
})

test("Markdown email addresses wrap only after the @, linked or bare", () => {
	const wrappable = siteConfig.email.replace("@", "@<wbr/>")
	for (const source of [
		`Email [${siteConfig.email}](mailto:${siteConfig.email}).`,
		`Or email ${siteConfig.email}.`,
	]) {
		const html = render(source)
		assert.ok(html.includes(`href="mailto:${siteConfig.email}"`), html)
		assert.ok(html.includes(`>${wrappable}</a>`), html)
	}
	assert.match(
		render(`[Email us](mailto:${siteConfig.email})`),
		/>Email us<\/a>/,
	)
})

test("custom renderers never leak the syntax tree node into HTML attributes", () => {
	const html = renderToStaticMarkup(
		createElement(MarkdownContent, {
			content: [
				"# Demoted heading",
				"",
				`[Internal](/contact) [External](https://example.com) [Call](${siteConfig.phoneHref}) [Email](mailto:${siteConfig.email})`,
				"",
				"| Column |",
				"| --- |",
				"| Cell |",
			].join("\n"),
			demoteH1: true,
		}),
	)
	assert.match(html, /<h2>Demoted heading<\/h2>/)
	assert.match(html, /<table>/)
	assert.equal((html.match(/<a\s/g) ?? []).length, 4, html)
	assert.doesNotMatch(html, /\snode=/, html)
	assert.doesNotMatch(html, /\sclass=""/, html)
})

test("Markdown still blocks unsafe and unsupported URL protocols", () => {
	for (const url of [
		"javascript:unsafe",
		"vbscript:unsafe",
		"data:text/html,unsafe",
		"custom:unsafe",
	]) {
		const html = render(`[Unsafe link](${url})`)
		assert.ok(!html.includes(`href="${url}"`), html)
	}
})

test("step lists stay prose; only question headings become an FAQ accordion", () => {
	const steps =
		"### What We Help With\n\n- Full System Replacement\n- Permit & Timeline Planning\n\n### What Happens Next\n\n1.  Phone qualification call\n2.  On-site evaluation and soil/permit review\n"
	assert.equal(classifyBand("Septic System Replacement", steps), "prose")

	const questions =
		"### Do I need a permit?\n\nYes. Septic replacements require a county permit.\n\n### Who handles permitting?\n\nWe coordinate permitting with the county for you.\n"
	assert.equal(classifyBand("Common questions", questions), "faq")
	assert.equal(classifyBand("FAQ", "Short answers below."), "faq")
})
