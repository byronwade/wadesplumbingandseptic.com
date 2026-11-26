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

test("unparseable ld+json blocks are reported", () => {
	const html = `<script type="application/ld+json">{not json</script>`
	const issues = jsonLdParseIssues(parseJsonLdScripts(html), "/broken")
	assert.ok(issues.some((issue) => issue.includes("does not parse")))
})
