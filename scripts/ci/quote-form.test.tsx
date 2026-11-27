import assert from "node:assert/strict"
import test from "node:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { QuoteForm } from "../../components/quote-form"
import { contactInfo } from "../../lib/contact"
import { freeQuoteCtaLabel } from "../../lib/public-facts"
import { quoteUnavailableCopy } from "../../lib/quote-request"
import { siteConfig } from "../../lib/site"

const html = renderToStaticMarkup(
	createElement(QuoteForm, {
		towns: [
			{ name: "Santa Cruz", slug: "santa-cruz" },
			{ name: "Felton", slug: "felton" },
		],
	}),
)

test("the quote form is usable in server HTML before JavaScript", () => {
	assert.ok(html.includes('action="/api/quote"'), html)
	assert.ok(html.includes('method="post"'), html)
	assert.ok(html.includes('name="name"'), html)
	assert.ok(html.includes('name="phone"'), html)
	assert.ok(html.includes('name="email"'), html)
	assert.ok(html.includes('name="town"'), html)
	assert.ok(html.includes('name="message"'), html)
	assert.ok(html.includes('name="website"'), html)
	assert.ok(html.includes(">Name</label>"), html)
	assert.ok(html.includes(">Phone</label>"), html)
	assert.ok(html.includes(freeQuoteCtaLabel), html)
	assert.ok(html.includes("Quotes are free"), html)
	assert.ok(html.includes(siteConfig.pricing.split(",")[0]!), html)
})

test("quote form copy does not invent prices, hours claims, or pumping", () => {
	assert.doesNotMatch(html, /Satisfaction guaranteed|Since 2005|Fast response/)
	assert.doesNotMatch(html, /24\/7|emergency|pumping/i)
	assert.doesNotMatch(html, /\$\d/)
})

test("a redirected failure is visible in server HTML without JavaScript", () => {
	const errorHtml = renderToStaticMarkup(
		createElement(QuoteForm, {
			initialError: quoteUnavailableCopy,
			towns: [
				{ name: "Santa Cruz", slug: "santa-cruz" },
				{ name: "Felton", slug: "felton" },
			],
		}),
	)
	assert.ok(errorHtml.includes(quoteUnavailableCopy), errorHtml)
	assert.ok(errorHtml.includes('role="alert"'), errorHtml)
	assert.ok(errorHtml.includes('tabindex="-1"'), errorHtml)
	assert.ok(errorHtml.includes('action="/api/quote"'), errorHtml)
	assert.ok(errorHtml.includes(`href="${contactInfo.phoneHref}"`), errorHtml)
	assert.ok(errorHtml.includes(`href="${contactInfo.emailHref}"`), errorHtml)
	assert.ok(errorHtml.includes("flex min-w-0 flex-col flex-wrap"), errorHtml)
})
