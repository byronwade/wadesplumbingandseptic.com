import "server-only"

import { connection } from "next/server"

import type { RelatedContent } from "@/lib/related-content"
import {
	attachViewStats,
	getPageViewStoreCached,
} from "@/lib/page-views"
import { utcDayNow } from "@/lib/page-views/stats"

/** Attach live view stats to related rails (services + tips). Request-time only. */
export async function withRelatedViewStats(
	related: RelatedContent,
): Promise<RelatedContent> {
	await connection()
	const store = await getPageViewStoreCached()
	const today = utcDayNow()
	return {
		services: attachViewStats(related.services, store, "service", today),
		posts: attachViewStats(related.posts, store, "tip", today),
	}
}
