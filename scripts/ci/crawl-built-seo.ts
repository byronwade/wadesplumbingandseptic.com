import assert from "node:assert/strict"

import { jsonLdBusinessFactIssues } from "./business-facts"
import {
	collectJsonLdNodes,
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
	"Bingbot",
]

const expectedName = "Wade's Plumbing & Septic"
const expectedPhone = "+18312254344"
const expectedUrl = "https://www.wadesplumbingandseptic.com"
const expectedStreet = "7737 Highway 9"
const expectedHours = "Mo-Fr 09:00-17:00"

function schemaTypes(value: unknown) {
	if (typeof value === "string") return [value]
	if (Array.isArray(value))
		return value.filter((entry): entry is string => typeof entry === "string")
	return []
}

function nodeHasType(node: JsonLdNode, type: string) {
	return schemaTypes(node["@type"]).includes(type)
}

async function fetchText(path: string, redirect: RequestRedirect = "manual") {
	const url = `${origin}${path}`
	const response = await fetch(url, { redirect })
	return { url, response, body: await response.text() }
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

function canonicalHref(html: string) {
	return html.match(
		/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i,
	)?.[1]
}

function pageTitle(html: string) {
	return html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? ""
}

function headingCount(html: string) {
	return [...html.matchAll(/<h1\b/gi)].length
}

function visibleLead(html: string) {
	return html
		.replace(/<script[\s\S]*?<\/script>/gi, " ")
		.replace(/<style[\s\S]*?<\/style>/gi, " ")
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.slice(0, 4000)
}

function isHtmlPath(pathname: string) {
	return !/\.(?:txt|xml|json|csv|vcf)$/i.test(pathname)
}

function isServiceOrTown(pathname: string) {
	return (
		pathname.startsWith("/service-offerings/") ||
		pathname.startsWith("/service-area/")
	)
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

async function main() {
	const issues: string[] = []

	const robots = await fetchText("/robots.txt", "follow")
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

	const sitemap = await fetchText("/sitemap.xml", "follow")
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

	const llms = await fetchText("/llms.txt", "follow")
	const llmsFull = await fetchText("/llms-full.txt", "follow")
	assert.equal(llms.response.status, 200)
	assert.equal(llmsFull.response.status, 200)
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
		assert.ok(
			body.includes("/santa-cruz-septic-inspection-at-sale"),
			`${name} #301 septic sale guide`,
		)
		assert.ok(
			body.includes("/slab-leak-signs-santa-cruz-homes"),
			`${name} #301 slab leak guide`,
		)
		assert.ok(
			body.includes("/how-to-prepare-for-a-re-pipe-santa-cruz"),
			`${name} #297 re-pipe guide`,
		)
		assert.ok(
			body.includes("/backflow-testing-santa-cruz-county-homes"),
			`${name} #297 backflow guide`,
		)
		assert.ok(
			body.includes("/sewer-camera-inspection-santa-cruz-homes"),
			`${name} #297 camera guide`,
		)
		assert.ok(
			body.includes("/service-area/santa-cruz-ca-plumbing-septic-services"),
			`${name} Santa Cruz town page`,
		)
	}

	const htmlEntries = entries.filter((entry) => {
		const pathname = new URL(entry.loc).pathname
		return isHtmlPath(pathname)
	})

	const titles = new Map<string, string>()
	const descriptions = new Map<string, string>()
	let plumberNodes = 0

	await mapPool(htmlEntries, 8, async (entry) => {
		const pathname = new URL(entry.loc).pathname
		const localPath = pathname === "/" ? "/" : pathname
		const { response, body } = await fetchText(localPath, "manual")
		if (response.status >= 300 && response.status < 400) {
			issues.push(
				`${pathname}: redirected to ${response.headers.get("location")}`,
			)
			return
		}
		if (response.status !== 200) {
			issues.push(`${pathname}: HTTP ${response.status}`)
			return
		}

		const blocks = parseJsonLdScripts(body)
		if (blocks.length === 0) issues.push(`${pathname}: no JSON-LD`)
		issues.push(...jsonLdParseIssues(blocks, pathname))

		const nodes = blocks.flatMap((block) => collectJsonLdNodes(block))
		for (const block of blocks) {
			issues.push(
				...jsonLdBusinessFactIssues(block).map(
					(issue) => `${pathname}: ${issue}`,
				),
			)
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
		const description =
			body.match(
				/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i,
			)?.[1] ?? ""
		const canonical = canonicalHref(body)
		const expectedCanonical = `${expectedUrl}${pathname === "/" ? "" : pathname}`
		if (!title) issues.push(`${pathname}: missing title`)
		if (titles.has(title) && isServiceOrTown(pathname))
			issues.push(
				`${pathname}: duplicate title "${title}" also on ${titles.get(title)}`,
			)
		if (isServiceOrTown(pathname)) titles.set(title, pathname)
		if (isServiceOrTown(pathname) && description) {
			const previous = descriptions.get(description)
			if (previous)
				issues.push(
					`${pathname}: duplicate meta description also on ${previous}`,
				)
			descriptions.set(description, pathname)
		}
		if (!canonical) issues.push(`${pathname}: missing canonical`)
		else if (canonical !== expectedCanonical && canonical !== pathname)
			issues.push(`${pathname}: canonical ${canonical}`)

		if (isServiceOrTown(pathname)) {
			const h1 = headingCount(body)
			if (h1 !== 1) issues.push(`${pathname}: expected 1 H1, found ${h1}`)
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
	})

	assert.ok(
		plumberNodes > 0,
		"crawled HTML must include the sitewide Plumber JSON-LD",
	)

	if (issues.length) {
		console.error(`Built-output crawl issues (${issues.length}):`)
		for (const issue of issues.slice(0, 80)) console.error(`  ${issue}`)
		if (issues.length > 80) console.error(`  … ${issues.length - 80} more`)
		process.exitCode = 1
		return
	}

	console.log(
		`Built-output crawl passed (${entries.length} sitemap URLs, ${htmlEntries.length} HTML pages, ${plumberNodes} Plumber nodes)`,
	)
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
