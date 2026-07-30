import "server-only"

import type { RelatedContent } from "@/lib/related-content"
import {
	attachViewStats,
	getPageViewStoreCached,
} from "@/lib/page-views"
import { utcDayNow } from "@/lib/page-views/stats"

/** Attach live view stats to related rails (services + tips). */
export async function withRelatedViewStats(
	related: RelatedContent,
): Promise<RelatedContent> {
	const store = await getPageViewStoreCached()
	const today = utcDayNow()
	return {
		services: attachViewStats(related.services, store, "service", today),
		posts: attachViewStats(related.posts, store, "tip", today),
	}
}
