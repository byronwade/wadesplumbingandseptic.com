import type { NextRequest } from "next/server"

import { renderOgImage } from "@/lib/og-image"

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl
	const title = searchParams.get("title")?.trim() || "Wade's Plumbing & Septic"
	const eyebrow = searchParams.get("eyebrow")?.trim() || undefined
	const image = searchParams.get("image")

	const response = await renderOgImage({
		title,
		eyebrow,
		image,
	})
	response.headers.set(
		"Cache-Control",
		"public, max-age=86400, stale-while-revalidate=604800",
	)
	return response
}
