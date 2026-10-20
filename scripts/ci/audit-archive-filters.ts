import assert from "node:assert/strict"
import Module from "node:module"

import type { ArchiveItem } from "../../lib/archive"
import type { PageViewKind, PageViewStore } from "../../lib/page-views/types"

// Synthetic audit data stays in memory, separate from local or Blob analytics.
// Pin both the observation day and daily buckets so calendar time cannot age it.
const FIXTURE_DAY = "2026-07-30"

// Increasing lifetime counts and rotated recent counts give all three sort
// modes distinct orders, so returning the input unchanged cannot pass.
function fixtureStore(items: ArchiveItem[], kind: PageViewKind): PageViewStore {
	return {
		version: 1,
		updatedAt: `${FIXTURE_DAY}T12:00:00.000Z`,
		pages: Object.fromEntries(
			items.map((item, index) => [
				`${kind}:${item.slug}`,
				{
					unique: items.length * 100 + index,
					views: items.length * 200 + index,
					daily: {
						[FIXTURE_DAY]: items.length - ((index + 1) % items.length),
						"2026-07-24": 1, // Oldest day inside the seven-day window.
						"2026-07-23": items.length * 2, // Just outside the window.
						"2026-07-31": items.length * 3, // Future days do not count.
					},
				},
			]),
		),
	}
}

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
	const rankedServices = attachViewStats(
		serviceItems,
		fixtureStore(serviceItems, "service"),
		"service",
		FIXTURE_DAY,
	)
	const rankedTips = attachViewStats(
		tipItems,
		fixtureStore(tipItems, "tip"),
		"tip",
		FIXTURE_DAY,
	)
	console.log(
		`Synthetic in-memory view fixture, observation day ${FIXTURE_DAY}`,
	)
	for (const items of [rankedServices, rankedTips]) {
		assert.ok(
			items.length > 2,
			"Ranking audit needs at least three content items",
		)
		assert.deepEqual(
			items.map(({ uniqueViews, totalViews, trendingScore }) => ({
				uniqueViews,
				totalViews,
				trendingScore,
			})),
			items.map((_, index) => ({
				uniqueViews: items.length * 100 + index,
				totalViews: items.length * 200 + index,
				trendingScore: items.length - ((index + 1) % items.length) + 1,
			})),
			"View stats must include exactly the fixture's seven-day window",
		)
		assert.deepEqual(
			sortArchiveItems(items, "popular"),
			[...items].reverse(),
			"Popular order must follow lifetime unique views",
		)
		assert.deepEqual(
			sortArchiveItems(items, "trending"),
			[items[items.length - 1], ...items.slice(0, -1)],
			"Trending order must follow recent views instead of lifetime views",
		)
		assert.deepEqual(
			sortArchiveItems(items, "default"),
			items,
			"Default order must preserve the content inventory order",
		)
	}

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
