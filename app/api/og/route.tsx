import type { NextRequest } from "next/server"

import { renderOgImage } from "@/lib/og-image"

const OG_CACHE_CONTROL =
	"public, max-age=86400, stale-while-revalidate=604800"

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl
	const title = searchParams.get("title")?.trim() || "Wade's Plumbing & Septic"
	const eyebrow = searchParams.get("eyebrow")?.trim() || undefined
	const image = searchParams.get("image")

	const imageResponse = await renderOgImage({
		title,
		eyebrow,
		image,
	})

	const contentType =
		imageResponse.headers.get("Content-Type") ?? "image/png"

	return new Response(imageResponse.body, {
		status: imageResponse.status,
		statusText: imageResponse.statusText,
		headers: {
			"Content-Type": contentType,
			"Cache-Control": OG_CACHE_CONTROL,
		},
	})
}
