import assert from "node:assert/strict"
import test from "node:test"

import {
	blockingScriptSrcs,
	canonicalHref,
	classifyHref,
	extractIds,
	extractImages,
	extractLinks,
	hasInterFontPreload,
	headingCount,
	metaDescription,
	pageTitle,
	resolveInternalHref,
	visiblePageText,
} from "./html-crawl"

const sample = `
<html>
  <head>
    <title>Drain Cleaning | Wade's Plumbing &amp; Septic</title>
    <meta name="description" content="Drain cleaning in Santa Cruz County.">
    <link rel="canonical" href="https://www.wadesplumbingandseptic.com/service-offerings/drain-cleaning">
    <script type="application/ld+json">{"@type":"Service"}</script>
  </head>
  <body>
    <h1>Drain Cleaning</h1>
    <a href="/contact#quote">Get a Free Quote</a>
    <a href="tel:+18312254344">Call 831.225.4344</a>
    <a href="https://example.com">External</a>
    <img src="/images/work/example.webp" alt="A plumber at a job site" width="1600" height="900">
    <section id="quote">Form</section>
  </body>
</html>
`

test("HTML inventory reads title, description, canonical, links, images, and ids", () => {
	assert.equal(
		pageTitle(sample),
		"Drain Cleaning | Wade's Plumbing &amp; Septic",
	)
	assert.equal(metaDescription(sample), "Drain cleaning in Santa Cruz County.")
	assert.equal(
		canonicalHref(sample),
		"https://www.wadesplumbingandseptic.com/service-offerings/drain-cleaning",
	)
	const links = extractLinks(sample)
	assert.deepEqual(
		links.map((link) => link.href),
		["/contact#quote", "tel:+18312254344", "https://example.com"],
	)
	const images = extractImages(sample)
	assert.equal(images.length, 1)
	assert.equal(images[0]?.alt, "A plumber at a job site")
	assert.equal(images[0]?.width, "1600")
	assert.equal(images[0]?.fill, false)
	assert.ok(extractIds(sample).has("quote"))
	assert.equal(headingCount(sample), 1)
})

test("empty hrefs stay in the inventory so stripped Call Now links fail", () => {
	const links = extractLinks(
		'<a href="">Call Now 831.225.4344</a><a>no href attribute</a>',
	)
	assert.deepEqual(
		links.map((link) => ({ href: link.href, text: link.text })),
		[{ href: "", text: "Call Now 831.225.4344" }],
	)
	assert.equal(classifyHref("").kind, "empty")
	assert.equal(classifyHref("   ").kind, "empty")
	assert.equal(
		resolveInternalHref("", "/contact", "http://127.0.0.1:3000"),
		null,
	)
})

test("font preload helper accepts either attribute order", () => {
	assert.equal(
		hasInterFontPreload(
			'<link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" />',
		),
		true,
	)
	assert.equal(
		hasInterFontPreload(
			'<link as="font" rel="preload" href="/fonts/inter-latin.woff2?dpl=x" />',
		),
		true,
	)
	assert.equal(
		hasInterFontPreload(
			'<link rel="preload" as="image" href="/fonts/inter-latin.woff2" />',
		),
		false,
	)
})

test("blocking script helper ignores async, defer, module, and nomodule", () => {
	const html = `
		<script src="/a.js" async></script>
		<script defer src="/b.js"></script>
		<script type="module" src="/c.js"></script>
		<script nomodule src="/d.js"></script>
		<script src="/e.js"></script>
	`
	assert.deepEqual(blockingScriptSrcs(html), ["/e.js"])
})

test("visible page text ignores JSON-LD and decodes quotes in FAQ copy", () => {
	const html = `
		<script type="application/ld+json">{"@type":"FAQPage","mainEntity":[{"name":"Hidden?"}]}</script>
		<h2>What does Wade&apos;s Plumbing &amp; Septic do?</h2>
		<p>Quotes are free.</p>
	`
	const visible = visiblePageText(html)
	assert.equal(visible.includes("Hidden?"), false)
	assert.ok(visible.includes("What does Wade's Plumbing & Septic do?"))
})

test("JSON-LD script tags are not treated as visible links", () => {
	const html = `<script><a href="/missing">nope</a></script><a href="/contact">ok</a>`
	assert.deepEqual(
		extractLinks(html).map((link) => link.href),
		["/contact"],
	)
})

test("internal hrefs resolve hashes against the current page", () => {
	assert.equal(classifyHref("tel:+18312254344").kind, "tel")
	assert.equal(classifyHref("mailto:support@wadesinc.io").kind, "skip")
	assert.equal(classifyHref("#quote").kind, "fragment")
	assert.deepEqual(
		resolveInternalHref(
			"/contact#quote",
			"/expert-tips",
			"http://127.0.0.1:3000",
		),
		{ pathname: "/contact", hash: "quote", search: "" },
	)
	assert.deepEqual(
		resolveInternalHref("#quote", "/contact", "http://127.0.0.1:3000"),
		{ pathname: "/contact", hash: "quote" },
	)
	assert.equal(
		resolveInternalHref("https://example.com/x", "/", "http://127.0.0.1:3000")
			?.external,
		true,
	)
})
