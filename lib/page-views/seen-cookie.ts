import {
	PAGE_VIEW_COOKIE_MAX_AGE,
	PAGE_VIEW_COOKIE_MAX_ENTRIES,
	PAGE_VIEW_COOKIE_NAME,
} from "@/lib/page-views/types"

export function parseSeenCookie(value: string | undefined) {
	if (!value) return [] as string[]
	return value
		.split(".")
		.map((token) => token.trim())
		.filter(Boolean)
}

export function serializeSeenCookie(tokens: string[]) {
	const unique = [...new Set(tokens)].slice(-PAGE_VIEW_COOKIE_MAX_ENTRIES)
	return unique.join(".")
}

export function hasSeenToken(cookieValue: string | undefined, token: string) {
	return parseSeenCookie(cookieValue).includes(token)
}

export function appendSeenToken(cookieValue: string | undefined, token: string) {
	const tokens = parseSeenCookie(cookieValue).filter((item) => item !== token)
	tokens.push(token)
	return serializeSeenCookie(tokens)
}

export function seenCookieOptions() {
	return {
		name: PAGE_VIEW_COOKIE_NAME,
		httpOnly: true,
		sameSite: "lax" as const,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: PAGE_VIEW_COOKIE_MAX_AGE,
	}
}
