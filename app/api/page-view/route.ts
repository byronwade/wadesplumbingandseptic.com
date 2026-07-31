import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { pageViewCookieToken, pageViewKey } from "@/lib/page-views/keys"
import {
	appendSeenToken,
	hasSeenToken,
	seenCookieOptions,
} from "@/lib/page-views/seen-cookie"
import { incrementPageView } from "@/lib/page-views/store"
import type { PageViewKind } from "@/lib/page-views/types"

const SLUG_PATTERN = /^[a-z0-9]+(?:[a-z0-9/-]*[a-z0-9])?$/i

function parseBody(
	value: unknown,
): { kind: PageViewKind; slug: string } | null {
	if (!value || typeof value !== "object") return null
	const body = value as { kind?: unknown; slug?: unknown }
	if (body.kind !== "service" && body.kind !== "tip") return null
	if (typeof body.slug !== "string") return null
	const slug = body.slug.trim()
	if (!slug || slug.length > 180 || !SLUG_PATTERN.test(slug)) return null
	return { kind: body.kind, slug: slug.toLowerCase() }
}

export async function POST(request: Request) {
	let json: unknown
	try {
		json = await request.json()
	} catch {
		return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
	}

	const parsed = parseBody(json)
	if (!parsed) {
		return NextResponse.json(
			{ error: "Invalid page view payload" },
			{ status: 400 },
		)
	}

	const key = pageViewKey(parsed.kind, parsed.slug)
	const token = pageViewCookieToken(parsed.kind, parsed.slug)

	const jar = await cookies()
	const cookieOptions = seenCookieOptions()
	const existing = jar.get(cookieOptions.name)?.value
	const isUnique = !hasSeenToken(existing, token)

	const record = await incrementPageView(key, { unique: isUnique })

	if (isUnique) {
		jar.set(cookieOptions.name, appendSeenToken(existing, token), cookieOptions)
	}

	revalidateTag("page-views", "max")

	return NextResponse.json({
		ok: true,
		unique: isUnique,
		stats: {
			unique: record.unique,
			views: record.views,
		},
	})
}
