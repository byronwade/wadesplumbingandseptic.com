import assert from "node:assert/strict"
import test from "node:test"

import { contactInfo } from "../../lib/contact"
import {
	formatQuoteEmail,
	canAcceptWithoutMailer,
	isValidUsPhone,
	parseQuoteRequest,
	phoneDigits,
	quoteSuccessCopy,
	quoteUnavailableCopy,
	type QuoteTownOption,
} from "../../lib/quote-request"
import { siteConfig } from "../../lib/site"

const towns: QuoteTownOption[] = [
	{ name: "Santa Cruz", slug: "santa-cruz" },
	{ name: "Felton", slug: "felton" },
]

const valid = {
	name: "Alex Rivera",
	phone: "831.225.0000",
	email: "alex@example.com",
	town: "felton",
	message: "Slow kitchen drain and a septic alarm light.",
}

test("valid US phone numbers keep ten or eleven digits", () => {
	assert.equal(phoneDigits("(831) 225-0000"), "8312250000")
	assert.equal(isValidUsPhone("831.225.0000"), true)
	assert.equal(isValidUsPhone("+1 831 225 0000"), true)
	assert.equal(isValidUsPhone("123"), false)
	assert.equal(isValidUsPhone("011-555-0000"), false)
})

test("a complete request maps the town slug and keeps the note", () => {
	const parsed = parseQuoteRequest(valid, towns)
	assert.equal(parsed.ok, true)
	if (!parsed.ok) return
	assert.equal(parsed.spam, false)
	assert.equal(parsed.value.town, "Felton")
	assert.equal(parsed.value.email, "alex@example.com")
	assert.match(formatQuoteEmail(parsed.value), /Slow kitchen drain/)
})

test("unknown towns are dropped instead of blocking the request", () => {
	const parsed = parseQuoteRequest({ ...valid, town: "not-a-town" }, towns)
	assert.equal(parsed.ok, true)
	if (!parsed.ok) return
	assert.equal(parsed.value.town, "")
})

test("missing name, phone, or message return field errors", () => {
	const parsed = parseQuoteRequest(
		{ name: "A", phone: "123", email: "", town: "", message: "Too short" },
		towns,
	)
	assert.equal(parsed.ok, false)
	if (parsed.ok) return
	assert.ok(parsed.errors.name)
	assert.ok(parsed.errors.phone)
	assert.ok(parsed.errors.message)
	assert.equal(parsed.errors.email, undefined)
})

test("email is optional, and a bad address is rejected", () => {
	const blank = parseQuoteRequest({ ...valid, email: "" }, towns)
	assert.equal(blank.ok, true)
	const bad = parseQuoteRequest({ ...valid, email: "not-an-email" }, towns)
	assert.equal(bad.ok, false)
	if (bad.ok) return
	assert.ok(bad.errors.email)
})

test("a filled honeypot is marked spam without failing validation", () => {
	const parsed = parseQuoteRequest(
		{ ...valid, website: "https://spam.test" },
		towns,
	)
	assert.equal(parsed.ok, true)
	if (!parsed.ok) return
	assert.equal(parsed.spam, true)
})

test("only Vercel Production requires a mailer", () => {
	assert.equal(canAcceptWithoutMailer(undefined), true)
	assert.equal(canAcceptWithoutMailer("preview"), true)
	assert.equal(canAcceptWithoutMailer("production"), false)
})

test("success and fallback copy stay inside confirmed facts", () => {
	assert.match(quoteSuccessCopy.body, new RegExp(siteConfig.hours))
	assert.match(
		quoteSuccessCopy.body,
		new RegExp(siteConfig.phone.replaceAll(".", "\\.")),
	)
	assert.match(
		quoteUnavailableCopy,
		new RegExp(contactInfo.phoneDisplay.replaceAll(".", "\\.")),
	)
	assert.match(quoteUnavailableCopy, new RegExp(contactInfo.email))
	for (const text of [
		quoteSuccessCopy.title,
		quoteSuccessCopy.body,
		quoteUnavailableCopy,
	]) {
		assert.doesNotMatch(
			text,
			/Satisfaction guaranteed|Since 2005|Fast response|24\/7|emergency/i,
		)
		assert.doesNotMatch(text, /\$\d/)
	}
})
