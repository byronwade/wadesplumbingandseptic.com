import { contactInfo } from "@/lib/contact"
import { siteConfig } from "@/lib/site"

export const QUOTE_NAME_MAX = 80
export const QUOTE_MESSAGE_MIN = 10
export const QUOTE_MESSAGE_MAX = 1000
export const QUOTE_EMAIL_MAX = 120
export const QUOTE_PHONE_MAX = 32
export const QUOTE_TOWN_MAX = 80

export type QuoteTownOption = {
	name: string
	slug: string
}

export type QuoteRequest = {
	name: string
	phone: string
	email: string
	town: string
	message: string
}

export type QuoteField = keyof QuoteRequest

export type QuoteValidation =
	| { ok: true; value: QuoteRequest; spam: boolean }
	| { ok: false; errors: Partial<Record<QuoteField, string>> }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function asString(value: unknown): string {
	return typeof value === "string" ? value : ""
}

function collapseSpace(value: string) {
	return value.replace(/\s+/g, " ").trim()
}

export function phoneDigits(value: string) {
	return value.replace(/\D/g, "")
}

export function isValidUsPhone(value: string) {
	const digits = phoneDigits(value)
	if (digits.length === 10) return digits[0] !== "0" && digits[0] !== "1"
	if (digits.length === 11)
		return digits.startsWith("1") && digits[1] !== "0" && digits[1] !== "1"
	return false
}

function readField(
	body: Record<string, unknown>,
	key: string,
	max: number,
): string {
	return collapseSpace(asString(body[key])).slice(0, max)
}

/**
 * Validate a quote payload from JSON or form fields. Unknown towns are
 * dropped rather than rejected so a stale client cannot block a request.
 */
export function parseQuoteRequest(
	input: unknown,
	towns: readonly QuoteTownOption[],
): QuoteValidation {
	if (!input || typeof input !== "object") {
		return {
			ok: false,
			errors: { name: "Please tell us your name, phone, and what you need." },
		}
	}

	const body = input as Record<string, unknown>
	const honeypot = collapseSpace(asString(body.website ?? body.company))
	const name = readField(body, "name", QUOTE_NAME_MAX)
	const phone = readField(body, "phone", QUOTE_PHONE_MAX)
	const email = readField(body, "email", QUOTE_EMAIL_MAX).toLowerCase()
	const townSlug = readField(body, "town", QUOTE_TOWN_MAX)
	const message = collapseSpace(asString(body.message)).slice(
		0,
		QUOTE_MESSAGE_MAX,
	)

	const errors: Partial<Record<QuoteField, string>> = {}

	if (name.length < 2)
		errors.name = "Enter your name so we know who to ask for."
	if (/https?:\/\//i.test(name))
		errors.name = "Enter your name, not a web address."

	if (!isValidUsPhone(phone)) {
		errors.phone = `Enter a phone number we can call, like ${contactInfo.phoneDisplay}.`
	}

	if (email && !EMAIL_PATTERN.test(email)) {
		errors.email = "Enter an email we can reply to, or leave it blank."
	}

	if (message.length < QUOTE_MESSAGE_MIN) {
		errors.message = "Tell us a little about the plumbing or septic issue."
	}

	if (Object.keys(errors).length > 0) return { ok: false, errors }

	const town = towns.find((item) => item.slug === townSlug)?.name ?? ""

	return {
		ok: true,
		spam: honeypot.length > 0,
		value: {
			name,
			phone,
			email,
			town,
			message,
		},
	}
}

export function formatQuoteEmail(request: QuoteRequest) {
	const lines = [
		`Name: ${request.name}`,
		`Phone: ${request.phone}`,
		request.email ? `Email: ${request.email}` : "Email: (not provided)",
		request.town ? `Town: ${request.town}` : "Town: (not provided)",
		"",
		request.message,
		"",
		`Office hours: ${siteConfig.hours}.`,
	]
	return lines.join("\n")
}

export const quoteSuccessCopy = {
	title: "We got your request",
	body: `A person on the team will follow up during office hours, ${siteConfig.hours}. If you would rather talk now, call ${siteConfig.phone}.`,
} as const

export const quoteUnavailableCopy =
	`We could not send that just now. Call ${siteConfig.phone} or email ${siteConfig.email}.` as const

/** Vercel Production is the only place a missing mailer should fail closed. */
export function canAcceptWithoutMailer(vercelEnv = process.env.VERCEL_ENV) {
	return vercelEnv !== "production"
}
