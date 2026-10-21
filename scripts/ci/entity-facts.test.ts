import assert from "node:assert/strict"
import fs from "node:fs"
import Module from "node:module"
import path from "node:path"
import test from "node:test"

import type { ContentDocument } from "../../lib/content"
import { contactInfo } from "../../lib/contact"
import { normalizeConversion } from "../../lib/content-conversion"
import { LLMS_FULL_PATH, llmsFullPageSlugs } from "../../lib/llms"
import { crawlerDisallow, welcomedCrawlers } from "../../lib/robots"
import {
	articleJsonLd,
	businessId,
	localBusinessJsonLd,
	websiteId,
	websiteJsonLd,
} from "../../lib/seo"
import { siteConfig } from "../../lib/site"
import { buildBusinessVCard } from "../../lib/vcard"
import { businessFactIssues } from "./business-facts"

// lib/content and the llms routes are Next server modules; stub runtime-only imports.
type Loader = (
	request: string,
	parent: NodeModule | null,
	isMain: boolean,
) => unknown
const moduleWithLoad = Module as typeof Module & { _load: Loader }
const load = moduleWithLoad._load
moduleWithLoad._load = function patchedLoad(request, parent, isMain) {
	if (request === "server-only") return {}
	if (request === "next/cache") return { cacheLife() {}, cacheTag() {} }
	return load(request, parent, isMain)
}

const phoneDigits = siteConfig.phone.replace(/\D/g, "")

function normalizePhone(value: string) {
	const digits = value.replace(/\D/g, "")
	return digits.length === 10 ? `1${digits}` : digits
}

function clock(value: string) {
	const [hour, minute] = value.split(":").map(Number)
	const period = hour >= 12 ? "PM" : "AM"
	return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${period}`
}

function sourceFiles(roots: string[], pattern: RegExp) {
	return roots.flatMap((root) =>
		fs
			.readdirSync(root, { recursive: true, withFileTypes: true })
			.filter((entry) => entry.isFile() && pattern.test(entry.name))
			.map((entry) => path.join(entry.parentPath, entry.name)),
	)
}

async function routeText(modulePath: string) {
	const { GET } = await import(modulePath)
	const response: Response = await GET()
	assert.equal(
		response.headers.get("Content-Type"),
		"text/plain; charset=utf-8",
	)
	return response.text()
}

test("phone number is one value in every machine-readable form", () => {
	assert.equal(phoneDigits.length, 10)
	assert.equal(siteConfig.phoneE164, `+1${phoneDigits}`)
	assert.equal(siteConfig.phoneHref, `tel:${siteConfig.phoneE164}`)
	assert.equal(contactInfo.phoneE164, siteConfig.phoneE164)
	assert.equal(contactInfo.phoneDisplay, siteConfig.phone)
	assert.equal(localBusinessJsonLd().telephone, siteConfig.phoneE164)
})

test("schema hours are derived from the same hours shown on the site", () => {
	const { days, opens, closes } = siteConfig.openingHours
	assert.deepEqual(localBusinessJsonLd().openingHoursSpecification, [
		{
			"@type": "OpeningHoursSpecification",
			dayOfWeek: [...days],
			opens,
			closes,
		},
	])
	assert.ok(
		siteConfig.hours.startsWith(
			`${days[0]} to ${days.at(-1)}, ${clock(opens)} to ${clock(closes)}.`,
		),
		`siteConfig.hours does not match openingHours: ${siteConfig.hours}`,
	)
	assert.equal(contactInfo.hours, siteConfig.hours)
})

test("every schema node points at one business and one website @id", () => {
	assert.equal(businessId, `${siteConfig.url}/#business`)
	assert.equal(localBusinessJsonLd()["@id"], businessId)
	assert.equal(localBusinessJsonLd().name, siteConfig.name)
	assert.equal(websiteJsonLd()["@id"], websiteId)
	assert.deepEqual(websiteJsonLd().publisher, { "@id": businessId })

	const document: ContentDocument = {
		slug: "sample-article",
		title: "Sample",
		description: "Sample description",
		content: "",
		conversion: normalizeConversion(null, {
			slug: "sample-article",
			title: "Sample",
			description: "Sample description",
		}),
	}
	const article = articleJsonLd(document)
	assert.equal(article.author["@id"], businessId)
	assert.equal(article.publisher["@id"], businessId)

	const handWritten = sourceFiles(["app", "components", "lib"], /\.tsx?$/)
		.filter((file) => path.normalize(file) !== path.normalize("lib/seo.ts"))
		.filter((file) =>
			/#(?:business|website)\b/.test(fs.readFileSync(file, "utf8")),
		)
	assert.deepEqual(
		handWritten,
		[],
		"Use businessId / websiteId from lib/seo instead of hand-written @id URLs",
	)
})

test("vCard repeats the same name, phone, address and hours", () => {
	const card = buildBusinessVCard()
		.replace(/\r\n /g, "")
		.replace(/\\([,;\\])/g, "$1")
	const lines = card.split("\r\n")
	assert.ok(lines.includes(`FN:${siteConfig.name}`))
	assert.ok(lines.includes(`ORG:${siteConfig.name}`))
	const phones = lines.filter((line) => line.startsWith("TEL;"))
	assert.ok(phones.length > 0)
	for (const line of phones)
		assert.ok(line.endsWith(`:${siteConfig.phoneE164}`), line)
	assert.ok(lines.includes(`LABEL;TYPE=WORK:${siteConfig.address.display}`))
	const note = lines.find((line) => line.startsWith("NOTE:"))
	assert.ok(note?.includes(`Hours: ${siteConfig.hours}.`), String(note))
})

const summaryLines = [
	`# ${siteConfig.name}`,
	`> ${siteConfig.description}`,
	`Website: ${siteConfig.url}`,
	`Phone: ${siteConfig.phone}`,
	`Address: ${siteConfig.address.display}`,
	`Hours: ${siteConfig.hours}`,
	`Pricing: ${siteConfig.pricing}`,
	`Service area: ${siteConfig.serviceArea}`,
	`Google Business Profile: ${siteConfig.googleBusinessUrl}`,
	`Google reviews: ${siteConfig.googleReviewUrl}`,
]

test("llms.txt opens with the business summary and links the full text", async () => {
	const body = await routeText("../../app/llms.txt/route")
	const lines = body.split("\n")
	assert.equal(lines[0], `# ${siteConfig.name}`)
	const summaryEnd = lines.indexOf("## Services")
	assert.ok(summaryEnd > 0)
	for (const line of summaryLines)
		assert.ok(
			lines.slice(0, summaryEnd).includes(line),
			`llms.txt summary: ${line}`,
		)
	assert.ok(body.includes(`${siteConfig.url}${LLMS_FULL_PATH}`))
})

test("llms-full.txt carries the summary, every service and the key pages", async () => {
	const body = await routeText("../../app/llms-full.txt/route")
	const lines = body.split("\n")
	assert.equal(lines[0], `# ${siteConfig.name}`)
	for (const line of summaryLines)
		assert.ok(
			lines.slice(0, 25).includes(line),
			`llms-full.txt summary: ${line}`,
		)

	const { getAllRoutes } = await import("../../lib/content")
	const { services } = await getAllRoutes()
	assert.ok(services.length > 0)
	for (const service of services)
		assert.ok(
			lines.includes(
				`Source: ${siteConfig.url}/service-offerings/${service.slug}`,
			),
			service.slug,
		)
	for (const slug of llmsFullPageSlugs)
		assert.ok(lines.includes(`Source: ${siteConfig.url}/${slug}`), slug)
	for (const slug of ["warranties", "promotions", "testimonials", "about-us"])
		assert.ok(!lines.includes(`Source: ${siteConfig.url}/${slug}`), slug)

	assert.ok(!body.includes("](/"), "Root-relative links must be absolute")
	assert.deepEqual(businessFactIssues(body), [])
})

test("llms.txt link text repeats only confirmed business facts", async () => {
	const body = await routeText("../../app/llms.txt/route")
	// Slugs such as ".../a-weekend-diy-project" are addresses, not claims.
	const prose = body.replace(/\]\([^)]*\)/g, "]").replace(/https?:\/\/\S+/g, "")
	assert.deepEqual(businessFactIssues(prose), [])
})

/** next.config redirect sources as anchored path patterns. */
async function redirectSources() {
	const { default: nextConfig } = await import("../../next.config")
	const rules = (await nextConfig.redirects?.()) ?? []
	return rules.map((rule) => {
		const pattern = rule.source
			.replace(/[.+?^${}()|[\]\\]/g, "\\$&")
			.replace(/\/:\w+\*/g, "(?:/.*)?")
			.replace(/:\w+/g, "[^/]+")
		return { source: rule.source, test: new RegExp(`^${pattern}$`) }
	})
}

test("llms.txt and llms-full.txt link only to live, indexable pages", async () => {
	const { buildSitemapEntries } = await import("../../lib/sitemap")
	const live = new Set(
		(await buildSitemapEntries()).map((entry) => entry.url.replace(/\/$/, "")),
	)
	for (const file of ["llms.txt", LLMS_FULL_PATH.slice(1)])
		live.add(`${siteConfig.url}/${file}`)
	const redirects = await redirectSources()

	for (const route of ["llms.txt", "llms-full.txt"]) {
		const body = await routeText(`../../app/${route}/route`)
		const links = new Set(
			[
				...body.matchAll(
					/https:\/\/www\.wadesplumbingandseptic\.com[^\s)>\]"']*/g,
				),
			]
				.map(([url]) => url.replace(/[#?].*$/, "").replace(/[.,;:]+$/, ""))
				.map((url) => url.replace(/\/$/, "")),
		)
		assert.ok(links.size > 0, route)
		const problems: string[] = []
		for (const url of links) {
			const pathname = url.slice(siteConfig.url.length) || "/"
			const redirect = redirects.find((rule) => rule.test.test(pathname))
			if (redirect) problems.push(`${pathname} redirects (${redirect.source})`)
			else if (!live.has(url) && url !== siteConfig.url)
				problems.push(`${pathname} is not in the sitemap`)
		}
		assert.deepEqual(problems, [], route)
	}
})

test("Markdown internal links point at final URLs, not redirects", async () => {
	// Pages, services and posts feed llms-full.txt and the rendered site, so a
	// stale link costs crawlers and readers an extra redirect hop.
	const redirects = await redirectSources()
	const problems: string[] = []
	for (const file of sourceFiles(["content"], /\.md$/)) {
		const text = fs.readFileSync(file, "utf8")
		for (const [, href] of text.matchAll(/\]\((\/[^)\s#?]*)/g)) {
			const pathname = href.length > 1 ? href.replace(/\/$/, "") : href
			const redirect = redirects.find((rule) => rule.test.test(pathname))
			if (redirect)
				problems.push(`${file}: ${href} redirects (${redirect.source})`)
		}
	}
	assert.deepEqual(problems, [])
})

test("robots.txt welcomes search and AI crawlers with the same private paths blocked", async () => {
	const { default: robots } = await import("../../app/robots")
	const config = robots()
	assert.equal(config.sitemap, `${siteConfig.url}/sitemap.xml`)
	const rules = Array.isArray(config.rules) ? config.rules : [config.rules]
	const star = rules.find((rule) => rule.userAgent === "*")
	assert.ok(star)
	assert.deepEqual(star.disallow, crawlerDisallow)

	for (const bot of [
		"GPTBot",
		"OAI-SearchBot",
		"ChatGPT-User",
		"ClaudeBot",
		"Claude-SearchBot",
		"PerplexityBot",
		"Google-Extended",
		"Applebot-Extended",
		"Bingbot",
	])
		assert.ok(welcomedCrawlers.includes(bot), bot)

	for (const bot of welcomedCrawlers) {
		const groups = rules.filter((rule) => [rule.userAgent].flat().includes(bot))
		assert.equal(groups.length, 1, bot)
		assert.equal(groups[0].allow, "/", bot)
		assert.deepEqual(groups[0].disallow, crawlerDisallow, bot)
	}
})

test("every tel: link and call/text phone mention uses the business number", () => {
	const expected = `1${phoneDigits}`
	const problems: string[] = []
	const files = [
		...sourceFiles(["content"], /\.md$/),
		...sourceFiles(["app", "components", "lib"], /\.tsx?$/),
	]
	for (const file of files) {
		const source = fs.readFileSync(file, "utf8")
		for (const [, number] of source.matchAll(/tel:([+\d().-]{7,})/g))
			if (normalizePhone(number) !== expected)
				problems.push(`${file}: tel:${number}`)
		for (const [, number] of source.matchAll(
			/\b(?:call|text)(?:\s+(?:us|now|today|at))*[\s:]+\[?(\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4})/gi,
		))
			if (normalizePhone(number) !== expected)
				problems.push(`${file}: ${number}`)
	}
	assert.deepEqual(problems, [])
})
