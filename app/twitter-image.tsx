import { renderOgImage } from "@/lib/og-image"

export const alt = "Wade's Plumbing & Septic. Call 831.225.4344 for service."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function TwitterImage() {
	return renderOgImage({
		title: "Licensed plumbing & septic for Santa Cruz County",
		eyebrow: "Family owned · Local crew",
		image: "/images/locations/santa-cruz-redwoods.webp",
	})
}
