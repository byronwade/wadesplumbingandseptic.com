/**
 * Browser CSRF and client-IP helpers for POST /api/quote.
 * Scripts can still spoof Origin; this only rejects missing or
 * cross-site Origin/Referer and avoids client-supplied X-Forwarded-For.
 */

function hostFromUrl(value: string | null) {
	if (!value) return null
	try {
		return new URL(value).host
	} catch {
		return null
	}
}

function firstHop(value: string | null) {
	if (!value) return null
	const hop = value.split(",")[0]?.trim()
	return hop || null
}

export function quoteClientIp(headers: Headers) {
	return (
		firstHop(headers.get("x-vercel-forwarded-for")) ||
		headers.get("x-real-ip")?.trim() ||
		firstHop(headers.get("x-forwarded-for")) ||
		"unknown"
	)
}

export function isTrustedQuoteRequest(headers: Headers) {
	const host = headers.get("host")?.trim()
	if (!host) return false

	const originHost = hostFromUrl(headers.get("origin"))
	if (originHost) return originHost === host

	const refererHost = hostFromUrl(headers.get("referer"))
	if (refererHost) return refererHost === host

	return false
}
