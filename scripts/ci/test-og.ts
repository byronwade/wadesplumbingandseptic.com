import assert from "node:assert/strict"

import {
	buildOgImagePath,
	defaultOgEyebrow,
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
assert.ok(path.includes("image=%2Fimages%2Fwork%2Fprecision-valve-installation.webp"))

assert.equal(defaultOgEyebrow("article"), "Expert Tip")
assert.equal(defaultOgEyebrow("website"), "Wade's Plumbing & Septic")

console.log("og helpers ok")
