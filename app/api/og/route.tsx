import type { NextRequest } from "next/server"

import { renderOgImage } from "@/lib/og-image"

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl
	const title = searchParams.get("title")?.trim() || "Wade's Plumbing & Septic"
	const eyebrow = searchParams.get("eyebrow")?.trim() || undefined
	const image = searchParams.get("image")

	return renderOgImage({
		title,
		eyebrow,
		image,
	})
}
