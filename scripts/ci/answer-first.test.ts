import assert from "node:assert/strict"
import test from "node:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { AnswerFirst } from "../../components/answer-first"
import {
	answerFirstPlain,
	cityServiceFaqs,
	defaultCityServiceFaqs,
	serviceWorkLabel,
} from "../../lib/answer-first"
import { cityServicePages, getCityLocation } from "../../lib/city-service-pages"
import { freeQuoteHref, weekdayHoursPhrase } from "../../lib/public-facts"
import { serviceFaqJsonLd } from "../../lib/seo"
import {
	coverageDependsOnAddress,
	serviceAreaLocations,
} from "../../lib/service-areas"
import { siteConfig } from "../../lib/site"

test("weekday hours match the confirmed office hours string", () => {
	assert.equal(weekdayHoursPhrase(), "Monday to Friday, 9:00 AM to 5:00 PM")
	assert.ok(siteConfig.hours.startsWith(weekdayHoursPhrase()))
	assert.match(siteConfig.hours, /Closed Saturday and Sunday/)
})

test("answer-first copy names the business, area, free quote and hours", () => {
	const text = answerFirstPlain({
		work: "drain cleaning",
		place: siteConfig.serviceArea,
	})
	assert.match(
		text,
		new RegExp(siteConfig.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
	)
	assert.ok(text.includes(siteConfig.serviceArea), text)
	assert.ok(text.includes("Quotes are free"), text)
	assert.ok(text.includes(siteConfig.phone), text)
	assert.ok(text.includes(weekdayHoursPhrase()), text)
	assert.ok(text.includes("closed Saturday and Sunday"), text)
	assert.doesNotMatch(text, /Satisfaction guaranteed|Since 2005|Fast response/)
	assert.doesNotMatch(text, /24\/7|emergency/i)
	assert.equal(
		serviceWorkLabel("Drain Cleaning in Santa Cruz County"),
		"Drain Cleaning",
	)
})

test("foothill town answers require an address, not a blanket yes", () => {
	for (const city of ["los-gatos", "saratoga"]) {
		const location = serviceAreaLocations.find((item) => item.slug === city)
		assert.ok(location, city)
		assert.equal(coverageDependsOnAddress(location!), true)
		const text = answerFirstPlain({
			work: "plumbing and septic service",
			place: location!.name,
			confirmAddress: true,
		})
		assert.match(text, /selected addresses/i)
		assert.match(text, /not full-town coverage/)
		assert.match(text, /property address/)
		assert.doesNotMatch(text, new RegExp(`provides .+ in ${location!.name}\\.`))
		const html = renderToStaticMarkup(
			createElement(AnswerFirst, {
				work: "plumbing and septic service",
				place: location!.name,
				confirmAddress: true,
			}),
		)
		assert.ok(html.includes("selected addresses"), html)
		assert.ok(html.includes("not full-town coverage"), html)
		const faqs = defaultCityServiceFaqs(
			"Drain Cleaning",
			location!,
			"Hillside laterals and older homes are common here.",
			["Root intrusion", "Older laterals", "Sloped lots"],
		)
		assert.match(faqs[0]!.answer, /not the whole town/)
		assert.doesNotMatch(faqs[0]!.answer, /^Yes\./)
	}

	const aptos = serviceAreaLocations.find((item) => item.slug === "aptos")
	assert.ok(aptos)
	assert.equal(coverageDependsOnAddress(aptos!), false)
	assert.match(
		answerFirstPlain({
			work: "plumbing and septic service",
			place: aptos!.name,
		}),
		/provides plumbing and septic service in Aptos\./,
	)
})

test("the visible answer-first block matches the plain sentence", () => {
	const html = renderToStaticMarkup(
		createElement(AnswerFirst, {
			work: "drain cleaning",
			place: siteConfig.serviceArea,
		}),
	)
	assert.ok(html.includes("Quick answer"), html)
	assert.ok(html.includes("Plumbing"), html)
	assert.ok(html.includes("Septic"), html)
	assert.ok(html.includes(siteConfig.phone), html)
	assert.ok(html.includes(siteConfig.phoneHref), html)
	assert.ok(html.includes("request a free quote"), html)
	assert.ok(html.includes(weekdayHoursPhrase()), html)
})

test("answer-first omits the quote form link when email cannot send", () => {
	const html = renderToStaticMarkup(
		createElement(AnswerFirst, {
			place: siteConfig.serviceArea,
			quoteEmailReady: false,
			work: "drain cleaning",
		}),
	)
	assert.equal(html.includes(freeQuoteHref), false, html)
	assert.equal(html.includes("request a free quote"), false, html)
	assert.ok(html.includes("Quotes are free"), html)
	assert.ok(html.includes(siteConfig.phoneHref), html)
	assert.ok(html.includes(weekdayHoursPhrase()), html)
})

test("every city x service page shows at least three FAQs and FAQPage schema", () => {
	assert.ok(cityServicePages.length > 0)
	for (const page of cityServicePages) {
		const location = getCityLocation(page.citySlug)
		assert.ok(location, page.citySlug)
		const faqs = cityServiceFaqs(
			page.serviceTitle,
			location!,
			page.localAngle,
			page.commonIssues,
			page.faq,
		)
		assert.ok(
			faqs.length >= 3,
			`${page.citySlug}/${page.serviceSlug}: ${faqs.length}`,
		)
		for (const faq of faqs) {
			assert.ok(faq.question.endsWith("?"), faq.question)
			assert.ok(faq.answer.length > 20, faq.question)
		}
		const schema = serviceFaqJsonLd(faqs)
		assert.ok(
			schema,
			`${page.citySlug}/${page.serviceSlug}: expected FAQPage JSON-LD`,
		)
		assert.equal(schema!["@type"], "FAQPage")
		for (const entry of schema!.mainEntity) {
			const match = faqs.find((faq) => faq.question === entry.name)
			assert.ok(match, entry.name)
			assert.equal(entry.acceptedAnswer.text, match!.answer)
		}
	}
})
