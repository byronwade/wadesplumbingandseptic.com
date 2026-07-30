import { FilterableArchive } from "@/components/filterable-archive"
import { toArchiveItem, type ArchiveItem } from "@/lib/archive"
import { getCollection } from "@/lib/content"
import {
	sortArchiveItems,
	type ArchiveSort,
} from "@/lib/page-views/ranking"
import { rankItemsWithLiveStats } from "@/lib/page-views/live"

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
	const items: ArchiveItem[] =
		variant === "service" ? await serviceItems() : await tipItems()
	const withStats = await rankItemsWithLiveStats(items, variant)
	const ranked = lockedSort ? sortArchiveItems(withStats, sort) : withStats

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
