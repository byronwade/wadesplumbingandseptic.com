import assert from "node:assert/strict"
import Module from "node:module"

/*
 * lib/content, lib/sitemap, and the llms routes are Next server modules.
 * Stub runtime-only imports so this check can run under plain tsx.
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

function missingFrom(label: string, required: string[], haystack: Set<string>) {
	return required
		.filter((path) => !haystack.has(path))
		.map((path) => `${label}: ${path}`)
}

async function main() {
	const { extractLlmsSitePaths } = await import("../../lib/llms")
	const { siteConfig } = await import("../../lib/site")
	const extracted = extractLlmsSitePaths(
		`Website: ${siteConfig.url}
- [Facts](${siteConfig.url}/facts): Confirmed facts.
Source: ${siteConfig.url}/service-offerings/drain-cleaning`,
	)
	assert.deepEqual([...extracted].sort(), [
		"/",
		"/facts",
		"/service-offerings/drain-cleaning",
	])

	const { getAllRoutes } = await import("../../lib/content")
	const { buildSitemapEntries } = await import("../../lib/sitemap")
	const { serviceAreaLocations } = await import("../../lib/service-areas")
	const { cityServicePages, cityServicePath } =
		await import("../../lib/city-service-pages")
	const { GET: llmsGet } = await import("../../app/llms.txt/route")
	const { GET: llmsFullGet } = await import("../../app/llms-full.txt/route")

	const { services, posts } = await getAllRoutes()
	const sitemapPaths = new Set(
		(await buildSitemapEntries()).map((entry) => {
			const path = entry.url.slice(siteConfig.url.length)
			return path === "" ? "/" : path
		}),
	)

	const liveServices = services
		.filter((service) => !service.noindex)
		.map((service) => `/service-offerings/${service.slug}`)
	const liveTowns = serviceAreaLocations.map((location) => location.href)
	const liveGuides = posts
		.filter((post) => !post.noindex)
		.map((post) => `/${post.slug}`)
	const liveCityServices = cityServicePages.map((page) =>
		cityServicePath(page.citySlug, page.serviceSlug),
	)

	assert.ok(liveServices.length > 0, "expected published services")
	assert.ok(liveTowns.length > 0, "expected town hubs")
	assert.ok(liveGuides.length > 0, "expected indexable guides")
	assert.ok(liveCityServices.length > 0, "expected city x service pages")

	const llms = await (await llmsGet()).text()
	const llmsFull = await (await llmsFullGet()).text()
	const llmsPaths = extractLlmsSitePaths(llms)
	const llmsFullPaths = extractLlmsSitePaths(llmsFull)

	const problems = [
		...missingFrom("sitemap missing service", liveServices, sitemapPaths),
		...missingFrom("sitemap missing town", liveTowns, sitemapPaths),
		...missingFrom("sitemap missing guide", liveGuides, sitemapPaths),
		...missingFrom(
			"sitemap missing city-service",
			liveCityServices,
			sitemapPaths,
		),
		...missingFrom("llms.txt missing service", liveServices, llmsPaths),
		...missingFrom("llms.txt missing town", liveTowns, llmsPaths),
		...missingFrom("llms.txt missing guide", liveGuides, llmsPaths),
		...missingFrom(
			"llms.txt missing city-service",
			liveCityServices,
			llmsPaths,
		),
		...missingFrom(
			"llms-full.txt missing service",
			liveServices,
			llmsFullPaths,
		),
		...missingFrom("llms-full.txt missing town", liveTowns, llmsFullPaths),
		...missingFrom("llms-full.txt missing guide", liveGuides, llmsFullPaths),
	]

	const allowedLlmsOnly = new Set(["/llms.txt", "/llms-full.txt"])
	for (const path of llmsPaths) {
		if (allowedLlmsOnly.has(path)) continue
		if (!sitemapPaths.has(path))
			problems.push(`llms.txt names a URL that is not in the sitemap: ${path}`)
		if (
			path.startsWith("/services/") &&
			path !== "/services/popular" &&
			path !== "/services/trending"
		)
			problems.push(
				`llms.txt names a /services alias instead of the canonical URL: ${path}`,
			)
	}
	for (const path of llmsFullPaths) {
		if (allowedLlmsOnly.has(path)) continue
		if (!sitemapPaths.has(path))
			problems.push(
				`llms-full.txt names a URL that is not in the sitemap: ${path}`,
			)
	}

	assert.deepEqual(problems, [])
	console.log(
		`llms/sitemap/route drift check passed (${liveServices.length} services, ${liveTowns.length} towns, ${liveGuides.length} guides, ${liveCityServices.length} city-service pages, ${sitemapPaths.size} sitemap URLs)`,
	)
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
