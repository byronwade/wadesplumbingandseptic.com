import { Suspense } from "react"

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

async function RankedArchiveBody({
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

export function RankedContentArchive({
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
	/* Suspense is required for FilterableArchive's useSearchParams, but must
	   not wrap the page hero (empty-main shells broke mobile navigation). */
	return (
		<Suspense
			fallback={
				<section className="container-shell section-y">Loading…</section>
			}
		>
			<RankedArchiveBody
				allLabel={allLabel}
				emptyLabel={emptyLabel}
				lockedSort={lockedSort}
				noun={noun}
				pageSize={pageSize}
				showFilters={showFilters}
				sort={sort}
				variant={variant}
			/>
		</Suspense>
	)
}
