import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

import { faqs } from "../../lib/home-content"
import {
	compactFactRows,
	factsFaqs,
	publicFactRows,
} from "../../lib/public-facts"
import {
	companyFactsJsonLd,
	faqPageJsonLd,
	localBusinessJsonLd,
	websiteJsonLd,
} from "../../lib/seo"
import { siteConfig } from "../../lib/site"
import {
	bannedPublicPhrases,
	businessFactIssues,
	confirmedHours,
	confirmedPricing,
	jsonLdBusinessFactIssues,
} from "./business-facts"

import { sourceBusinessFactIssues } from "./business-facts-source"

const errors: string[] = []
let count = 0

function check(text: string, file: string, line: number) {
	for (const issue of businessFactIssues(text))
		errors.push(`${file}:${line}: ${issue}`)
}

for (const root of [
	"content/pages",
	"content/posts",
	"content/services",
	"app",
	"components",
	"lib",
]) {
	for (const entry of fs.readdirSync(root, {
		recursive: true,
		withFileTypes: true,
	})) {
		if (!entry.isFile() || !/\.(?:md|[cm]?[jt]sx?)$/.test(entry.name)) continue
		const file = path.join(entry.parentPath, entry.name)
		const source = fs.readFileSync(file, "utf8")
		count++
		if (file.endsWith(".md")) {
			check(source, file, 1)
			continue
		}
		errors.push(...sourceBusinessFactIssues(source, file))
	}
}

assert.equal(siteConfig.hours, confirmedHours)
assert.equal(siteConfig.pricing, confirmedPricing)
assert.deepEqual(localBusinessJsonLd().openingHoursSpecification, [
	{
		"@type": "OpeningHoursSpecification",
		dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
		opens: "09:00",
		closes: "17:00",
	},
])

for (const row of [...publicFactRows(), ...compactFactRows()]) {
	const factErrors = businessFactIssues(`${row.term}. ${row.detail}`)
	if (factErrors.length)
		errors.push(`public facts "${row.term}": ${factErrors.join(", ")}`)
	for (const phrase of bannedPublicPhrases) {
		if (
			`${row.term} ${row.detail}`.toLowerCase().includes(phrase.toLowerCase())
		)
			errors.push(`public facts "${row.term}": banned phrase "${phrase}"`)
	}
}

const business = publicFactRows().find((row) => row.term === "Business")
const hours = publicFactRows().find((row) => row.term === "Hours")
const pricing = publicFactRows().find((row) => row.term === "Pricing")
const phone = publicFactRows().find((row) => row.term === "Phone")
const email = publicFactRows().find((row) => row.term === "Email")
const license = publicFactRows().find((row) => row.term === "License")
const office = publicFactRows().find((row) => row.term === "Office")
if (business?.detail !== siteConfig.name)
	errors.push("public facts Business does not match siteConfig.name")
if (hours?.detail !== siteConfig.hours)
	errors.push("public facts Hours does not match siteConfig.hours")
if (pricing?.detail !== siteConfig.pricing)
	errors.push("public facts Pricing does not match siteConfig.pricing")
if (phone?.detail !== siteConfig.phone)
	errors.push("public facts Phone does not match siteConfig.phone")
if (email?.detail !== siteConfig.email)
	errors.push("public facts Email does not match siteConfig.email")
if (license?.detail !== siteConfig.licenses)
	errors.push("public facts License does not match siteConfig.licenses")
if (office?.detail !== siteConfig.address.display)
	errors.push("public facts Office does not match siteConfig.address")

for (const faq of factsFaqs()) {
	const factErrors = businessFactIssues(`${faq.question}\n${faq.answer}`)
	if (factErrors.length)
		errors.push(`facts FAQ "${faq.question}": ${factErrors.join(", ")}`)
}

for (const [name, schema] of [
	["LocalBusiness", localBusinessJsonLd()],
	["WebSite", websiteJsonLd()],
	["homepage FAQPage", faqPageJsonLd(faqs)],
	["facts FAQPage", faqPageJsonLd(factsFaqs())],
	["company facts", companyFactsJsonLd()],
] as const) {
	for (const issue of jsonLdBusinessFactIssues(schema, name)) errors.push(issue)
}

console.log(
	`Business facts: checked ${count} public source files; ${errors.length} violations`,
)
if (errors.length) {
	console.error(errors.join("\n"))
	process.exitCode = 1
}
