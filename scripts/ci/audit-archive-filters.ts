import assert from "node:assert/strict"
import Module from "node:module"

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
	const { getCollection } = await import("../../lib/content")
	const {
		toArchiveItem,
		buildArchiveFilters,
		filterArchiveItems,
		paginateArchiveItems,
		resolveArchiveCategory,
	} = await import("../../lib/archive")
	const { attachViewStats, sortArchiveItems } =
		await import("../../lib/page-views/ranking")
	const { utcDayNow } = await import("../../lib/page-views/stats")
	const { getPageViewStoreCached } = await import("../../lib/page-views")

	const services = await getCollection("services")
	const posts = await getCollection("posts")
	const serviceItems = services.map((service) =>
		toArchiveItem(
			service,
			`/service-offerings/${service.slug}`,
			service.category ?? "Plumbing",
		),
	)
	const tipItems = posts.map((post) =>
		toArchiveItem(post, `/${post.slug}`, post.category ?? "Expert Tips"),
	)
	const store = await getPageViewStoreCached()
	const today = utcDayNow()
	const rankedServices = attachViewStats(serviceItems, store, "service", today)
	const rankedTips = attachViewStats(tipItems, store, "tip", today)

	console.log(`SERVICES ${rankedServices.length}`)
	const svcFilters = buildArchiveFilters(rankedServices)
	console.log("filters", svcFilters)
	assert.ok(
		svcFilters.length > 1,
		"Services need multiple categories to filter",
	)
	for (const filter of svcFilters) {
		assert.equal(
			filterArchiveItems(rankedServices, filter.key).length,
			filter.count,
			`count mismatch ${filter.key}`,
		)
	}
	assert.equal(filterArchiveItems(rankedServices, "nope").length, 0)

	const pop = sortArchiveItems(rankedServices, "popular")
	const trend = sortArchiveItems(rankedServices, "trending")
	const def = sortArchiveItems(rankedServices, "default")
	console.log(
		"popular top",
		pop
			.slice(0, 5)
			.map((item) => [item.slug, item.uniqueViews, item.trendingScore]),
	)
	console.log(
		"trending top",
		trend
			.slice(0, 5)
			.map((item) => [item.slug, item.uniqueViews, item.trendingScore]),
	)
	console.log(
		"default top",
		def.slice(0, 5).map((item) => item.slug),
	)
	assert.notDeepEqual(
		pop.map((item) => item.slug),
		def.map((item) => item.slug),
		"Popular sort should change service order vs default",
	)

	const septicPop = filterArchiveItems(pop, "septic")
	for (let index = 1; index < septicPop.length; index += 1) {
		assert.ok(
			(septicPop[index - 1]?.uniqueViews ?? 0) >=
				(septicPop[index]?.uniqueViews ?? 0),
		)
	}
	const page2 = paginateArchiveItems(septicPop, 2, 12)
	assert.equal(page2.page, Math.min(2, page2.pageCount))
	console.log(
		`septic popular ${septicPop.length}; page2 size ${page2.pageItems.length}`,
	)

	console.log(`\nTIPS ${rankedTips.length}`)
	const tipFilters = buildArchiveFilters(rankedTips)
	console.log("filters", tipFilters)
	assert.ok(tipFilters.length > 1, "Tips need multiple categories to filter")
	for (const filter of tipFilters) {
		assert.equal(
			filterArchiveItems(rankedTips, filter.key).length,
			filter.count,
		)
	}

	const tipNewest = sortArchiveItems(rankedTips, "newest")
	const tipPop = sortArchiveItems(rankedTips, "popular")
	const tipTrend = sortArchiveItems(rankedTips, "trending")
	console.log(
		"newest",
		tipNewest.slice(0, 5).map((item) => [item.slug, item.date]),
	)
	console.log(
		"popular",
		tipPop
			.slice(0, 5)
			.map((item) => [item.slug, item.uniqueViews, item.trendingScore]),
	)
	console.log(
		"trending",
		tipTrend
			.slice(0, 5)
			.map((item) => [item.slug, item.uniqueViews, item.trendingScore]),
	)

	for (let index = 1; index < tipNewest.length; index += 1) {
		const earlier = String(tipNewest[index - 1]?.date ?? "")
		const later = String(tipNewest[index]?.date ?? "")
		assert.ok(earlier >= later, `newest order broken ${earlier} vs ${later}`)
	}
	assert.notDeepEqual(
		tipNewest.map((item) => item.slug),
		tipPop.map((item) => item.slug),
		"Newest and popular tip orders should differ",
	)

	console.log(
		"services with views",
		rankedServices.filter((item) => item.uniqueViews > 0).length,
		"/",
		rankedServices.length,
	)
	console.log(
		"tips with views",
		rankedTips.filter((item) => item.uniqueViews > 0).length,
		"/",
		rankedTips.length,
	)
	assert.notDeepEqual(
		pop.map((item) => item.slug),
		trend.map((item) => item.slug),
		"Service popular and trending orders should differ with seed data",
	)
	assert.notDeepEqual(
		tipPop.map((item) => item.slug),
		tipTrend.map((item) => item.slug),
		"Tip popular and trending orders should differ with seed data",
	)

	assert.equal(
		resolveArchiveCategory(svcFilters, "nope"),
		null,
		"Invalid service category resolves to all",
	)

	console.log("archive filter audit passed")
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
