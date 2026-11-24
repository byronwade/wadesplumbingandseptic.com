import "server-only"

import { put } from "@vercel/blob"

import {
	canAcceptWithoutMailer,
	formatQuoteEmail,
	quoteDefaultFrom,
	type QuoteRequest,
} from "@/lib/quote-request"
import { siteConfig } from "@/lib/site"

export type QuoteDelivery =
	| { ok: true; channel: "email" | "dev" }
	| { ok: false; reason: "unavailable" | "upstream" }

function quoteFromAddress() {
	const override = process.env.QUOTE_FROM_EMAIL?.trim()
	return override || quoteDefaultFrom
}

async function storeQuoteBackup(request: QuoteRequest) {
	if (!process.env.BLOB_READ_WRITE_TOKEN) return

	const stamp = new Date().toISOString().replaceAll(":", "-")
	await put(
		`quotes/${stamp}.json`,
		JSON.stringify({
			receivedAt: new Date().toISOString(),
			...request,
		}),
		{
			access: "private",
			addRandomSuffix: true,
			contentType: "application/json",
		},
	)
}

async function sendResend(apiKey: string, request: QuoteRequest) {
	const body: Record<string, unknown> = {
		from: quoteFromAddress(),
		to: [siteConfig.email],
		subject: `Free quote request from ${request.name}`,
		text: formatQuoteEmail(request),
	}
	if (request.email) body.reply_to = request.email

	const response = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	})

	if (!response.ok) {
		console.error("quote: resend rejected", response.status)
	}

	return response.ok
}

export async function deliverQuoteRequest(
	request: QuoteRequest,
): Promise<QuoteDelivery> {
	const apiKey = process.env.RESEND_API_KEY
	if (apiKey) {
		try {
			const sent = await sendResend(apiKey, request)
			if (sent) {
				try {
					await storeQuoteBackup(request)
				} catch (error) {
					console.error("quote: backup store failed", error)
				}
				return { ok: true, channel: "email" }
			}
		} catch (error) {
			console.error("quote: email send failed", error)
		}
		if (!canAcceptWithoutMailer()) {
			return { ok: false, reason: "upstream" }
		}
	}

	/*
	  Next can compile route handlers with NODE_ENV=production even during
	  `next dev`. Only Vercel Production must require a mailer; local and
	  preview keep a working success path so the form can be tested.
	*/
	if (canAcceptWithoutMailer()) {
		console.info("[quote] accepted without email (not Vercel Production)")
		return { ok: true, channel: "dev" }
	}

	return { ok: false, reason: "unavailable" }
}
