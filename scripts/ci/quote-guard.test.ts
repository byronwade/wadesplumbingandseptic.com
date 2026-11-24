import assert from "node:assert/strict"
import test from "node:test"

import { isTrustedQuoteRequest, quoteClientIp } from "../../lib/quote-guard"

test("a missing Origin is rejected unless Referer matches the host", () => {
	assert.equal(
		isTrustedQuoteRequest(
			new Headers({ host: "www.wadesplumbingandseptic.com" }),
		),
		false,
	)
	assert.equal(
		isTrustedQuoteRequest(
			new Headers({
				host: "www.wadesplumbingandseptic.com",
				referer: "https://www.wadesplumbingandseptic.com/contact",
			}),
		),
		true,
	)
})

test("Origin must match Host", () => {
	assert.equal(
		isTrustedQuoteRequest(
			new Headers({
				host: "www.wadesplumbingandseptic.com",
				origin: "https://www.wadesplumbingandseptic.com",
			}),
		),
		true,
	)
	assert.equal(
		isTrustedQuoteRequest(
			new Headers({
				host: "www.wadesplumbingandseptic.com",
				origin: "https://evil.example",
			}),
		),
		false,
	)
})

test("client IP prefers Vercel headers over spoofable X-Forwarded-For", () => {
	assert.equal(
		quoteClientIp(
			new Headers({
				"x-forwarded-for": "1.1.1.1, 8.8.8.8",
				"x-vercel-forwarded-for": "203.0.113.9",
			}),
		),
		"203.0.113.9",
	)
	assert.equal(
		quoteClientIp(new Headers({ "x-real-ip": "198.51.100.2" })),
		"198.51.100.2",
	)
	assert.equal(quoteClientIp(new Headers()), "unknown")
})
