import { RelatedContentSections } from "@/components/related-content"
import { withRelatedViewStats } from "@/lib/page-views/attach-related"
import type { RelatedContent } from "@/lib/related-content"

/**
 * Related rails with minute-cached view stats.
 * Stats refresh via cacheLife("minutes") without opting the page into
 * request-time `connection()` (which broke mobile RSC navigations).
 */
export async function RelatedContentSectionsWithStats({
	related,
	servicesTitle,
	postsTitle,
}: {
	related: RelatedContent
	servicesTitle?: string
	postsTitle?: string
}) {
	const relatedWithStats = await withRelatedViewStats(related)
	return (
		<RelatedContentSections
			postsTitle={postsTitle}
			related={relatedWithStats}
			servicesTitle={servicesTitle}
		/>
	)
}
