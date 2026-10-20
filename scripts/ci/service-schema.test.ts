import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"

import type { ContentDocument } from "../../lib/content"
import { normalizeConversion } from "../../lib/content-conversion"
import {
	businessId,
	localBusinessJsonLd,
	serviceFaqJsonLd,
	serviceJsonLd,
} from "../../lib/seo"
import {
	extractServiceFaqs,
	parseServiceSections,
} from "../../lib/service-sections"
import { siteConfig } from "../../lib/site"

const servicesDir = path.join("content", "services")

const services = fs
	.readdirSync(servicesDir)
	.filter((file) => file.endsWith(".md"))
	.map((file) => {
		const raw = fs.readFileSync(path.join(servicesDir, file), "utf8")
		return {
			slug: file.replace(/\.md$/, ""),
			body: raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, ""),
		}
	})

function faqSectionsFor(body: string) {
	return parseServiceSections(body).sections.filter(
		(section) => section.kind === "faq",
	)
}

function documentFor(slug: string): ContentDocument {
	const title = "Sample service"
	const description = "Sample service description"
	return {
		slug,
		title,
		description,
		category: "Plumbing",
		content: "",
		conversion: normalizeConversion(null, { slug, title, description }),
	}
}

test("every service FAQ section shows its questions instead of rendering empty", () => {
	assert.ok(services.length > 0)
	const empty: string[] = []
	let withFaq = 0
	for (const service of services) {
		for (const section of faqSectionsFor(service.body)) {
			if (section.faqs.length === 0) empty.push(service.slug)
			else withFaq++
		}
	}
	assert.deepEqual(empty, [])
	assert.ok(
		withFaq >= 40,
		`expected FAQ pairs on most services, got ${withFaq}`,
	)
})

test("FAQ answers are clean text without links, markup or closing call prompts", () => {
	const problems: string[] = []
	for (const service of services) {
		for (const section of faqSectionsFor(service.body)) {
			for (const faq of section.faqs) {
				assert.ok(
					faq.question.endsWith("?"),
					`${service.slug}: ${faq.question}`,
				)
				if (/tel:|\]\(|\*\*|#|\\-|^A:|^Q:/.test(faq.answer))
					problems.push(`${service.slug}: ${faq.answer.slice(0, 80)}`)
				if (
					/^(?:Choosing|Choose|Trust|Ready|For reliable|Contact us today)\b/.test(
						faq.answer,
					)
				)
					problems.push(`${service.slug}: closing copy in answer`)
			}
		}
	}
	assert.deepEqual(problems, [])
})

test("FAQ parser reads every format used in service Markdown", () => {
	const bold = extractServiceFaqs(
		"**Can I do it myself?** Professional work is safer.\n\n**How often?** Once a year.\n\nChoosing Wade's means local help.",
	)
	assert.deepEqual(bold.faqs, [
		{ question: "Can I do it myself?", answer: "Professional work is safer." },
		{ question: "How often?", answer: "Once a year." },
	])
	assert.equal(bold.trailing, "Choosing Wade's means local help.")

	const bullets = extractServiceFaqs(
		"- **How long does it take?** \\- It depends on the [line](/x/).\n- **Is it safe?** Yes, it is safe.",
	)
	assert.deepEqual(bullets.faqs, [
		{ question: "How long does it take?", answer: "It depends on the line." },
		{ question: "Is it safe?", answer: "Yes, it is safe." },
	])

	const qa = extractServiceFaqs(
		"**Q: Can I repair it myself?**\nA: No, call a licensed professional.\n\n**Q: How often?**\n\nA: Every year.",
	)
	assert.deepEqual(qa.faqs, [
		{
			question: "Can I repair it myself?",
			answer: "No, call a licensed professional.",
		},
		{ question: "How often?", answer: "Every year." },
	])

	const headings = extractServiceFaqs(
		"Common questions:\n\n### Why does it smell?\n\nA blockage.\n\nSecond paragraph.\n\n### Is it safe?\n\nYes.\n\nReady to book? [Call us](tel:+18312254344)\n\nProtect Your Home",
	)
	assert.equal(headings.lead, "Common questions:")
	assert.deepEqual(headings.faqs, [
		{ question: "Why does it smell?", answer: "A blockage. Second paragraph." },
		{ question: "Is it safe?", answer: "Yes." },
	])
	assert.equal(
		headings.trailing,
		"Ready to book? [Call us](tel:+18312254344)\n\nProtect Your Home",
	)

	const none = extractServiceFaqs("Just a paragraph about service.")
	assert.deepEqual(none.faqs, [])
	assert.equal(none.lead, "Just a paragraph about service.")
})

test("FAQPage schema repeats only visible pairs and skips held claims", () => {
	let pages = 0
	for (const service of services) {
		const visible = faqSectionsFor(service.body).flatMap((s) => s.faqs)
		const schema = serviceFaqJsonLd(visible)
		if (!schema) continue
		pages++
		assert.equal(schema["@type"], "FAQPage")
		for (const entry of schema.mainEntity) {
			const match = visible.find((faq) => faq.question === entry.name)
			assert.ok(match, `${service.slug}: ${entry.name} is not on the page`)
			assert.equal(entry.acceptedAnswer.text, match.answer)
			assert.doesNotMatch(
				`${entry.name} ${entry.acceptedAnswer.text}`,
				/guarantee|warrant|insured|licensed|certified|years of experience|\b(?:hours?|days?|prompt|immediate|immediately|quickly|same-week|pumping|pumped)\b/i,
			)
		}
	}
	assert.ok(pages >= 40, `expected FAQPage on most services, got ${pages}`)
	assert.equal(serviceFaqJsonLd([]), null)
	assert.equal(
		serviceFaqJsonLd([
			{
				question: "Do you offer guarantees?",
				answer: "Yes, a satisfaction guarantee.",
			},
		]),
		null,
	)
})

test("FAQ schema does not promote unresolved timing claims or septic pumping", () => {
	for (const answer of [
		"Installation typically takes a few hours.",
		"Our team will provide prompt service.",
		"Contact us for immediate assistance.",
		"We offer septic pumping.",
		"Our crew is licensed.",
	]) {
		assert.equal(
			serviceFaqJsonLd([{ question: "How can you help?", answer }]),
			null,
		)
	}
	const approved = {
		question: "How do I request a quote?",
		answer: "Call 831.225.4344 for a free quote.",
	}
	const schema = serviceFaqJsonLd([
		approved,
		{ question: "How soon?", answer: "Within a few hours." },
	])
	assert.equal(schema?.mainEntity.length, 1)
	assert.equal(schema?.mainEntity[0]?.acceptedAnswer.text, approved.answer)
})

test("Service schema books through the business phone, hours and contact page", () => {
	const schema = serviceJsonLd(documentFor("drain-cleaning"))
	const url = `${siteConfig.url}/service-offerings/drain-cleaning`
	assert.equal(schema["@id"], `${url}#service`)
	assert.equal(schema.url, url)
	assert.deepEqual(schema.provider, { "@id": businessId })
	assert.deepEqual(
		schema.hoursAvailable,
		localBusinessJsonLd().openingHoursSpecification[0],
	)
	assert.equal(
		schema.availableChannel.servicePhone.telephone,
		siteConfig.phoneE164,
	)
	assert.deepEqual(
		schema.availableChannel.servicePhone.hoursAvailable,
		schema.hoursAvailable,
	)
	assert.equal(schema.availableChannel.serviceUrl, `${siteConfig.url}/contact`)
	assert.doesNotMatch(JSON.stringify(schema), /offers|price/i)
})
