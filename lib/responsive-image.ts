import { imageAvif, imageNarrow } from "@/lib/image-variants.generated"

/**
 * Extra phone-sized files that the generator skipped because the source is
 * already under 828px wide, yet the bytes are still too large for a 370px
 * hero or card. Keep these next to the generated maps so a rerun does not
 * drop the LCP mappings.
 */
const extraNarrow = {
	"/images/work/engineered-septic-hero.webp":
		"/images/work/engineered-septic-hero-mobile.webp",
	"/images/work/precision-valve-installation.webp":
		"/images/work/precision-valve-installation-640.webp",
	"/images/work/drain-cleaning-equipment.webp":
		"/images/work/drain-cleaning-equipment-640.webp",
	"/images/work/advanced-septic-control-panel.webp":
		"/images/work/advanced-septic-control-panel-640.webp",
	"/images/work/engineered-retaining-wall.webp":
		"/images/work/engineered-retaining-wall-640.webp",
	/*
	  Generator emits 828px for this file, but the service hero box is ~372px
	  on phones. A 640px sibling cuts the unused-image waste without dropping
	  the generated 828 mapping from a rerun.
	*/
	"/images/services/drain-clearing.webp":
		"/images/services/drain-clearing-640.webp",
} as const

const extraAvif = {
	"/images/work/engineered-septic-hero-mobile.webp":
		"/images/work/engineered-septic-hero-mobile.avif",
	"/images/work/precision-valve-installation-640.webp":
		"/images/work/precision-valve-installation-640.avif",
	"/images/work/drain-cleaning-equipment-640.webp":
		"/images/work/drain-cleaning-equipment-640.avif",
	"/images/work/advanced-septic-control-panel-640.webp":
		"/images/work/advanced-septic-control-panel-640.avif",
	"/images/work/engineered-retaining-wall-640.webp":
		"/images/work/engineered-retaining-wall-640.avif",
	"/images/services/drain-clearing-640.webp":
		"/images/services/drain-clearing-640.avif",
	"/images/wordpress/close-up-of-a-storm-drain-covered-with-leaves-and-debris-during-rainfall-5ed9d8.webp":
		"/images/wordpress/close-up-of-a-storm-drain-covered-with-leaves-and-debris-during-rainfall-5ed9d8.avif",
} as const

const avifMap: Record<string, string> = {
	...imageAvif,
	...extraAvif,
}

const narrowMap: Record<string, string> = {
	...imageNarrow,
	...extraNarrow,
}

export function avifFor(src: string): string | undefined {
	return avifMap[src]
}

export function narrowFor(src: string): string | undefined {
	return narrowMap[src]
}

/** Smallest file that still covers a phone-width hero or card. */
export function cardImageSrc(src: string): string {
	return narrowFor(src) ?? src
}

export type LcpPreload = {
	href: string
	type?: string
	media?: string
}

/** Phone LCP file (first), then the matching wide-screen file when one exists. */
export function lcpPreloads(src: string): LcpPreload[] {
	const narrow = narrowFor(src)
	const narrowAvif = narrow ? avifFor(narrow) : undefined
	const fullAvif = avifFor(src)
	const phone: LcpPreload | undefined = narrowAvif
		? { href: narrowAvif, type: "image/avif" }
		: narrow
			? { href: narrow, type: "image/webp" }
			: fullAvif
				? { href: fullAvif, type: "image/avif" }
				: { href: src }

	if (!narrow) return [phone]

	const desktop: LcpPreload = fullAvif
		? { href: fullAvif, type: "image/avif" }
		: { href: src }

	return [
		{ ...phone, media: "(max-width: 827px)" },
		{ ...desktop, media: "(min-width: 828px)" },
	]
}

export function lcpPreload(src: string): LcpPreload {
	return lcpPreloads(src)[0]
}

export type PictureSource = {
	srcSet: string
	type?: string
	media?: string
}

export function pictureSources(src: string): PictureSource[] {
	const sources: PictureSource[] = []
	const narrow = narrowFor(src)
	const narrowAvif = narrow ? avifFor(narrow) : undefined
	const fullAvif = avifFor(src)

	if (narrowAvif) {
		sources.push({
			srcSet: narrowAvif,
			type: "image/avif",
			media: "(max-width: 827px)",
		})
	}
	if (narrow) {
		sources.push({
			srcSet: narrow,
			type: "image/webp",
			media: "(max-width: 827px)",
		})
	}
	if (fullAvif) {
		sources.push({ srcSet: fullAvif, type: "image/avif" })
	}
	return sources
}
