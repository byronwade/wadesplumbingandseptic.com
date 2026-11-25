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

export function lcpPreload(src: string): { href: string; type?: string } {
	const narrow = narrowFor(src)
	const narrowAvif = narrow ? avifFor(narrow) : undefined
	if (narrowAvif) return { href: narrowAvif, type: "image/avif" }
	const fullAvif = avifFor(src)
	if (fullAvif) return { href: fullAvif, type: "image/avif" }
	if (narrow) return { href: narrow, type: "image/webp" }
	return { href: src }
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
