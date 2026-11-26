import { getImageProps } from "next/image"

const MOBILE_HERO = "/images/work/engineered-septic-hero-portrait.webp"
const MOBILE_HERO_AVIF = "/images/work/engineered-septic-hero-portrait.avif"
const DESKTOP_HERO = "/images/team/byron-working.webp"
const DESKTOP_HERO_AVIF = "/images/team/byron-working.avif"

/*
 * Art direction for the cinematic frame. The viewport is landscape on desktop
 * and portrait on a phone, so the two orientations get different photographs
 * rather than one image cropped badly at both ends.
 *
 * Desktop is the blue-hour rough-in: 1200px wide against a 1440px band, so it
 * upscales ~1.2x and stays sharp. The old pairing had this backwards, serving a
 * 768x1024 portrait to desktop (a 1.9x upscale) and a 640x400 landscape to
 * phones.
 *
 * One alt for both sources, since <picture> has a single <img>: it has to be
 * true of whichever photograph is served.
 *
 * With `images.unoptimized` there is no srcSet, so each source falls back to
 * its plain file; without that the desktop <source> was empty and desktop got
 * the portrait. The <img> is the homepage LCP, so it loads eagerly; <picture>
 * still fetches only the one matching source. AVIF is listed first so supporting
 * browsers skip the heavier WebP.
 */
const HERO_SIZES = "100vw"

export function HomeHeroMedia() {
	const common = {
		alt: "Recent Wade's Plumbing & Septic work on a Santa Cruz County property",
		sizes: HERO_SIZES,
	} as const

	const {
		props: { srcSet: desktopSrcSet, src: desktopSrc },
	} = getImageProps({
		...common,
		width: 1200,
		height: 900,
		quality: 52,
		src: DESKTOP_HERO,
	})

	const {
		props: { srcSet: portrait, src: portraitSrc, ...rest },
	} = getImageProps({
		...common,
		/* Match the compressed source; avoid asking the optimizer for 768px. */
		width: 640,
		height: 853,
		quality: 52,
		src: MOBILE_HERO,
	})

	return (
		<>
			{/*
			  Discover the LCP file from <head> instead of after the 44KB HTML
			  parse. Media keeps desktop from downloading the portrait. href
			  must match the <source> the browser will pick, including type.
			*/}
			<link
				rel="preload"
				as="image"
				type="image/avif"
				fetchPriority="high"
				href={MOBILE_HERO_AVIF}
				media="(max-width: 639px)"
			/>
			<link
				rel="preload"
				as="image"
				type="image/avif"
				fetchPriority="high"
				href={DESKTOP_HERO_AVIF}
				media="(min-width: 640px)"
			/>
			<picture>
				<source
					media="(min-width: 640px)"
					srcSet={DESKTOP_HERO_AVIF}
					type="image/avif"
				/>
				<source
					media="(min-width: 640px)"
					srcSet={desktopSrcSet ?? desktopSrc}
					sizes={HERO_SIZES}
					type="image/webp"
				/>
				<source srcSet={MOBILE_HERO_AVIF} type="image/avif" />
				<img
					{...rest}
					src={portraitSrc}
					srcSet={portrait}
					alt={common.alt}
					className="absolute inset-0 size-full object-cover object-[50%_62%]"
					/*
					  Sync decode: async decoding left the LCP image loaded but unpainted
					  for ~2s under mobile Lighthouse (element render delay).
					*/
					decoding="sync"
					fetchPriority="high"
					loading="eager"
				/>
			</picture>
		</>
	)
}
