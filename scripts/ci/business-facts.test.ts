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
	"Family owned since 2021",
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
