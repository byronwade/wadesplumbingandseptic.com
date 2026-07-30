import "server-only"

import type { RelatedContent } from "@/lib/related-content"
import { withRelatedViewStatsCached } from "@/lib/page-views/live"

/** Attach live view stats to related rails (services + tips). */
export async function withRelatedViewStats(
	related: RelatedContent,
): Promise<RelatedContent> {
	return withRelatedViewStatsCached(related)
}
