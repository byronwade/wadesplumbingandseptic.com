import { Suspense } from "react"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { FilterableArchive } from "@/components/filterable-archive"
import { toArchiveItem } from "@/lib/archive"
import type { ContentDocument } from "@/lib/content"

export function ArticleArchive({
	title,
	description,
	posts,
}: {
	title: string
	description: string
	posts: ContentDocument[]
}) {
	const items = posts.map((post) =>
		toArchiveItem(post, `/${post.slug}`, post.category ?? "Expert Tips"),
	)

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
				<FilterableArchive
					allLabel={title}
					emptyLabel="No guides in this category."
					items={items}
					noun={{ singular: "guide", plural: "guides" }}
					pageSize={9}
					showFilters={false}
					variant="tip"
				/>
			</Suspense>
			<ContactCta title="Need professional help?" />
		</main>
	)
}
