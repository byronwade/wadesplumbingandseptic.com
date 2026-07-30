import assert from "node:assert/strict"

import {
	OG_DESCRIPTION_MAX,
	META_DESCRIPTION_MAX,
	buildPageMetadata,
	clampDescription,
} from "../../lib/seo"

const long =
	"Licensed plumbing and engineered septic service in Santa Cruz County and selected Santa Clara County communities. Clear pricing, no upselling. Call 831.225.4344."

assert.equal(long.length, 161)

const og = clampDescription(long, OG_DESCRIPTION_MAX)
const meta = clampDescription(long, META_DESCRIPTION_MAX)
assert.ok(og.length <= OG_DESCRIPTION_MAX, `og too long: ${og.length}`)
assert.ok(meta.length <= META_DESCRIPTION_MAX, `meta too long: ${meta.length}`)
assert.ok(og.endsWith("…"))
assert.ok(!og.includes("  "))

const short = "Clear pricing, no upselling."
assert.equal(clampDescription(short, OG_DESCRIPTION_MAX), short)

const metadata = buildPageMetadata({
	title: "Santa Cruz Plumbing & Septic",
	description: long,
	pathname: "/",
})

assert.equal(typeof metadata.description, "string")
assert.ok(
	String(metadata.description).length <= META_DESCRIPTION_MAX,
	"meta description must stay within Google-safe length",
)
assert.ok(
	String(metadata.openGraph?.description).length <= OG_DESCRIPTION_MAX,
	"og:description must stay within social-safe length",
)
assert.ok(
	String(metadata.twitter?.description).length <= OG_DESCRIPTION_MAX,
	"twitter:description must stay within social-safe length",
)
const ogImages = metadata.openGraph?.images
const firstImage = Array.isArray(ogImages) ? ogImages[0] : ogImages
const imageAlt =
	firstImage && typeof firstImage === "object" && "alt" in firstImage
		? String(firstImage.alt ?? "")
		: ""
assert.ok(
	imageAlt.toLowerCase().includes("call"),
	"og:image alt should include conversion language",
)

const home = buildPageMetadata({
	title: "Santa Cruz Plumbing & Septic",
	description:
		"Licensed plumbing and septic for Santa Cruz County. Clear pricing, no upselling. Call 831.225.4344.",
	pathname: "/",
})
assert.ok(
	String(home.description).length <= OG_DESCRIPTION_MAX,
	"homepage source copy should already fit social length",
)

console.log("seo meta helpers ok")
