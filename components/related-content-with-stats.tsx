import { Suspense } from "react"

import { RelatedContentSections } from "@/components/related-content"
import { withRelatedViewStats } from "@/lib/page-views/attach-related"
import type { RelatedContent } from "@/lib/related-content"

async function RelatedContentSectionsLive({
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

/**
 * Prerender related rails without live view stats, then upgrade at request time.
 * Keeps Cache Components happy: utcDayNow() must not run during static prerender.
 */
export function RelatedContentSectionsWithStats({
	related,
	servicesTitle,
	postsTitle,
}: {
	related: RelatedContent
	servicesTitle?: string
	postsTitle?: string
}) {
	return (
		<Suspense
			fallback={
				<RelatedContentSections
					postsTitle={postsTitle}
					related={related}
					servicesTitle={servicesTitle}
				/>
			}
		>
			<RelatedContentSectionsLive
				postsTitle={postsTitle}
				related={related}
				servicesTitle={servicesTitle}
			/>
		</Suspense>
	)
}
