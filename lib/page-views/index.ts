import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import { pageViewKey } from "@/lib/page-views/keys"
import {
	attachViewStats,
	parseArchiveSort,
	sortArchiveItems,
	type ArchiveSort,
	type RankedArchiveItem,
} from "@/lib/page-views/ranking"
import { readPageViewStore } from "@/lib/page-views/store"
import { statsForKey } from "@/lib/page-views/stats"
import type {
	PageViewKind,
	PageViewStats,
	PageViewStore,
} from "@/lib/page-views/types"

export async function getPageViewStoreCached(): Promise<PageViewStore> {
	"use cache"
	cacheTag("page-views")
	cacheLife("minutes")
	return readPageViewStore()
}

export function getStatsForSlug(
	store: PageViewStore,
	kind: PageViewKind,
	slug: string,
	today: string,
): PageViewStats {
	return statsForKey(store, pageViewKey(kind, slug), today)
}

export {
	attachViewStats,
	parseArchiveSort,
	sortArchiveItems,
	type ArchiveSort,
	type RankedArchiveItem,
}
export {
	pageViewKey,
	pageViewCookieToken,
	parsePageViewKey,
} from "@/lib/page-views/keys"
export { incrementPageView, readPageViewStore } from "@/lib/page-views/store"
export type {
	PageViewKind,
	PageViewStats,
	PageViewStore,
} from "@/lib/page-views/types"
export {
	PAGE_VIEW_TREND_DAYS,
	PAGE_VIEW_COOKIE_NAME,
} from "@/lib/page-views/types"
