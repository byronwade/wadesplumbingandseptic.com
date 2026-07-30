import { connection } from "next/server"

import { FilterableArchive } from "@/components/filterable-archive"
import { toArchiveItem, type ArchiveItem } from "@/lib/archive"
import { getCollection } from "@/lib/content"
import { getPageViewStoreCached } from "@/lib/page-views"
import {
	attachViewStats,
	sortArchiveItems,
	type ArchiveSort,
} from "@/lib/page-views/ranking"
import { utcDayNow } from "@/lib/page-views/stats"

async function serviceItems() {
	const services = await getCollection("services")
	return services.map((service) =>
		toArchiveItem(
			service,
			`/service-offerings/${service.slug}`,
			service.category ?? "Plumbing",
		),
	)
}

async function tipItems() {
	const posts = await getCollection("posts")
	return posts.map((post) =>
		toArchiveItem(post, `/${post.slug}`, post.category ?? "Expert Tips"),
	)
}

export async function RankedContentArchive({
	variant,
	sort = "default",
	pageSize,
	allLabel,
	emptyLabel,
	noun,
	showFilters = true,
	lockedSort = false,
}: {
	variant: "service" | "tip"
	sort?: ArchiveSort
	pageSize: number
	allLabel: string
	emptyLabel: string
	noun: { singular: string; plural: string }
	showFilters?: boolean
	/** When true, hide the sort control (dedicated popular/trending pages). */
	lockedSort?: boolean
}) {
	/* View stats and trending windows are request-time (live JSON + utc day). */
	await connection()
	const today = utcDayNow()

	const items: ArchiveItem[] =
		variant === "service" ? await serviceItems() : await tipItems()
	const store = await getPageViewStoreCached()
	const withStats = attachViewStats(items, store, variant, today)
	const ranked = lockedSort
		? sortArchiveItems(withStats, sort)
		: withStats

	return (
		<FilterableArchive
			allLabel={allLabel}
			emptyLabel={emptyLabel}
			items={ranked}
			lockedSort={lockedSort}
			noun={noun}
			pageSize={pageSize}
			showFilters={showFilters}
			showSort={!lockedSort}
			variant={variant}
		/>
	)
}
