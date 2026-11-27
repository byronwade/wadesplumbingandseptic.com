import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"

import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { ContentConversionCta } from "../../components/content-conversion-cta"
import { ContentHero } from "../../components/content-hero"
import {
	GoogleReviewButton,
	GoogleReviewInvite,
} from "../../components/google-reviews"
import { SiteFooter } from "../../components/site-footer"
import { TownPageLinks } from "../../components/town-page-links"
import { normalizeConversion } from "../../lib/content-conversion"
import {
	callForFreeQuoteLabel,
	freeQuoteCtaLabel,
	freeQuoteHref,
} from "../../lib/public-facts"
import { extractFaqPairs } from "../../lib/seo"
import { serviceAreaLocations } from "../../lib/service-areas"
import { siteConfig } from "../../lib/site"
import { advertisedQuoteFormCopy } from "./json-ld-validate"

const servicesDir = path.join("content", "services")
const townDir = path.join("content", "pages", "service-area")

function splitFrontmatter(raw: string) {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
	assert.ok(match, "expected markdown frontmatter")
	return { frontmatter: match[1]!, body: match[2]! }
}

function markdownIntro(body: string) {
	return body.split(/^## /m)[0] ?? ""
}

function categoryOf(frontmatter: string) {
	const match = frontmatter.match(/^category:\s*(.+)$/m)
	return match?.[1]?.trim() ?? ""
}

test("every service intro names Santa Cruz County and a free quote", () => {
	const files = fs
		.readdirSync(servicesDir)
		.filter((name) => name.endsWith(".md"))
	assert.ok(files.length > 0)
	for (const file of files) {
		const { frontmatter, body } = splitFrontmatter(
			fs.readFileSync(path.join(servicesDir, file), "utf8"),
		)
		const intro = markdownIntro(body)
		assert.match(intro, /Santa Cruz/i, file)
		assert.match(intro, /Quotes are free/i, file)
		assert.doesNotMatch(
			intro,
			/Satisfaction guaranteed|Since 2005|Fast response/,
		)
		assert.doesNotMatch(intro, /24\s*\/\s*7|\bemergenc(?:y|ies)\b/i, file)
		if (categoryOf(frontmatter) === "Septic") {
			assert.match(intro, /do not pump|not pump/i, file)
			assert.match(intro, /engineer/i, file)
		}
	}
})

test("service-area markdown lists every mapped town and no extras", () => {
	const listed = new Set(
		[
			...fs
				.readFileSync("content/pages/service-areas.md", "utf8")
				.matchAll(/\/service-area\/([a-z0-9-]+)-ca-plumbing-septic-services/g),
		].map((match) => match[1]!),
	)
	const mapped = new Set(serviceAreaLocations.map((location) => location.slug))
	assert.deepEqual([...listed].sort(), [...mapped].sort())
})

test("contact copy only names towns already on the service-area map", () => {
	const contact = fs.readFileSync("content/pages/contact.md", "utf8")
	for (const outsider of ["Monterey", "Salinas", "San Jose", "Carmel"]) {
		assert.equal(
			contact.includes(outsider),
			false,
			`contact.md should not name ${outsider} as a served town`,
		)
	}
	assert.match(contact, /service areas/)
	assert.match(contact, /Los Gatos/)
	assert.match(contact, /Saratoga/)
	assert.match(contact, /Review us on Google/)
	assert.doesNotMatch(contact, advertisedQuoteFormCopy)
	for (const pair of extractFaqPairs(contact)) {
		assert.doesNotMatch(pair.question, advertisedQuoteFormCopy)
		assert.doesNotMatch(pair.answer, advertisedQuoteFormCopy)
	}
	assert.ok(
		contact.includes(siteConfig.googleReviewUrl),
		"contact.md should use the confirmed Google review URL",
	)
})

test("Google review CTA uses the confirmed listing URL and honest label", () => {
	const button = renderToStaticMarkup(createElement(GoogleReviewButton))
	assert.ok(button.includes(`href="${siteConfig.googleReviewUrl}"`), button)
	assert.ok(button.includes("Review us on Google"), button)
	assert.doesNotMatch(button, /★|star rating|AggregateRating|review count/i)

	const invite = renderToStaticMarkup(createElement(GoogleReviewInvite))
	assert.ok(invite.includes(`href="${siteConfig.googleReviewUrl}"`), invite)
	assert.ok(invite.includes("Review us on Google"), invite)
	assert.ok(invite.includes(siteConfig.googleBusinessUrl), invite)
})

test("homepage points past customers to Google instead of invented quotes", () => {
	const home = fs.readFileSync("components/home-below-fold.tsx", "utf8")
	const content = fs.readFileSync("lib/home-content.ts", "utf8")
	assert.doesNotMatch(home, /Bailey Cotrona|Aaron Berger/)
	assert.doesNotMatch(content, /Bailey Cotrona|Aaron Berger/)
	assert.ok(home.includes("GoogleReviewButton"), home)
	assert.ok(home.includes("siteConfig.googleBusinessUrl"), home)
	assert.match(home, /Leave us a Google review/)
	assert.doesNotMatch(home, /★|AggregateRating/)
})

test("footer review button and featured towns stay inside the mapped catalog", () => {
	const html = renderToStaticMarkup(createElement(SiteFooter))
	assert.ok(html.includes("Review us on Google"), html)
	assert.ok(html.includes(`href="${siteConfig.googleReviewUrl}"`), html)
	for (const location of serviceAreaLocations.filter(
		(item) => item.featured || item.slug === "ben-lomond",
	)) {
		assert.ok(html.includes(location.href), location.slug)
	}
	assert.doesNotMatch(html, /yelp/i)
})

test("catalog and company heroes lead with Get a Free Quote", () => {
	const servicesHero = renderToStaticMarkup(
		createElement(ContentHero, {
			description: "Plumbing and septic services for Santa Cruz County.",
			indexKind: "service",
			title: "Plumbing & Septic Services",
			variant: "index",
		}),
	)
	assert.ok(servicesHero.includes(freeQuoteCtaLabel), servicesHero)
	assert.ok(servicesHero.includes(`href="${freeQuoteHref}"`), servicesHero)
	assert.ok(
		servicesHero.includes(`href="${siteConfig.phoneHref}"`),
		servicesHero,
	)
	assert.doesNotMatch(servicesHero, /Check your town/)
	assert.ok(servicesHero.includes("/service-areas"), servicesHero)

	const aboutHero = renderToStaticMarkup(
		createElement(ContentHero, {
			description: "Family-owned plumbing and septic in Santa Cruz County.",
			title: "About Us",
			variant: "page",
		}),
	)
	const quoteIndex = aboutHero.indexOf(freeQuoteCtaLabel)
	const callIndex = aboutHero.indexOf(`href="${siteConfig.phoneHref}"`)
	assert.ok(quoteIndex !== -1 && callIndex !== -1, aboutHero)
	assert.ok(
		quoteIndex < callIndex,
		"quote CTA should come before the call button",
	)

	const aboutCallFirst = renderToStaticMarkup(
		createElement(ContentHero, {
			description: "Family-owned plumbing and septic in Santa Cruz County.",
			quoteEmailReady: false,
			title: "About Us",
			variant: "page",
		}),
	)
	assert.equal(
		aboutCallFirst.includes(`href="${freeQuoteHref}"`),
		false,
		aboutCallFirst,
	)
	assert.ok(
		aboutCallFirst.includes(`href="${siteConfig.phoneHref}"`),
		aboutCallFirst,
	)
	assert.ok(aboutCallFirst.includes(callForFreeQuoteLabel), aboutCallFirst)
})

test("service and town heroes show Call and Free Quote without JavaScript", () => {
	const serviceHero = renderToStaticMarkup(
		createElement(ContentHero, {
			description: "Drain cleaning for Santa Cruz County homes.",
			title: "Drain Cleaning in Santa Cruz County",
			variant: "service",
		}),
	)
	assert.ok(serviceHero.includes(`href="${siteConfig.phoneHref}"`), serviceHero)
	assert.ok(serviceHero.includes(`href="${freeQuoteHref}"`), serviceHero)
	assert.ok(serviceHero.includes(freeQuoteCtaLabel), serviceHero)

	const townHero = renderToStaticMarkup(
		createElement(ContentHero, {
			description: "Plumbing and septic for Felton, CA.",
			title: "Felton, CA Plumbing & Septic Services",
			variant: "page",
		}),
	)
	assert.ok(townHero.includes(`href="${siteConfig.phoneHref}"`), townHero)
	assert.ok(townHero.includes(`href="${freeQuoteHref}"`), townHero)
	assert.ok(townHero.includes(freeQuoteCtaLabel), townHero)

	const endCta = renderToStaticMarkup(
		createElement(ContentConversionCta, {
			conversion: normalizeConversion(null, {
				slug: "drain-cleaning",
				title: "Drain Cleaning in Santa Cruz County",
				description: "Drain cleaning for Santa Cruz County homes.",
			}),
		}),
	)
	assert.ok(endCta.includes(`href="${siteConfig.phoneHref}"`), endCta)
	assert.ok(endCta.includes(`href="${freeQuoteHref}"`), endCta)
	assert.ok(endCta.includes(freeQuoteCtaLabel), endCta)
})

test("town hubs keep nearby towns, services, and a quote path", () => {
	const html = renderToStaticMarkup(
		createElement(TownPageLinks, {
			pathname: "/service-area/felton-ca-plumbing-septic-services",
		}),
	)
	assert.ok(html.includes(freeQuoteCtaLabel), html)
	assert.ok(html.includes(`href="${siteConfig.phoneHref}"`), html)
	assert.ok(html.includes("/service-offerings/drain-cleaning"), html)
})

test("town pages keep a visible call path and free quote in the markdown", () => {
	const files = fs.readdirSync(townDir).filter((name) => name.endsWith(".md"))
	assert.equal(files.length, serviceAreaLocations.length)
	for (const file of files) {
		const body = splitFrontmatter(
			fs.readFileSync(path.join(townDir, file), "utf8"),
		).body
		assert.match(body, /831\.225\.4344/, file)
		assert.match(body, /Get a Free Quote|Quotes are free/i, file)
		for (const match of body.matchAll(/\[Get a Free Quote\]\(([^)]+)\)/g)) {
			assert.equal(
				match[1],
				freeQuoteHref,
				`${file}: Get a Free Quote should deep-link to ${freeQuoteHref}`,
			)
		}
		assert.doesNotMatch(body, /750 to 1,500 gallons|fifteen years/)
		assert.doesNotMatch(
			body,
			/Satisfaction guaranteed|Since 2005|Fast response/,
		)
		assert.doesNotMatch(body, /24\s*\/\s*7|\bemergenc(?:y|ies)\b/i, file)
	}
})

test("Get a Free Quote markdown links deep-link to the contact form", () => {
	function walk(dir: string) {
		for (const name of fs.readdirSync(dir)) {
			const full = path.join(dir, name)
			if (fs.statSync(full).isDirectory()) {
				walk(full)
				continue
			}
			if (!name.endsWith(".md")) continue
			const body = fs.readFileSync(full, "utf8")
			for (const match of body.matchAll(
				/\[(?:Get a Free Quote|Request service)\]\(([^)]+)\)/g,
			)) {
				assert.equal(
					match[1],
					freeQuoteHref,
					`${full}: quote CTA should deep-link to ${freeQuoteHref}`,
				)
			}
		}
	}
	walk("content")
})

test("FAQ page answers are direct and match FAQPage pairs", () => {
	const raw = fs.readFileSync("content/pages/faq.md", "utf8")
	const body = splitFrontmatter(raw).body
	const pairs = extractFaqPairs(body)
	assert.ok(
		pairs.length >= 8,
		`expected several FAQ pairs, got ${pairs.length}`,
	)
	for (const pair of pairs) {
		assert.ok(pair.question.endsWith("?"), pair.question)
		assert.match(body, new RegExp(`^### ${escapeRegExp(pair.question)}$`, "m"))
		assert.ok(pair.answer.length > 20, pair.question)
		assert.doesNotMatch(
			pair.answer,
			/Satisfaction guaranteed|Since 2005|Fast response/,
		)
		assert.doesNotMatch(pair.answer, /24\s*\/\s*7|\bemergenc(?:y|ies)\b/i)
		assert.doesNotMatch(pair.question, /\bquickly\b|\bfast response\b/i)
	}
	const pumping = pairs.find((pair) => /pump septic tanks/i.test(pair.question))
	assert.ok(pumping, "FAQ should say whether Wade's pumps tanks")
	assert.match(pumping.answer, /^No\./)
	const hours = pairs.find((pair) => /business hours/i.test(pair.question))
	assert.ok(hours, "FAQ should state office hours")
	assert.match(hours.answer, /Monday to Friday, 9:00 AM to 5:00 PM/)
})

function escapeRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
