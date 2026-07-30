import type { ArchiveItem } from "@/lib/archive"
import { pageViewKey } from "@/lib/page-views/keys"
import { statsForKey } from "@/lib/page-views/stats"
import type {
	PageViewKind,
	PageViewStore,
} from "@/lib/page-views/types"

export type ArchiveSort = "default" | "popular" | "trending" | "newest"

export type RankedArchiveItem = ArchiveItem & {
	uniqueViews: number
	totalViews: number
	trendingScore: number
}

export function attachViewStats(
	items: ArchiveItem[],
	store: PageViewStore,
	kind: PageViewKind,
	today: string,
): RankedArchiveItem[] {
	return items.map((item) => {
		const stats = statsForKey(store, pageViewKey(kind, item.slug), today)
		return {
			...item,
			uniqueViews: stats.unique,
			totalViews: stats.views,
			trendingScore: stats.trending,
		}
	})
}

export function sortArchiveItems(
	items: RankedArchiveItem[],
	sort: ArchiveSort,
): RankedArchiveItem[] {
	const copy = [...items]

	switch (sort) {
		case "popular":
			return copy.sort(
				(a, b) =>
					b.uniqueViews - a.uniqueViews ||
					b.totalViews - a.totalViews ||
					a.title.localeCompare(b.title),
			)
		case "trending":
			return copy.sort(
				(a, b) =>
					b.trendingScore - a.trendingScore ||
					b.uniqueViews - a.uniqueViews ||
					a.title.localeCompare(b.title),
			)
		case "newest":
			return copy.sort((a, b) => {
				const dateDelta = String(b.date ?? "").localeCompare(
					String(a.date ?? ""),
				)
				if (dateDelta !== 0) return dateDelta
				return a.title.localeCompare(b.title)
			})
		default:
			return copy
	}
}

export function parseArchiveSort(
	value: string | null | undefined,
): ArchiveSort {
	if (
		value === "popular" ||
		value === "trending" ||
		value === "newest" ||
		value === "default"
	) {
		return value
	}
	return "default"
}
