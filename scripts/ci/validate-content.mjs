#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const ROOT = path.join(process.cwd(), "content")
const COLLECTIONS = ["pages", "posts", "services"]

const required = ["title", "description"]
const errors = []
const warnings = []
let count = 0

function walk(dir) {
	if (!fs.existsSync(dir)) return []
	return fs
		.readdirSync(dir, { withFileTypes: true, recursive: true })
		.filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
		.map((entry) => path.join(entry.parentPath, entry.name))
}

for (const collection of COLLECTIONS) {
	const files = walk(path.join(ROOT, collection))
	if (files.length === 0) {
		errors.push(`Collection missing or empty: ${collection}`)
		continue
	}

	for (const file of files) {
		count += 1
		const source = fs.readFileSync(file, "utf8")
		let data
		try {
			;({ data } = matter(source))
		} catch (error) {
			errors.push(`${file}: invalid frontmatter (${error.message})`)
			continue
		}

		for (const key of required) {
			if (!data[key] || String(data[key]).trim() === "") {
				errors.push(`${file}: missing frontmatter field "${key}"`)
			}
		}

		if (collection === "posts" && !data.date) {
			warnings.push(`${file}: post missing date`)
		}

		if (data.image && typeof data.image === "string") {
			const imagePath = data.image.startsWith("/")
				? path.join(process.cwd(), "public", data.image)
				: null
			if (imagePath && !fs.existsSync(imagePath)) {
				warnings.push(`${file}: image not found at public${data.image}`)
			}
		}

		// Dash punctuation is banned site-wide (see AGENTS.md).
		if (
			source.includes("\u2014") ||
			source.includes("&mdash;") ||
			source.includes("&#8212;")
		) {
			errors.push(
				`${file}: em dash (U+2014) is not allowed; use parentheses, a comma, a colon, or a new sentence`,
			)
		}

		if (
			source.includes("\u2013") ||
			source.includes("&ndash;") ||
			source.includes("&#8211;")
		) {
			errors.push(
				`${file}: en dash (U+2013) is not allowed; use "to"/"through" for ranges, or other real punctuation`,
			)
		}

		// Spaced hyphen asides ("word - word"), excluding markdown list markers.
		if (/(?<=\S) - (?=\S)/.test(source)) {
			errors.push(
				`${file}: spaced hyphen aside (" - ") is not allowed; use parentheses, a comma, a colon, or a new sentence`,
			)
		}

		const emails = source.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? []
		for (const email of emails) {
			if (email.toLowerCase() !== "support@wadesinc.io") {
				errors.push(
					`${file}: email "${email}" is not allowed; use support@wadesinc.io`,
				)
			}
		}

		const title = String(data.title ?? "")
		if (
			/Effortless|Optimize Your|Top-Quality|Ensure Optimal|Boost Business|Clear Pipes Guaranteed|Transform Your/i.test(
				title,
			)
		) {
			errors.push(
				`${file}: spammy/AI-ish title pattern; lead with the service noun and geo (e.g. "Drain Cleaning in Santa Cruz County")`,
			)
		}

		const description = String(data.description ?? "")
		if (/In This Guide/i.test(description) || /min read/i.test(description)) {
			errors.push(
				`${file}: description looks like a table-of-contents leak; rewrite the meta description`,
			)
		}
		if (/…/.test(description) || /\.\.\.$/.test(description.trim())) {
			errors.push(
				`${file}: description is truncated with an ellipsis; finish the sentence`,
			)
		}
		if (description.trim().length > 0 && description.trim().length < 70) {
			warnings.push(
				`${file}: description is short (${description.trim().length} chars); aim for ~120-158`,
			)
		}

		if (
			/\[Current Date\]/i.test(source) ||
			/\[Insert[^\]]*\]/i.test(source) ||
			/TODO:?\s*replace/i.test(source)
		) {
			errors.push(
				`${file}: unresolved content placeholder (e.g. [Current Date])`,
			)
		}

		const fakePhones =
			source.match(
				/tel:\+?(?:1(?:800|831|833)555\d{4}|11234567890|1234567890|18315556677|19876543210)/gi,
			) ?? []
		for (const phone of fakePhones) {
			errors.push(`${file}: fake phone link "${phone}"; use tel:+18312254344`)
		}

		// Business-hours only: no 24/7 or "emergency line" claims.
		if (/emergency line/i.test(source)) {
			errors.push(
				`${file}: claims an "emergency line"; Wade's does not offer 24/7 or after-hours dispatch`,
			)
		}
		if (/24\/7/i.test(source) && !/do not offer 24\/7/i.test(source)) {
			errors.push(
				`${file}: claims 24/7 availability; use business hours (Mon to Fri 9:00am to 5:00pm) or explicit "do not offer 24/7"`,
			)
		}

		if (
			/Updated (January|February|March|April|May|June|July|August|September|October|November|December) \d{4}/.test(
				source,
			)
		) {
			errors.push(
				`${file}: "Updated Month Year" filler copy; use frontmatter updated: YYYY-MM-DD and real body prose`,
			)
		}

		if (
			/Competitor gap:|Competitor gap|redwoodpipeanddrain\.com|plumbtreeplumbing\.com/i.test(
				source,
			)
		) {
			errors.push(
				`${file}: competitor-gap research notes or outbound competitor links must not ship in published content`,
			)
		}

		if (
			/\/(?:lp\/)?(?:engineered-septic-systems|failed-septic-repair|emergency-plumber|plumbing-repair-services|water-main-sewer-line-repair)-santa-cruz-county/i.test(
				source,
			)
		) {
			errors.push(
				`${file}: links to a noindex campaign LP; point to /service-offerings/... instead`,
			)
		}

		if (/water-heater-replacment/.test(source)) {
			errors.push(
				`${file}: typo slug water-heater-replacment; use water-heater-replacement`,
			)
		}
	}
}

console.log(
	`Validated ${count} markdown files across ${COLLECTIONS.join(", ")}`,
)
if (warnings.length) {
	console.log(`Warnings (${warnings.length}):`)
	for (const warning of warnings.slice(0, 50)) console.log(`  - ${warning}`)
	if (warnings.length > 50) console.log(`  … ${warnings.length - 50} more`)
}

if (errors.length) {
	console.error(`Errors (${errors.length}):`)
	for (const error of errors) console.error(`  - ${error}`)
	process.exit(1)
}

console.log("Content validation passed")
