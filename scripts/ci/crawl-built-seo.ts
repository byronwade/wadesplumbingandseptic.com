import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

import matter from "gray-matter"

import { contactInfo } from "../../lib/contact"
import {
	RECENT_GUIDE_COUNT,
	selectIndexableGuides,
	selectRecentGuides,
} from "../../lib/llms"
import { weekdayHoursPhrase } from "../../lib/public-facts"
import { quoteEmailConfigured } from "../../lib/quote-request"
import { serviceAreaLocations } from "../../lib/service-areas"
import { jsonLdBusinessFactIssues } from "./business-facts"
import {
	INTER_FONT_PATH,
	blockingScriptSrcs,
	canonicalHref,
	classifyHref,
	decodeFragment,
	extractIds,
	extractImages,
	extractLinks,
	hasInterFontPreload,
	headingCount,
	metaDescription,
	pageTitle,
	resolveInternalHref,
	visibleLead,
	visiblePageText,
	type HtmlImage,
} from "./html-crawl"
import {
	collectJsonLdNodes,
	advertisedQuoteFormCopy,
	jsonLdParseIssues,
	parseJsonLdScripts,
	type JsonLdNode,
} from "./json-ld-validate"

const origin = (process.env.BASE_URL ?? "http://127.0.0.1:3000").replace(
	/\/$/,
	"",
)

const requiredBots = [
	"GPTBot",
	"OAI-SearchBot",
	"ChatGPT-User",
	"PerplexityBot",
	"ClaudeBot",
	"Google-Extended",
	"Applebot-Extended",
	"Bingbot",
	"CCBot",
]

const expectedName = "Wade's Plumbing & Septic"
const expectedPhone = "+18312254344"
const expectedTel = `tel:${expectedPhone}`
const expectedUrl = "https://www.wadesplumbingandseptic.com"
const expectedStreet = "7737 Highway 9"
const expectedHours = "Mo-Fr 09:00-17:00"

type PageRecord = {
	pathname: string
	status: number
	body: string
	location: string | null
	ids: Set<string>
	canonical: string | undefined
	noindex: boolean
	isHtml: boolean
}

function schemaTypes(value: unknown) {
	if (typeof value === "string") return [value]
	if (Array.isArray(value))
		return value.filter((entry): entry is string => typeof entry === "string")
	return []
}

function nodeHasType(node: JsonLdNode, type: string) {
	return schemaTypes(node["@type"]).includes(type)
}

async function fetchOnce(path: string, redirect: RequestRedirect = "manual") {
	const url = path.startsWith("http")
		? path
		: `${origin}${path.startsWith("/") ? path : `/${path}`}`
	const response = await fetch(url, { redirect })
	return {
		url,
		response,
		body: await response.text(),
		location: response.headers.get("location"),
	}
}

/** Parse loc/lastmod from each <url> block so dates cannot leak across entries. */
export function parseSitemapUrls(xml: string) {
	return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].flatMap((match) => {
		const block = match[1] ?? ""
		const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]
		if (!loc) return []
		return [
			{
				loc,
				lastmod: block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
			},
		]
	})
}

function normalizeFrontmatterDate(value: unknown) {
	if (!value) return undefined
	if (value instanceof Date) return value.toISOString().slice(0, 10)
	return String(value).slice(0, 10)
}

function guidesFromDisk() {
	const dir = path.join(process.cwd(), "content", "posts")
	const posts = fs
		.readdirSync(dir)
		.filter((name) => name.endsWith(".md"))
		.map((name) => {
			const { data } = matter(fs.readFileSync(path.join(dir, name), "utf8"))
			return {
				slug: name.replace(/\.md$/, ""),
				date: normalizeFrontmatterDate(data.date),
				updated: normalizeFrontmatterDate(data.updated),
				noindex: Boolean(data.noindex),
			}
		})
	const recent = selectRecentGuides(posts)
	assert.equal(
		recent.length,
		RECENT_GUIDE_COUNT,
		"content/posts must have enough indexable guides for llms.txt",
	)
	return { recent, all: selectIndexableGuides(posts) }
}

function assertSitemapParser() {
	const parsed = parseSitemapUrls(`
		<urlset>
			<url><loc>https://example.com/a</loc></url>
			<url><loc>https://example.com/b</loc><lastmod>2026-11-25</lastmod></url>
		</urlset>
	`)
	assert.equal(parsed.length, 2)
	assert.equal(parsed[0]?.loc, "https://example.com/a")
	assert.equal(parsed[0]?.lastmod, undefined)
	assert.equal(parsed[1]?.lastmod, "2026-11-25")
}

function isHtmlPath(pathname: string) {
	return !/\.(?:txt|xml|json|csv|vcf|webmanifest|svg|png|jpe?g|webp|gif|woff2?|css|js|map|ico)$/i.test(
		pathname,
	)
}

function isServiceOrTown(pathname: string) {
	return (
		pathname.startsWith("/service-offerings/") ||
		pathname.startsWith("/service-area/")
	)
}

function isServicePage(pathname: string) {
	return /^\/service-offerings\/[^/]+$/.test(pathname)
}

function isTownHub(pathname: string) {
	return /^\/service-area\/[a-z0-9-]+-ca-plumbing-septic-services$/.test(
		pathname,
	)
}

function isCityServicePage(pathname: string) {
	return /^\/service-area\/[^/]+\/[^/]+$/.test(pathname)
}

function decodeHtmlText(text: string) {
	return text
		.replace(/&amp;/g, "&")
		.replace(/&#x27;|&apos;|&#39;/g, "'")
		.replace(/&quot;/g, '"')
}

function titleNamesServiceOrTown(pathname: string, title: string) {
	const lower = decodeHtmlText(title).toLowerCase()
	if (isServicePage(pathname)) {
		const slug = pathname.split("/")[2] ?? ""
		const tokens = slug.split("-").filter((part) => part.length >= 4)
		return tokens.some((token) => lower.includes(token))
	}
	if (isTownHub(pathname)) {
		const location = serviceAreaLocations.find((item) => item.href === pathname)
		return location ? lower.includes(location.name.toLowerCase()) : true
	}
	if (isCityServicePage(pathname)) {
		const [, , city, service] = pathname.split("/")
		const location = serviceAreaLocations.find((item) => item.slug === city)
		const tokens = (service ?? "").split("-").filter((part) => part.length >= 4)
		return (
			Boolean(location && lower.includes(location.name.toLowerCase())) &&
			tokens.some((token) => lower.includes(token))
		)
	}
	return true
}

function isSkippablePath(pathname: string) {
	return (
		pathname.startsWith("/_next/") ||
		pathname.startsWith("/api/") ||
		pathname === "/opengraph-image" ||
		pathname === "/twitter-image"
	)
}

function robotsNoindex(html: string) {
	const content =
		html.match(
			/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i,
		)?.[1] ??
		html.match(
			/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']robots["']/i,
		)?.[1] ??
		""
	return /\bnoindex\b/i.test(content)
}

async function mapPool<T, R>(
	items: T[],
	limit: number,
	worker: (item: T) => Promise<R>,
) {
	const results: R[] = []
	let index = 0
	async function run() {
		while (index < items.length) {
			const current = index++
			results[current] = await worker(items[current]!)
		}
	}
	await Promise.all(
		Array.from({ length: Math.min(limit, items.length) }, () => run()),
	)
	return results
}

function imageNeedsDimensions(image: HtmlImage) {
	if (/\.svg(?:$|\?)/i.test(image.src)) return false
	if (image.src.startsWith("data:")) return false
	if (image.fill) return false
	return !image.width || !image.height
}

async function checkQuoteEndpoint(issues: string[]) {
	const crawlIp = `203.0.113.${1 + Math.floor(Math.random() * 250)}`
	const headers = {
		Origin: origin,
		Accept: "application/json",
		"Content-Type": "application/json",
		"x-real-ip": crawlIp,
		"x-vercel-forwarded-for": crawlIp,
	}

	const forbidden = await fetch(`${origin}/api/quote`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name: "Test Homeowner",
			phone: "8312254344",
			message: "Need a drain looked at in Felton.",
		}),
	})
	if (forbidden.status !== 403)
		issues.push(
			`/api/quote: expected 403 without Origin, got ${forbidden.status}`,
		)

	const invalid = await fetch(`${origin}/api/quote`, {
		method: "POST",
		headers,
		body: JSON.stringify({ name: "A" }),
	})
	const invalidBody = (await invalid.json().catch(() => null)) as {
		ok?: boolean
		errors?: Record<string, string>
	} | null
	if (invalid.status !== 400)
		issues.push(
			`/api/quote: invalid payload expected 400, got ${invalid.status}`,
		)
	else if (!invalidBody?.errors)
		issues.push("/api/quote: invalid payload did not return field errors")

	const valid = await fetch(`${origin}/api/quote`, {
		method: "POST",
		headers,
		body: JSON.stringify({
			name: "Test Homeowner",
			phone: "8312254344",
			message: "Need a drain looked at in Felton this week.",
		}),
	})
	const validBody = (await valid.json().catch(() => null)) as {
		ok?: boolean
		error?: string
	} | null
	if (valid.status === 200 && validBody?.ok === true) return
	if (valid.status === 503 && typeof validBody?.error === "string") {
		if (!/call|email/i.test(validBody.error))
			issues.push(
				"/api/quote: failure copy does not tell the visitor how to reach Wade's",
			)
		return
	}
	issues.push(
		`/api/quote: unexpected ${valid.status} ${JSON.stringify(validBody)}`,
	)
}

async function main() {
	const issues: string[] = []

	const robots = await fetchOnce("/robots.txt", "follow")
	assert.equal(robots.response.status, 200, "robots.txt must be 200")
	for (const bot of requiredBots) {
		assert.ok(
			robots.body.includes(`User-Agent: ${bot}`) ||
				robots.body.includes(`User-agent: ${bot}`),
			`robots.txt must name ${bot}`,
		)
	}
	assert.ok(robots.body.includes("Sitemap:"), "robots.txt must list sitemap")
	assert.doesNotMatch(
		robots.body,
		/User-agent: \*\nDisallow: \/$/m,
		"robots.txt must not blanket-block the site",
	)

	assertSitemapParser()

	const sitemap = await fetchOnce("/sitemap.xml", "follow")
	assert.equal(sitemap.response.status, 200, "sitemap.xml must be 200")
	const entries = parseSitemapUrls(sitemap.body)
	assert.ok(entries.length > 50, `sitemap too small: ${entries.length}`)

	const missingLastmod = entries.filter((entry) => !entry.lastmod)
	assert.deepEqual(
		missingLastmod.map((entry) => entry.loc),
		[],
		"sitemap URLs need lastmod",
	)
	const invalidLastmod = entries.filter(
		(entry) => entry.lastmod && Number.isNaN(Date.parse(entry.lastmod)),
	)
	assert.deepEqual(
		invalidLastmod.map((entry) => `${entry.loc} lastmod=${entry.lastmod}`),
		[],
		"sitemap lastmod values must be real dates",
	)

	const llms = await fetchOnce("/llms.txt", "follow")
	const llmsFull = await fetchOnce("/llms-full.txt", "follow")
	assert.equal(llms.response.status, 200)
	assert.equal(llmsFull.response.status, 200)
	const { recent: recentGuides, all: allGuides } = guidesFromDisk()
	for (const [name, body] of [
		["llms.txt", llms.body],
		["llms-full.txt", llmsFull.body],
	] as const) {
		assert.ok(body.includes(expectedName), `${name} business name`)
		assert.ok(body.includes("831.225.4344"), `${name} phone`)
		assert.ok(body.includes(expectedStreet), `${name} address`)
		assert.ok(
			body.includes("Monday to Friday, 9:00 AM to 5:00 PM"),
			`${name} hours`,
		)
		assert.ok(body.includes(expectedUrl), `${name} URL`)
		assert.ok(body.includes("Recent guides"), `${name} recent guides`)
		for (const guide of recentGuides) {
			assert.ok(
				body.includes(`/${guide.slug}`),
				`${name} recent guide /${guide.slug}`,
			)
		}
		for (const guide of allGuides) {
			assert.ok(body.includes(`/${guide.slug}`), `${name} guide /${guide.slug}`)
		}
		assert.ok(
			body.includes("/service-area/santa-cruz-ca-plumbing-septic-services"),
			`${name} Santa Cruz town page`,
		)
	}

	const htmlEntries = entries.filter((entry) => {
		const pathname = new URL(entry.loc).pathname
		return isHtmlPath(pathname)
	})
	const sitemapPaths = new Set(
		entries.map((entry) => new URL(entry.loc).pathname),
	)
	for (const guide of allGuides) {
		assert.ok(
			sitemapPaths.has(`/${guide.slug}`),
			`guide missing from sitemap: /${guide.slug}`,
		)
	}

	const titles = new Map<string, string>()
	const descriptions = new Map<string, string>()
	const pages = new Map<string, PageRecord>()
	const pending = new Set<string>()
	const assets = new Set<string>()
	const blockingScripts = new Set<string>()
	const fragments = new Map<string, Set<string>>()
	const outbound = new Map<string, Set<string>>()
	let plumberNodes = 0
	assets.add(INTER_FONT_PATH)

	function addHop(from: string, to: string) {
		if (!to.startsWith("/") || isSkippablePath(to) || !isHtmlPath(to)) return
		const edges = outbound.get(from) ?? new Set<string>()
		edges.add(to)
		outbound.set(from, edges)
	}

	function noteFragment(pathname: string, hash: string, from: string) {
		if (!hash) return
		const key = `${pathname}#${hash}`
		const sources = fragments.get(key) ?? new Set()
		sources.add(from)
		fragments.set(key, sources)
	}

	function noteTarget(pathname: string, from: string, hash = "") {
		if (!pathname.startsWith("/") || isSkippablePath(pathname)) return
		if (!isHtmlPath(pathname)) {
			assets.add(pathname)
			return
		}
		noteFragment(pathname, hash, from)
		if (!pages.has(pathname)) pending.add(pathname)
	}

	function inspectHtml(pathname: string, body: string) {
		if (!hasInterFontPreload(body))
			issues.push(`${pathname}: missing Inter font preload`)
		for (const src of blockingScriptSrcs(body)) {
			if (!src.startsWith("/_next/static/")) continue
			const assetPath = src.split("?")[0] ?? src
			assets.add(assetPath)
			blockingScripts.add(assetPath)
		}

		const blocks = parseJsonLdScripts(body)
		if (blocks.length === 0) issues.push(`${pathname}: no JSON-LD`)
		issues.push(...jsonLdParseIssues(blocks, pathname))

		for (const block of blocks) {
			issues.push(
				...jsonLdBusinessFactIssues(block).map(
					(issue) => `${pathname}: ${issue}`,
				),
			)
		}

		const nodes = blocks.flatMap((block) => collectJsonLdNodes(block))
		const visible = visiblePageText(body)
		for (const node of nodes) {
			if (!nodeHasType(node, "FAQPage")) continue
			const questions = Array.isArray(node.mainEntity) ? node.mainEntity : []
			for (const item of questions) {
				if (!item || typeof item !== "object") continue
				const question = (item as JsonLdNode).name
				if (typeof question !== "string" || !question) continue
				if (!visible.includes(question))
					issues.push(`${pathname}: FAQPage question not visible: ${question}`)
			}
		}
		if (pathname.startsWith("/service-offerings/")) {
			const service = nodes.find(
				(node) =>
					nodeHasType(node, "Service") &&
					typeof node["@id"] === "string" &&
					node["@id"].endsWith("#service"),
			)
			const areas = Array.isArray(service?.areaServed) ? service.areaServed : []
			const names = areas.flatMap((area) =>
				area &&
				typeof area === "object" &&
				"name" in area &&
				typeof (area as JsonLdNode).name === "string"
					? [(area as JsonLdNode).name as string]
					: [],
			)
			for (const name of [
				"Santa Cruz County, California",
				...serviceAreaLocations.map((location) => location.name),
			]) {
				if (!names.includes(name))
					issues.push(`${pathname}: Service areaServed missing ${name}`)
			}
		}
		const business = nodes.find((node) => nodeHasType(node, "Plumber"))
		if (business) {
			plumberNodes += 1
			if (business.name !== expectedName)
				issues.push(`${pathname}: LocalBusiness name ${String(business.name)}`)
			if (business.telephone !== expectedPhone)
				issues.push(
					`${pathname}: LocalBusiness telephone ${String(business.telephone)}`,
				)
			if (business.url !== expectedUrl)
				issues.push(`${pathname}: LocalBusiness url ${String(business.url)}`)
			if (business.openingHours !== expectedHours)
				issues.push(
					`${pathname}: LocalBusiness hours ${String(business.openingHours)}`,
				)
			const address = business.address as JsonLdNode | undefined
			if (address?.streetAddress !== expectedStreet)
				issues.push(
					`${pathname}: LocalBusiness street ${String(address?.streetAddress)}`,
				)
		}

		const title = pageTitle(body)
		const description = metaDescription(body)
		const canonical = canonicalHref(body)
		const expectedCanonical = `${expectedUrl}${pathname === "/" ? "" : pathname}`
		const noindex = robotsNoindex(body)
		if (!title) issues.push(`${pathname}: missing title`)
		if (!description) issues.push(`${pathname}: missing meta description`)
		const decodedTitle = decodeHtmlText(title)
		const decodedDescription = decodeHtmlText(description)
		if (decodedDescription && decodedDescription.length > 160)
			issues.push(
				`${pathname}: meta description is ${decodedDescription.length} characters`,
			)
		if (!noindex) {
			if (titles.has(decodedTitle))
				issues.push(
					`${pathname}: duplicate title "${decodedTitle}" also on ${titles.get(decodedTitle)}`,
				)
			titles.set(decodedTitle, pathname)
			if (decodedDescription) {
				const previous = descriptions.get(decodedDescription)
				if (previous)
					issues.push(
						`${pathname}: duplicate meta description also on ${previous}`,
					)
				descriptions.set(decodedDescription, pathname)
			}
		}
		if (
			title &&
			(isServicePage(pathname) ||
				isTownHub(pathname) ||
				isCityServicePage(pathname)) &&
			!titleNamesServiceOrTown(pathname, title)
		)
			issues.push(`${pathname}: title does not name the town or service`)
		if (!canonical) issues.push(`${pathname}: missing canonical`)
		else if (canonical !== expectedCanonical && canonical !== pathname)
			issues.push(`${pathname}: canonical ${canonical}`)

		const h1 = headingCount(body)
		if (h1 !== 1) issues.push(`${pathname}: expected 1 H1, found ${h1}`)

		if (isServiceOrTown(pathname)) {
			const lead = visibleLead(body)
			if (!/Quotes are free/i.test(lead))
				issues.push(`${pathname}: missing free-quote summary near the top`)
			if (!/831\.225\.4344/.test(lead))
				issues.push(`${pathname}: missing phone in the top summary`)
			if (
				!/Santa Cruz County|selected addresses/i.test(lead) &&
				!pathname.startsWith("/service-area/")
			)
				issues.push(`${pathname}: missing service area in the top summary`)
		}

		for (const link of extractLinks(body)) {
			const classified = classifyHref(link.href)
			const looksLikeCall =
				classified.kind === "tel" ||
				(classified.kind === "empty" &&
					/call|831\.225\.4344|\+1\s*831/i.test(link.text))
			if (classified.kind === "empty" || classified.kind === "tel") {
				if (looksLikeCall && link.href !== expectedTel) {
					issues.push(`${pathname}: call link ${link.href || "(empty href)"}`)
				} else if (classified.kind === "empty") {
					issues.push(`${pathname}: empty href`)
				}
				continue
			}
			const resolved = resolveInternalHref(link.href, pathname, origin)
			if (!resolved || "invalid" in resolved) {
				if (resolved && "invalid" in resolved)
					issues.push(`${pathname}: malformed link ${link.href}`)
				continue
			}
			if ("external" in resolved) continue
			addHop(pathname, resolved.pathname)
			noteTarget(resolved.pathname, pathname, resolved.hash)
		}

		for (const image of extractImages(body)) {
			if (image.alt === null)
				issues.push(`${pathname}: image ${image.src} is missing alt text`)
			if (imageNeedsDimensions(image))
				issues.push(
					`${pathname}: image ${image.src} is missing width/height (CLS)`,
				)
			const resolved = resolveInternalHref(image.src, pathname, origin)
			if (resolved && !("external" in resolved) && !("invalid" in resolved))
				assets.add(resolved.pathname)
		}
	}

	async function loadPage(pathname: string, fromSitemap: boolean) {
		const localPath = pathname === "/" ? "/" : pathname
		let fetched: Awaited<ReturnType<typeof fetchOnce>>
		try {
			fetched = await fetchOnce(localPath, "manual")
		} catch (error) {
			issues.push(
				`${pathname}: fetch failed (${error instanceof Error ? error.message : "unknown"})`,
			)
			return
		}
		const { response, body, location } = fetched
		const record: PageRecord = {
			pathname,
			status: response.status,
			body,
			location,
			ids: new Set(),
			canonical: undefined,
			noindex: false,
			isHtml: isHtmlPath(pathname),
		}

		if (response.status >= 300 && response.status < 400) {
			issues.push(
				`${pathname}: redirected to ${location}${fromSitemap ? " (sitemap)" : ""}`,
			)
			pages.set(pathname, record)
			return
		}
		if (response.status !== 200) {
			issues.push(`${pathname}: HTTP ${response.status}`)
			pages.set(pathname, record)
			return
		}

		if (!record.isHtml) {
			pages.set(pathname, record)
			return
		}

		record.ids = extractIds(body)
		record.canonical = canonicalHref(body)
		record.noindex = robotsNoindex(body)
		pages.set(pathname, record)
		inspectHtml(pathname, body)
	}

	await mapPool(htmlEntries, 8, async (entry) => {
		const pathname = new URL(entry.loc).pathname
		await loadPage(pathname === "/" ? "/" : pathname, true)
	})

	for (let round = 0; round < 4 && pending.size > 0; round++) {
		const batch = [...pending].filter((pathname) => !pages.has(pathname))
		pending.clear()
		await mapPool(batch, 8, async (pathname) => {
			await loadPage(pathname, false)
		})
	}

	for (const pathname of pending) {
		if (!pages.has(pathname))
			issues.push(`${pathname}: linked internally but never fetched`)
	}

	for (const [target, sources] of fragments) {
		const hashIndex = target.indexOf("#")
		const pathname = target.slice(0, hashIndex)
		const hash = decodeFragment(target.slice(hashIndex + 1))
		const page = pages.get(pathname)
		if (!page || page.status !== 200) continue
		if (page.ids.has(hash)) continue
		issues.push(
			`${pathname}#${hash}: missing heading/id (from ${[...sources].slice(0, 3).join(", ")})`,
		)
	}

	await mapPool([...assets], 8, async (pathname) => {
		if (pages.has(pathname) && pages.get(pathname)?.status === 200) return
		const { response, body } = await fetchOnce(pathname, "manual")
		if (response.status >= 300 && response.status < 400) {
			issues.push(`${pathname}: asset redirected`)
			return
		}
		if (response.status !== 200)
			issues.push(`${pathname}: asset HTTP ${response.status}`)
		if (blockingScripts.has(pathname) && body.length > 20_000) {
			issues.push(
				`${pathname}: render-blocking script is ${body.length} bytes (budget 20KB). Modern browsers should not download polyfill-nomodule.`,
			)
		}
	})

	for (const [pathname, page] of pages) {
		if (!page.isHtml || page.status !== 200 || page.noindex) continue
		if (isSkippablePath(pathname)) continue
		if (sitemapPaths.has(pathname)) continue
		if (pathname.startsWith("/services/") && pathname.split("/").length === 3)
			continue
		issues.push(`${pathname}: indexable page missing from the sitemap`)
	}

	const contact = pages.get("/contact")
	if (!contact || contact.status !== 200)
		issues.push("/contact: missing from crawl")
	else {
		if (!contact.ids.has("quote"))
			issues.push("/contact: missing #quote target for Free Quote links")
		if (quoteEmailConfigured()) {
			if (!contact.body.includes('action="/api/quote"'))
				issues.push("/contact: quote form action missing")
		} else {
			if (contact.body.includes('action="/api/quote"')) {
				issues.push(
					"/contact: quote form should be hidden when quote email is not configured",
				)
			}
			if (!contact.body.includes(contactInfo.phoneHref))
				issues.push("/contact: call-or-email block missing phone link")
			if (!contact.body.includes(contactInfo.emailHref))
				issues.push("/contact: call-or-email block missing email link")
			if (!contact.body.includes(weekdayHoursPhrase()))
				issues.push("/contact: call-or-email block missing office hours")
			if (advertisedQuoteFormCopy.test(visiblePageText(contact.body)))
				issues.push(
					"/contact: visible copy still advertises a quote form while email is unconfigured",
				)
		}
	}

	const hopsFromHome = new Map<string, number>([["/", 0]])
	const hopQueue = ["/"]
	while (hopQueue.length) {
		const node = hopQueue.shift()!
		const depth = hopsFromHome.get(node) ?? 0
		if (depth >= 2) continue
		for (const next of outbound.get(node) ?? []) {
			if (hopsFromHome.has(next)) continue
			hopsFromHome.set(next, depth + 1)
			hopQueue.push(next)
		}
	}
	for (const pathname of sitemapPaths) {
		if (
			!isServicePage(pathname) &&
			!isTownHub(pathname) &&
			!isCityServicePage(pathname)
		)
			continue
		const hops = hopsFromHome.get(pathname)
		if (hops === undefined || hops > 2)
			issues.push(
				`${pathname}: not reachable within 2 clicks of home${hops === undefined ? "" : ` (${hops} hops)`}`,
			)
	}

	await checkQuoteEndpoint(issues)

	assert.ok(
		plumberNodes > 0,
		"crawled HTML must include the sitewide Plumber JSON-LD",
	)

	if (issues.length) {
		const cls = issues.filter((issue) => issue.includes("width/height (CLS)"))
		const rest = issues.filter((issue) => !issue.includes("width/height (CLS)"))
		console.error(`Built-output crawl issues (${issues.length}):`)
		for (const issue of rest) console.error(`  ${issue}`)
		if (cls.length)
			console.error(
				`  ${cls.length} images missing width/height (first: ${cls[0]})`,
			)
		process.exitCode = 1
		return
	}

	console.log(
		`Built-output crawl passed (${entries.length} sitemap URLs, ${htmlEntries.length} HTML pages, ${pages.size} fetched paths, ${plumberNodes} Plumber nodes)`,
	)
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
