import { NextResponse } from "next/server"

import {
	parseQuoteRequest,
	quoteUnavailableCopy,
	type QuoteTownOption,
} from "@/lib/quote-request"
import { deliverQuoteRequest } from "@/lib/quote-send"
import { serviceAreaLocations } from "@/lib/service-areas"

const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 5

const recent = new Map<string, number[]>()

const towns: QuoteTownOption[] = serviceAreaLocations.map((location) => ({
	name: location.name,
	slug: location.slug,
}))

function clientIp(request: Request) {
	const forwarded = request.headers.get("x-forwarded-for")
	if (forwarded) {
		const first = forwarded.split(",")[0]?.trim()
		if (first) return first
	}
	return request.headers.get("x-real-ip")?.trim() || "unknown"
}

function rateLimited(ip: string) {
	const now = Date.now()
	const stamps = (recent.get(ip) ?? []).filter(
		(stamp) => now - stamp < RATE_WINDOW_MS,
	)
	if (stamps.length >= RATE_MAX) {
		recent.set(ip, stamps)
		return true
	}
	stamps.push(now)
	recent.set(ip, stamps)
	return false
}

function isSameOrigin(request: Request) {
	const origin = request.headers.get("origin")
	if (!origin) return true
	const host = request.headers.get("host")
	if (!host) return false
	try {
		return new URL(origin).host === host
	} catch {
		return false
	}
}

function wantsJson(request: Request, contentType: string) {
	if (contentType.includes("application/json")) return true
	const accept = request.headers.get("accept") ?? ""
	return accept.includes("application/json")
}

async function readPayload(request: Request, contentType: string) {
	if (contentType.includes("application/json")) {
		return request.json() as Promise<unknown>
	}
	const form = await request.formData()
	const payload: Record<string, string> = {}
	for (const [key, value] of form.entries()) {
		if (typeof value === "string") payload[key] = value
	}
	return payload
}

function redirectTo(request: Request, path: string) {
	return NextResponse.redirect(new URL(path, request.url), 303)
}

export async function POST(request: Request) {
	if (!isSameOrigin(request)) {
		return NextResponse.json({ error: "Invalid origin" }, { status: 403 })
	}

	const ip = clientIp(request)
	if (rateLimited(ip)) {
		return NextResponse.json(
			{
				ok: false,
				error: "Please wait a few minutes before sending another request.",
			},
			{ status: 429 },
		)
	}

	const contentType = request.headers.get("content-type") ?? ""
	const json = wantsJson(request, contentType)

	let payload: unknown
	try {
		payload = await readPayload(request, contentType)
	} catch {
		if (json) {
			return NextResponse.json(
				{ error: "Invalid request body" },
				{ status: 400 },
			)
		}
		return redirectTo(request, "/contact?quote=error#quote")
	}

	const parsed = parseQuoteRequest(payload, towns)
	if (!parsed.ok) {
		if (json) {
			return NextResponse.json(
				{ ok: false, errors: parsed.errors },
				{ status: 400 },
			)
		}
		return redirectTo(request, "/contact?quote=error#quote")
	}

	if (parsed.spam) {
		if (json) return NextResponse.json({ ok: true })
		return redirectTo(request, "/thank-you")
	}

	const delivery = await deliverQuoteRequest(parsed.value)
	if (!delivery.ok) {
		if (json) {
			return NextResponse.json(
				{ ok: false, error: quoteUnavailableCopy },
				{ status: 503 },
			)
		}
		return redirectTo(request, "/contact?quote=error#quote")
	}

	if (json) return NextResponse.json({ ok: true })
	return redirectTo(request, "/thank-you")
}
