#!/usr/bin/env -S npx tsx
/**
 * Ensures city × service pSEO rows are unique and complete.
 * Run: npm run ci:city-service
 */
import { cityServicePages, getCityLocation } from "../../lib/city-service-pages"

async function main() {
	const errors: string[] = []
	const seen = new Set()
	const localAngles = new Set()

	for (const page of cityServicePages) {
		const key = `${page.citySlug}/${page.serviceSlug}`
		if (seen.has(key)) errors.push(`Duplicate page: ${key}`)
		seen.add(key)

		if (!getCityLocation(page.citySlug)) {
			errors.push(`${key}: unknown citySlug (not in serviceAreaLocations)`)
		}

		if (!page.serviceTitle?.trim()) {
			errors.push(`${key}: missing serviceTitle`)
		}

		const angle = String(page.localAngle ?? "").trim()
		if (angle.length < 80) {
			errors.push(
				`${key}: localAngle too short (${angle.length}); need unique local detail`,
			)
		}
		if (localAngles.has(angle)) {
			errors.push(`${key}: duplicate localAngle (city-name swap risk)`)
		}
		localAngles.add(angle)

		if (!Array.isArray(page.commonIssues) || page.commonIssues.length < 3) {
			errors.push(`${key}: need at least 3 commonIssues`)
		}

		if (!Array.isArray(page.nearbySlugs) || page.nearbySlugs.length < 2) {
			errors.push(`${key}: need at least 2 nearbySlugs`)
		}

		for (const nearby of page.nearbySlugs ?? []) {
			if (!getCityLocation(nearby)) {
				errors.push(`${key}: unknown nearbySlug "${nearby}"`)
			}
		}

		const banned =
			/\u2014|\u2013|Effortless|Optimize Your|Top-Quality|Ensure Optimal|24\/7|emergency line|after-hours emergency/i
		const haystack = [
			page.serviceTitle,
			page.localAngle,
			...(page.commonIssues ?? []),
			page.permitNote ?? "",
			...(page.faq ?? []).flatMap((item) => [item.question, item.answer]),
		].join("\n")
		if (banned.test(haystack)) {
			errors.push(
				`${key}: banned dash, spammy phrase, or 24/7/emergency-line claim`,
			)
		}
	}

	console.log(`Validated ${cityServicePages.length} city × service pages`)

	if (errors.length) {
		console.error(`Errors (${errors.length}):`)
		for (const error of errors) console.error(`  - ${error}`)
		process.exit(1)
	}

	console.log("City × service validation passed")
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
