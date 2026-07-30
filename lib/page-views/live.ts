import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import type { ArchiveItem } from "@/lib/archive"
import {
	attachViewStats,
	getPageViewStoreCached,
	getStatsForSlug,
	type RankedArchiveItem,
} from "@/lib/page-views"
import { utcDayNow } from "@/lib/page-views/stats"
import type { PageViewKind, PageViewStats } from "@/lib/page-views/types"
import type { RelatedContent } from "@/lib/related-content"

/**
 * Live view stats without `connection()`.
 *
 * `utcDayNow()` is closed over inside `"use cache"` + `cacheLife("minutes")`,
 * so pages stay fully prerenderable. Putting `connection()` around whole page
 * trees produced truncated HTML shells (no Flight payload) and React #412
 * "Connection closed" on mobile navigations.
 */
export async function getLiveViewStats(
	kind: PageViewKind,
	slug: string,
): Promise<PageViewStats> {
	"use cache"
	cacheTag("page-views")
	cacheLife("minutes")

	const today = utcDayNow()
	const store = await getPageViewStoreCached()
	return getStatsForSlug(store, kind, slug, today)
}

export async function rankItemsWithLiveStats(
	items: ArchiveItem[],
	kind: PageViewKind,
): Promise<RankedArchiveItem[]> {
	"use cache"
	cacheTag("page-views")
	cacheLife("minutes")

	const today = utcDayNow()
	const store = await getPageViewStoreCached()
	return attachViewStats(items, store, kind, today)
}

export async function withRelatedViewStatsCached(
	related: RelatedContent,
): Promise<RelatedContent> {
	"use cache"
	cacheTag("page-views")
	cacheLife("minutes")

	const today = utcDayNow()
	const store = await getPageViewStoreCached()
	return {
		services: attachViewStats(related.services, store, "service", today),
		posts: attachViewStats(related.posts, store, "tip", today),
	}
}
