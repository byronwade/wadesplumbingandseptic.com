import assert from "node:assert/strict"
import { test } from "node:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { MarkdownContent } from "../../components/markdown-content"

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
