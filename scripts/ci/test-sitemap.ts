import assert from "node:assert/strict"
import Module from "node:module"

/*
 * lib/content and lib/sitemap are Next server modules. Stub the runtime-only
 * imports so the inventory builder can run under plain tsx in CI.
 */
const load = (
	Module as typeof Module & {
		_load: (
			request: string,
			parent: NodeModule | null,
			isMain: boolean,
		) => unknown
	}
)._load

;(
	Module as typeof Module & {
		_load: (
			request: string,
			parent: NodeModule | null,
			isMain: boolean,
		) => unknown
	}
)._load = function patchedLoad(request, parent, isMain) {
	if (request === "server-only") return {}
	if (request === "next/cache") {
		return {
			cacheLife() {},
			cacheTag() {},
		}
	}
	return load(request, parent, isMain)
}

async function main() {
	const { getCollection, taxonomySlug } = await import("../../lib/content")
	const { SITEMAP_EXCLUDED_PATHS, SITEMAP_MIN_TAG_POSTS, buildSitemapEntries } =
		await import("../../lib/sitemap")
	const { siteConfig } = await import("../../lib/site")

	function pathFromUrl(url: string) {
		const base = siteConfig.url
		assert.ok(
			url.startsWith(base),
			`Expected sitemap URL on site origin: ${url}`,
		)
		const path = url.slice(base.length)
		return path === "" ? "/" : path
	}

	const entries = await buildSitemapEntries()
	const paths = entries.map((entry) => pathFromUrl(entry.url))
	const pathSet = new Set(paths)

	assert.ok(
		entries.length > 50,
		"Sitemap should include the core site inventory",
	)
	assert.equal(new Set(entries.map((entry) => entry.url)).size, entries.length)

	assert.ok(pathSet.has("/"), "Home must be present")
	assert.ok(pathSet.has("/services"), "Services hub must be present")
	assert.ok(pathSet.has("/service-areas"), "Service areas hub must be present")
	assert.ok(pathSet.has("/expert-tips"), "Expert tips hub must be present")
	assert.ok(pathSet.has("/contact"), "Contact must be present")

	const home = entries.find((entry) => pathFromUrl(entry.url) === "/")
	assert.equal(home?.priority, 1)
	assert.equal(home?.changeFrequency, "weekly")

	const serviceAreas = entries.find(
		(entry) => pathFromUrl(entry.url) === "/service-areas",
	)
	assert.ok((serviceAreas?.priority ?? 0) >= 0.9)

	for (const excluded of SITEMAP_EXCLUDED_PATHS) {
		assert.ok(
			!pathSet.has(excluded),
			`Excluded path leaked into sitemap: ${excluded}`,
		)
	}

	const noindexPages = (await getCollection("pages")).filter(
		(page) => page.noindex,
	)
	for (const page of noindexPages) {
		assert.ok(
			!pathSet.has(`/${page.slug}`),
			`noindex page should be omitted: /${page.slug}`,
		)
	}

	for (const path of paths) {
		assert.ok(
			!path.startsWith("/services/"),
			`Use canonical service URLs, not ${path}`,
		)
		assert.ok(!path.startsWith("/api/"), `API routes must not appear: ${path}`)
	}

	const services = (await getCollection("services")).filter(
		(service) => !service.noindex,
	)
	for (const service of services) {
		const path = `/service-offerings/${service.slug}`
		assert.ok(pathSet.has(path), `Missing service URL: ${path}`)
		if (service.image) {
			const entry = entries.find((item) => pathFromUrl(item.url) === path)
			assert.ok(
				entry?.images?.some((image) => image.includes(service.image!)),
				`Service sitemap entry should advertise its image: ${path}`,
			)
		}
	}

	const posts = (await getCollection("posts")).filter((post) => !post.noindex)
	const tagCounts = new Map<string, number>()
	for (const post of posts) {
		assert.ok(pathSet.has(`/${post.slug}`), `Missing tip URL: /${post.slug}`)
		for (const tag of post.tags ?? []) {
			const slug = taxonomySlug(tag)
			tagCounts.set(slug, (tagCounts.get(slug) ?? 0) + 1)
		}
	}

	for (const [slug, count] of tagCounts) {
		const path = `/tag/${slug}`
		if (count < SITEMAP_MIN_TAG_POSTS) {
			assert.ok(!pathSet.has(path), `Thin tag should be omitted: ${path}`)
		} else {
			assert.ok(pathSet.has(path), `Popular tag should be included: ${path}`)
		}
	}

	assert.ok(
		entries.every(
			(entry) => (entry.priority ?? 0) >= 0 && (entry.priority ?? 0) <= 1,
		),
		"Priorities must stay within 0..1",
	)

	const orderedPriorities = entries.map((entry) => entry.priority ?? 0)
	const sorted = [...orderedPriorities].sort((a, b) => b - a)
	assert.deepEqual(
		orderedPriorities,
		sorted,
		"Sitemap entries should be sorted by priority so chunk 0 is money pages",
	)

	console.log(
		`Sitemap quality checks passed ✓ (${entries.length} URLs, ${
			entries.filter((entry) => entry.images?.length).length
		} with images)`,
	)
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
