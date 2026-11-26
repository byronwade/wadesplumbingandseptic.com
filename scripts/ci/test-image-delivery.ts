import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { createElement } from "react"
import { imageConfigDefault } from "next/dist/shared/lib/image-config"
import { renderToStaticMarkup } from "react-dom/server"

import { HomeHeroMedia } from "../../components/home-hero-media"
import {
	avifFor,
	lcpPreload,
	lcpPreloads,
	narrowFor,
} from "../../lib/responsive-image"
import nextConfig from "../../next.config"

const images = nextConfig.images

assert.ok(
	images && typeof images === "object",
	"Next image configuration is required",
)
assert.equal(
	images.unoptimized,
	true,
	"Vercel Services must serve local images directly until its Next image optimizer route is available",
)

/*
 * The homepage hero is the first-screen LCP image. It must load eagerly, and
 * the desktop <source> must name a file: with unoptimized delivery there is no
 * srcSet, and an empty <source> silently sent desktop the phone portrait.
 *
 * Next's build inlines the merged image config as __NEXT_IMAGE_OPTS; provide
 * the same object here so getImageProps renders as it does in production.
 */
process.env = {
	...process.env,
	__NEXT_IMAGE_OPTS: { ...imageConfigDefault, ...images },
} as unknown as NodeJS.ProcessEnv
const hero = renderToStaticMarkup(createElement(HomeHeroMedia))
const img = hero.match(/<img\b[^>]*>/)?.[0] ?? ""

assert.match(
	hero,
	/srcSet="[^"]*byron-working\.webp[^"]*"/,
	`Desktop hero needs the landscape WebP: ${hero}`,
)
assert.match(
	hero,
	/srcSet="[^"]*byron-working\.avif[^"]*"/,
	`Desktop hero needs the landscape AVIF: ${hero}`,
)
assert.match(
	img,
	/src="[^"]*engineered-septic-hero-portrait\.webp[^"]*"/,
	`Mobile hero <img> needs the portrait photo: ${img}`,
)
assert.match(img, /loading="eager"/, `Hero <img> must not lazy-load: ${img}`)
assert.match(
	img,
	/fetchPriority="high"/i,
	`Hero <img> must keep high priority: ${img}`,
)
assert.match(
	img,
	/decoding="sync"/,
	`Hero <img> must decode synchronously so LCP is not held on async decode: ${img}`,
)
assert.match(
	hero,
	/rel="preload"[^>]*href="[^"]*engineered-septic-hero-portrait\.avif/,
	`Homepage hero must preload the mobile LCP AVIF: ${hero}`,
)
assert.match(
	hero,
	/srcSet="[^"]*engineered-septic-hero-portrait\.avif/,
	`Homepage hero must offer a mobile AVIF source: ${hero}`,
)

const publicRoot = join(__dirname, "../../public")
function publicFile(src: string) {
	return join(publicRoot, src.replace(/^\//, ""))
}

assert.ok(
	existsSync(publicFile("/images/work/engineered-septic-hero-portrait.avif")),
	"missing homepage mobile LCP AVIF",
)
assert.ok(
	existsSync(publicFile("/images/team/byron-working.avif")),
	"missing homepage desktop LCP AVIF",
)

const septicHero = "/images/work/engineered-septic-hero.webp"
assert.equal(
	narrowFor(septicHero),
	"/images/work/engineered-septic-hero-mobile.webp",
	"Septic install LCP must use the landscape mobile file, not the 142KB portrait",
)
assert.equal(
	lcpPreload(septicHero).href,
	"/images/work/engineered-septic-hero-mobile.avif",
)
assert.equal(lcpPreload(septicHero).media, "(max-width: 827px)")
assert.ok(existsSync(publicFile(lcpPreload(septicHero).href)))
const septicPreloads = lcpPreloads(septicHero)
assert.equal(septicPreloads.length, 2)
assert.equal(septicPreloads[1]?.media, "(min-width: 828px)")
assert.ok(septicPreloads[1] && existsSync(publicFile(septicPreloads[1].href)))

const aptosHero = "/images/locations/river-and-redwoods.webp"
const aptosNarrow = narrowFor(aptosHero)
assert.ok(aptosNarrow, "Aptos town hero needs a phone-width file")
assert.ok(existsSync(publicFile(aptosNarrow)))
const aptosNarrowAvif = avifFor(aptosNarrow)
assert.ok(aptosNarrowAvif, "Aptos town hero needs a phone-width AVIF")
assert.ok(existsSync(publicFile(aptosNarrowAvif)))

for (const src of [
	septicHero,
	aptosHero,
	"/images/services/drain-clearing.webp",
]) {
	const preload = lcpPreload(src)
	assert.ok(
		existsSync(publicFile(preload.href)),
		`missing LCP preload file ${preload.href} for ${src}`,
	)
}

console.log(
	"Image delivery policy passes: local images bypass /_next/image; homepage hero loads eagerly with sync decode, both sources, and a mobile preload.",
)
