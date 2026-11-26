import assert from "node:assert/strict"
import test from "node:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { ContactLead } from "../../components/contact-lead"
import { ContentConversionCta } from "../../components/content-conversion-cta"
import { ContentHero } from "../../components/content-hero"
import { LeadActions } from "../../components/lead-actions"
import { QuoteCallEmail } from "../../components/quote-call-email"
import { normalizeConversion } from "../../lib/content-conversion"
import { contactInfo } from "../../lib/contact"
import {
	callForFreeQuoteLabel,
	freeQuoteCtaLabel,
	freeQuoteHref,
	weekdayHoursPhrase,
} from "../../lib/public-facts"
import { siteConfig } from "../../lib/site"

function renderLead(quoteEmailReady: boolean) {
	return renderToStaticMarkup(
		createElement(LeadActions, { quoteEmailReady, quoteArrow: true }),
	)
}

test("configured lead actions keep Get a Free Quote as the primary button", () => {
	const html = renderLead(true)
	const quoteIndex = html.indexOf(freeQuoteCtaLabel)
	const callIndex = html.indexOf(`href="${contactInfo.phoneHref}"`)
	assert.ok(quoteIndex !== -1 && callIndex !== -1, html)
	assert.ok(
		quoteIndex < callIndex,
		"quote CTA should come before the call button",
	)
	assert.ok(html.includes(`href="${freeQuoteHref}"`), html)
	assert.doesNotMatch(html, new RegExp(callForFreeQuoteLabel))
})

test("unconfigured lead actions make Call primary and hide the quote form link", () => {
	const html = renderLead(false)
	assert.equal(html.includes(`href="${freeQuoteHref}"`), false, html)
	assert.ok(html.includes(`href="${contactInfo.phoneHref}"`), html)
	assert.ok(html.includes(contactInfo.phoneDisplay), html)
	assert.ok(html.includes(callForFreeQuoteLabel), html)
	assert.doesNotMatch(html, new RegExp(`>${freeQuoteCtaLabel}<`))
})

test("catalog heroes stay Quote-first when email is configured and Call-first when not", () => {
	const ready = renderToStaticMarkup(
		createElement(ContentHero, {
			description: "Plumbing and septic services for Santa Cruz County.",
			indexKind: "service",
			quoteEmailReady: true,
			title: "Plumbing & Septic Services",
			variant: "index",
		}),
	)
	assert.ok(ready.includes(freeQuoteCtaLabel), ready)
	assert.ok(
		ready.indexOf(freeQuoteCtaLabel) <
			ready.indexOf(`href="${siteConfig.phoneHref}"`),
		ready,
	)

	const paused = renderToStaticMarkup(
		createElement(ContentHero, {
			description: "Plumbing and septic services for Santa Cruz County.",
			indexKind: "service",
			quoteEmailReady: false,
			title: "Plumbing & Septic Services",
			variant: "index",
		}),
	)
	assert.equal(paused.includes(`href="${freeQuoteHref}"`), false, paused)
	assert.ok(paused.includes(`href="${siteConfig.phoneHref}"`), paused)
	assert.ok(paused.includes(callForFreeQuoteLabel), paused)
})

test("the call-or-email block has phone, email, hours, and no form", () => {
	const html = renderToStaticMarkup(createElement(QuoteCallEmail))
	assert.equal(html.includes('action="/api/quote"'), false, html)
	assert.ok(html.includes(`href="${contactInfo.phoneHref}"`), html)
	assert.ok(html.includes(contactInfo.phoneDisplay), html)
	assert.ok(html.includes(`href="${contactInfo.emailHref}"`), html)
	assert.ok(html.includes(contactInfo.email), html)
	assert.ok(html.includes(weekdayHoursPhrase()), html)
	assert.doesNotMatch(html, /Satisfaction guaranteed|Since 2005|Fast response/)
	assert.doesNotMatch(html, /24\/7|emergency|pumping/i)
	assert.doesNotMatch(html, /\$\d/)
})

test("page-end conversion bands swap Quote-first for Call-first", () => {
	const conversion = normalizeConversion(null, {
		slug: "drain-cleaning",
		title: "Drain Cleaning in Santa Cruz County",
		description: "Drain cleaning for Santa Cruz County homes.",
	})
	const ready = renderToStaticMarkup(
		createElement(ContentConversionCta, {
			conversion,
			quoteEmailReady: true,
		}),
	)
	assert.ok(ready.includes(freeQuoteCtaLabel), ready)
	assert.ok(
		ready.indexOf(freeQuoteCtaLabel) <
			ready.indexOf(`href="${contactInfo.phoneHref}"`),
		ready,
	)

	const paused = renderToStaticMarkup(
		createElement(ContentConversionCta, {
			conversion,
			quoteEmailReady: false,
		}),
	)
	assert.equal(paused.includes(`href="${freeQuoteHref}"`), false, paused)
	assert.ok(paused.includes(`href="${contactInfo.phoneHref}"`), paused)
	assert.ok(paused.includes(callForFreeQuoteLabel), paused)
})

test("contact lead swaps the form for call-or-email when quote email is down", () => {
	const ready = renderToStaticMarkup(
		createElement(ContactLead, { quoteEmailReady: true }),
	)
	assert.ok(ready.includes('id="quote"'), ready)
	assert.ok(ready.includes("Tell us what you need"), ready)
	/*
	  QuoteForm loads through import() so this static render does not inline
	  the form module. The form's no-JS markup is covered by quote-form tests.
	*/

	const paused = renderToStaticMarkup(
		createElement(ContactLead, { quoteEmailReady: false }),
	)
	assert.ok(paused.includes('id="quote"'), paused)
	assert.equal(paused.includes('action="/api/quote"'), false, paused)
	assert.ok(paused.includes(callForFreeQuoteLabel), paused)
	assert.ok(paused.includes(`href="${contactInfo.phoneHref}"`), paused)
	assert.ok(paused.includes(`href="${contactInfo.emailHref}"`), paused)
	assert.ok(paused.includes(weekdayHoursPhrase()), paused)
})
