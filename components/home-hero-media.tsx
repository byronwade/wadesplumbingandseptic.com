import { getImageProps } from "next/image"

/*
 * Art direction for the cinematic frame. The viewport is landscape on desktop
 * and portrait on a phone, so the two orientations get different photographs
 * rather than one image cropped badly at both ends.
 *
 * Desktop is the blue-hour rough-in: 1280px wide against a 1440px band, so it
 * upscales ~1.1x and stays sharp. The old pairing had this backwards, serving a
 * 768x1024 portrait to desktop (a 1.9x upscale) and a 640x400 landscape to
 * phones.
 *
 * One alt for both sources, since <picture> has a single <img>: it has to be
 * true of whichever photograph is served.
 */
const HERO_SIZES = "100vw"

export function HomeHeroMedia() {
	const common = {
		alt: "Recent Wade's Plumbing & Septic work on a Santa Cruz County property",
		sizes: HERO_SIZES,
	} as const

	const {
		props: { srcSet: desktop },
	} = getImageProps({
		...common,
		width: 1280,
		height: 961,
		quality: 62,
		src: "/images/team/byron-working.webp",
	})

	const {
		props: { srcSet: portrait, ...rest },
	} = getImageProps({
		...common,
		/* Match the compressed source; avoid asking the optimizer for 768px. */
		width: 640,
		height: 853,
		quality: 52,
		src: "/images/work/engineered-septic-hero-portrait.webp",
	})

	return (
		<picture>
			<source media="(min-width: 640px)" srcSet={desktop} sizes={HERO_SIZES} />
			<img
				{...rest}
				srcSet={portrait}
				alt={common.alt}
				className="absolute inset-0 size-full object-cover object-[50%_62%]"
				decoding="async"
				fetchPriority="high"
			/>
		</picture>
	)
}
