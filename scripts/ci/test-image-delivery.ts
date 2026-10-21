import assert from "node:assert/strict"
import { createElement } from "react"
import { imageConfigDefault } from "next/dist/shared/lib/image-config"
import { renderToStaticMarkup } from "react-dom/server"

import { HomeHeroMedia } from "../../components/home-hero-media"
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
const source = hero.match(/<source\b[^>]*>/)?.[0] ?? ""
const img = hero.match(/<img\b[^>]*>/)?.[0] ?? ""

assert.match(
	source,
	/srcSet="[^"]*byron-working\.webp[^"]*"/,
	`Desktop hero <source> needs the landscape photo: ${source}`,
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

console.log(
	"Image delivery policy passes: local images bypass /_next/image; homepage hero loads eagerly with sync decode and both sources.",
)
