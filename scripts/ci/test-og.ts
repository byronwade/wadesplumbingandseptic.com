import assert from "node:assert/strict"

import sharp from "sharp"

import {
	buildOgImagePath,
	defaultOgEyebrow,
	OG_HEIGHT,
	OG_WIDTH,
	sanitizeOgImagePath,
} from "../../lib/og"

assert.equal(
	sanitizeOgImagePath("/images/work/foo.webp"),
	"/images/work/foo.webp",
)
assert.equal(sanitizeOgImagePath("/api/secret"), null)
assert.equal(sanitizeOgImagePath("../etc/passwd"), null)
assert.equal(
	sanitizeOgImagePath(
		"https://www.wadesplumbingandseptic.com/images/team/byron-working.webp",
	),
	"/images/team/byron-working.webp",
)
assert.equal(
	sanitizeOgImagePath("https://evil.example/images/team/byron-working.webp"),
	null,
)

const path = buildOgImagePath({
	title: "Drain Cleaning",
	eyebrow: "Plumbing",
	image: "/images/work/precision-valve-installation.webp",
})
assert.ok(path.startsWith("/api/og?"))
assert.ok(path.includes("title=Drain"))
assert.ok(path.includes("eyebrow=Plumbing"))
assert.ok(
	path.includes("image=%2Fimages%2Fwork%2Fprecision-valve-installation.webp"),
)

assert.equal(defaultOgEyebrow("article"), "Expert Tip")
assert.equal(defaultOgEyebrow("website"), "Wade's Plumbing & Septic")

async function main() {
	const { loadPublicPhotoBuffer } = await import("../../lib/og-image")

	// loadPublicPhotoBuffer swallows sharp errors and returns null, so a broken
	// sharp install would silently drop the photo from every share card.
	const photo = await loadPublicPhotoBuffer(
		"/images/work/precision-valve-installation.webp",
	)
	assert.ok(photo, "sharp failed to decode a public WebP for the OG card")
	const meta = await sharp(Buffer.from(photo)).metadata()
	assert.equal(meta.format, "png")
	assert.equal(meta.width, OG_WIDTH)
	assert.equal(meta.height, OG_HEIGHT)

	assert.equal(await loadPublicPhotoBuffer("/api/secret"), null)

	console.log("og helpers ok")
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
