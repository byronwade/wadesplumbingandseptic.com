import { connection } from "next/server"
import { Suspense } from "react"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { FilterableArchive } from "@/components/filterable-archive"
import { RelatedContentSections } from "@/components/related-content"
import { toArchiveItem } from "@/lib/archive"
import type { ContentDocument } from "@/lib/content"
import { getPageViewStoreCached } from "@/lib/page-views"
import { withRelatedViewStats } from "@/lib/page-views/attach-related"
import { attachViewStats } from "@/lib/page-views/ranking"
import { utcDayNow } from "@/lib/page-views/stats"
import type { RelatedContent } from "@/lib/related-content"

async function RankedArticleArchive({
	title,
	posts,
}: {
	title: string
	posts: ContentDocument[]
}) {
	await connection()
	const today = utcDayNow()
	const store = await getPageViewStoreCached()
	const items = attachViewStats(
		posts.map((post) =>
			toArchiveItem(post, `/${post.slug}`, post.category ?? "Expert Tips"),
		),
		store,
		"tip",
		today,
	)

	return (
		<FilterableArchive
			allLabel={title}
			emptyLabel="No guides in this category."
			items={items}
			noun={{ singular: "guide", plural: "guides" }}
			pageSize={9}
			showFilters={false}
			variant="tip"
		/>
	)
}

export async function ArticleArchive({
	title,
	description,
	posts,
	related,
}: {
	title: string
	description: string
	posts: ContentDocument[]
	related?: RelatedContent
}) {
	const relatedWithStats = related
		? await withRelatedViewStats(related)
		: undefined

	return (
		<main id="main-content">
			<ContentHero
				description={description}
				eyebrow={`${posts.length} homeowner guides`}
				image="/images/team/byron-working.webp"
				imageAlt="Wade's field experience"
				parent={{ href: "/expert-tips", label: "Expert Tips" }}
				title={title}
			/>
			<Suspense
				fallback={
					<section className="container-shell section-y">
						Loading guides…
					</section>
				}
			>
				<RankedArticleArchive posts={posts} title={title} />
			</Suspense>
			{relatedWithStats ? (
				<RelatedContentSections
					postsTitle="More related guides"
					related={relatedWithStats}
					servicesTitle="Related services"
				/>
			) : null}
			<ContactCta title="Need professional help?" />
		</main>
	)
}
