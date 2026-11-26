import assert from "node:assert/strict"
import test from "node:test"

import {
	articleJsonLd,
	breadcrumbJsonLd,
	faqPageJsonLd,
	localBusinessJsonLd,
	serviceJsonLd,
} from "../../lib/seo"
import type { ContentDocument } from "../../lib/content"
import { normalizeConversion } from "../../lib/content-conversion"
import {
	jsonLdParseIssues,
	jsonLdQuoteFormIssues,
	jsonLdRequiredFieldIssues,
	parseJsonLdScripts,
} from "./json-ld-validate"

const document: ContentDocument = {
	slug: "drain-cleaning",
	title: "Drain Cleaning",
	description: "Drain cleaning in Santa Cruz County.",
	date: "2026-04-13",
	category: "Plumbing",
	content: "",
	conversion: normalizeConversion(null, {
		slug: "drain-cleaning",
		title: "Drain Cleaning",
		description: "Drain cleaning in Santa Cruz County.",
	}),
}

test("site JSON-LD generators include the required fields", () => {
	const nodes = [
		localBusinessJsonLd(),
		articleJsonLd(document),
		serviceJsonLd(document),
		faqPageJsonLd([
			{
				question: "Are quotes free?",
				answer: "Yes, quotes are free.",
			},
		]),
		breadcrumbJsonLd([
			{ name: "Home", path: "/" },
			{ name: "Drain Cleaning", path: "/service-offerings/drain-cleaning" },
		]),
	]
	for (const node of nodes) {
		assert.deepEqual(
			jsonLdRequiredFieldIssues(node),
			[],
			JSON.stringify(node["@type"]),
		)
	}
})

test("required-field checks fail closed on empty FAQ, breadcrumb, and plumber nodes", () => {
	assert.ok(
		jsonLdRequiredFieldIssues({
			"@type": "FAQPage",
			mainEntity: [],
		}).some((issue) => issue.includes("mainEntity")),
	)
	assert.ok(
		jsonLdRequiredFieldIssues({
			"@type": "BreadcrumbList",
			itemListElement: [{ "@type": "ListItem", position: 1 }],
		}).some((issue) => issue.includes("missing name")),
	)
	assert.ok(
		jsonLdRequiredFieldIssues({
			"@type": "Plumber",
			name: "Wade's Plumbing & Septic",
		}).some((issue) => issue.includes("telephone")),
	)
	assert.ok(
		jsonLdRequiredFieldIssues({
			"@type": "BlogPosting",
			headline: "A guide",
		}).some((issue) => issue.includes("datePublished")),
	)
	assert.ok(
		jsonLdRequiredFieldIssues({
			"@type": "BlogPosting",
			headline: "A guide",
			image: "https://www.wadesplumbingandseptic.com/images/example.webp",
			url: "https://www.wadesplumbingandseptic.com/a-guide",
			datePublished: "2026-11-25",
			author: { "@type": "Organization", name: "Wade's Plumbing & Septic" },
		}).some((issue) => issue.includes("dateModified")),
	)
})

test("nested OfferCatalog services only require a name", () => {
	assert.deepEqual(
		jsonLdRequiredFieldIssues({
			"@type": "Offer",
			itemOffered: {
				"@type": "Service",
				name: "Drain Cleaning",
				url: "https://www.wadesplumbingandseptic.com/service-offerings/drain-cleaning",
			},
		}),
		[],
	)
})

test("JSON-LD must not advertise a hidden quote form", () => {
	assert.deepEqual(jsonLdQuoteFormIssues(localBusinessJsonLd()), [])
	assert.deepEqual(
		jsonLdQuoteFormIssues(
			faqPageJsonLd([
				{
					question: "How do I get a quote?",
					answer: "Call 831.225.4344 or email support@wadesinc.io.",
				},
			]),
		),
		[],
	)
	assert.ok(
		jsonLdQuoteFormIssues({
			"@type": "FAQPage",
			mainEntity: [
				{
					"@type": "Question",
					name: "How do I get a quote?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Use the form on this page.",
					},
				},
			],
		}).some((issue) => issue.includes("quote form")),
	)
	assert.ok(
		jsonLdQuoteFormIssues({
			"@type": "LocalBusiness",
			potentialAction: { "@type": "ReserveAction" },
		}).some((issue) => issue.includes("potentialAction")),
	)
})

test("unparseable ld+json blocks are reported", () => {
	const html = `<script type="application/ld+json">{not json</script>`
	const issues = jsonLdParseIssues(parseJsonLdScripts(html), "/broken")
	assert.ok(issues.some((issue) => issue.includes("does not parse")))
})
