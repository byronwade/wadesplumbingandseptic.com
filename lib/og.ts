import { siteConfig } from "@/lib/site"

export const OG_WIDTH = 1200
export const OG_HEIGHT = 630

export type OgImageInput = {
	title: string
	eyebrow?: string
	/** Site-relative image path under /images/… */
	image?: string
}

/** Only allow first-party public images through the OG compositor. */
export function sanitizeOgImagePath(image: string | undefined): string | null {
	if (!image) return null

	let pathname = image
	if (image.startsWith("http://") || image.startsWith("https://")) {
		try {
			const url = new URL(image)
			const site = new URL(siteConfig.url)
			if (url.hostname !== site.hostname && url.hostname !== "localhost") {
				return null
			}
			pathname = url.pathname
		} catch {
			return null
		}
	}

	if (!pathname.startsWith("/")) pathname = `/${pathname}`
	if (!pathname.startsWith("/images/")) return null
	if (pathname.includes("..")) return null
	return pathname
}

/** Relative OG image path for Metadata `images` (resolved via metadataBase). */
export function buildOgImagePath({
	title,
	eyebrow,
	image,
}: OgImageInput): string {
	const params = new URLSearchParams()
	params.set("title", title.trim().slice(0, 140))
	if (eyebrow?.trim()) params.set("eyebrow", eyebrow.trim().slice(0, 48))
	const safeImage = sanitizeOgImagePath(image)
	if (safeImage) params.set("image", safeImage)
	return `/api/og?${params.toString()}`
}

export function defaultOgEyebrow(type: "website" | "article"): string {
	return type === "article" ? "Expert Tip" : "Wade's Plumbing & Septic"
}
