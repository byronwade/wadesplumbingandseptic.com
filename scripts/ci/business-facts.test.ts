import assert from "node:assert/strict"
import test from "node:test"

import {
	extractContentConversion,
	normalizeConversion,
} from "../../lib/content-conversion"
import {
	businessFactIssues,
	confirmedHours,
	confirmedPricing,
} from "./business-facts"
import { sourceBusinessFactIssues } from "./business-facts-source"

test("confirmed hours and flat-rate copy pass", () => {
	assert.deepEqual(businessFactIssues("- **Saturday and Sunday:** Closed"), [])
	assert.deepEqual(
		businessFactIssues(`${confirmedHours}\n${confirmedPricing}`),
		[],
	)
	assert.deepEqual(businessFactIssues("Family owned since 2021"), [])
})

for (const text of [
	"$6",
	"$1,000 to $2,000",
	"150 dollars",
	"Price range varies",
	"Emergency repairs",
	"We do not offer 24/7",
	"After-hours dispatch",
	"Urgent repairs",
	"4.9 local rating",
	"5-star reviews",
	"Family owned since 2005",
	"Est. 2019",
	"Licensed in California & Georgia",
	"Monday to Friday, 8 AM to 6 PM",
	"Saturday, 9 AM to 3 PM",
	"Saturday 9 AM to 5 PM. Sunday closed",
	"Monday to Friday, 8 to 6",
	"Office hours Monday to Friday, 08:00 to 18:00",
]) {
	test(`rejects conflicting copy: ${text}`, () => {
		assert.ok(businessFactIssues(text).length > 0)
	})
}

for (const text of [
	"[septic pumping](/service-offerings/septic-tank-cleaning-and-pumping/)",
	"See /santa-cruz/septic-pumping for details",
	"## Essential Septic Pumping in Santa Cruz County",
	"Contact us for expert septic pumping services.",
	"Tank pumping coordination, filter service, and maintenance",
	"We plan truck access for every pump truck visit.",
	"- **Tank pumping and cleaning** with clear notes",
	"- Routine pumping sized to household use",
	"- Septic pumping with sludge-level notes",
	"We've pumped tanks at the end of one-lane drives.",
	"Our experts at Wade's will inspect your tank, pump it if necessary.",
	"Call today to schedule your septic pumping.",
]) {
	test(`rejects septic pumping offer: ${text}`, () => {
		assert.ok(businessFactIssues(text).includes("septic pumping offer"))
	})
}

for (const text of [
	"Most tanks need pumping every 3 to 5 years.",
	"Failing to pump your tank can cause overflows.",
	"A tank that hasn't been pumped in fifteen years can fail quietly.",
	"Sump pump installation keeps crawl spaces dry.",
	"Low pressure might be a failing well pump uphill.",
	"Our crews install tanks, treatment units, pumps, controls, and dispersal components.",
	"Effluent pumps and pump chambers dose the field.",
	"image: /images/services/septic-pumping-illustration.webp",
	"Not offered: septic tank pumping",
	"- **Regular Pumping of the Tank:** sludge accumulates in every system.",
]) {
	test(`allows educational or equipment pump copy: ${text}`, () => {
		assert.ok(!businessFactIssues(text).includes("septic pumping offer"))
	})
}

for (const text of [
	"Licensed Contractor: C-42 license for California",
	"**Contractor License:** C-42 (Sanitation System)",
	"We are licensed under the C-42 classification in California.",
	"Our team holds a C-42 license for California.",
	"(C-42 license for CA / state license for GA)",
]) {
	test(`rejects incomplete license claim: ${text}`, () => {
		assert.ok(businessFactIssues(text).includes("incomplete license claim"))
	})
}

for (const text of [
	"Licensed Contractor: California CSLB #1087260 (C-36 Plumbing, C-42 Sanitation System)",
	"We hold California contractor license CSLB #1087260 (C-36 Plumbing, C-42 Sanitation System).",
	"Septic work in California falls under the C-42 Sanitation System license classification.",
]) {
	test(`allows complete or educational license copy: ${text}`, () => {
		assert.ok(!businessFactIssues(text).includes("incomplete license claim"))
	})
}

test("external source URLs are not treated as copy", () => {
	assert.deepEqual(
		businessFactIssues(
			"- American Red Cross, [Frozen Pipes](https://www.redcross.org/get-help/how-to-prepare-for-emergencies/frozen-pipes.html)",
		),
		[],
	)
	assert.ok(
		businessFactIssues("[Emergency repairs](https://example.com)").length > 0,
	)
})

test("conversion fallback never generates a customer testimonial", () => {
	const conversion = normalizeConversion(null, {
		title: "Drain cleaning",
		description: "Drain cleaning in Santa Cruz County.",
	})
	assert.deepEqual(conversion.testimonials, [])
})

for (const source of [
	"const c = <p>$<strong>150</strong></p>",
	"const c = <p>Monday to Friday <strong>8 AM to 6 PM</strong></p>",
	'const c = "safe".replace("safe", "Emergency repairs")',
	'const c = { priceRange: "$$" }',
]) {
	test(`source guard rejects conflicting public copy: ${source}`, () => {
		assert.ok(sourceBusinessFactIssues(source, "fixture.tsx").length > 0)
	})
}

test("regex capture replacements and comments are not prices or copy", () => {
	assert.deepEqual(
		sourceBusinessFactIssues(
			'const c = "test".replace(/(test)/g, "$1"); // emergency is banned',
			"fixture.tsx",
		),
		[],
	)
})

test("a scheduling CTA is extracted without requiring a rating or testimonial", () => {
	const result = extractContentConversion(
		"Intro.\n\n## Schedule service\n\nCall during business hours to discuss your plumbing project.\n\n[Call us](tel:+18312254344) [Request service](/contact)\n",
		{
			title: "Drain cleaning",
			description: "Drain cleaning in Santa Cruz County.",
		},
	)
	assert.equal(result.content.trim(), "Intro.")
	assert.deepEqual(result.conversion.testimonials, [])
})
