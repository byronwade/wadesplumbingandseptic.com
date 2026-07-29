import type { Metadata } from "next"
import { Suspense } from "react"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { FilterableArchive } from "@/components/filterable-archive"
import { toArchiveItem } from "@/lib/archive"
import { getCollection } from "@/lib/content"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
	title: "Expert Plumbing & Septic Tips",
	description:
		"Practical plumbing and septic education for Santa Cruz County homeowners from Wade's licensed local team.",
	pathname: "/expert-tips",
	image: "/images/team/byron-working.webp",
})

async function TipsGrid() {
	"use cache"

	const posts = await getCollection("posts")
	const items = posts.map((post) =>
		toArchiveItem(post, `/${post.slug}`, post.category ?? "Expert Tips"),
	)

	return (
		<FilterableArchive
			allLabel="All guides"
			emptyLabel="No guides in this category."
			items={items}
			noun={{ singular: "guide", plural: "guides" }}
			pageSize={9}
			variant="tip"
		/>
	)
}

export default function ExpertTipsPage() {
	return (
		<main id="main-content">
			<ContentHero
				description="Practical plumbing and septic education from the people doing the work. Straight answers, useful maintenance guidance, and local insight."
				eyebrow="Homeowner Resources"
				image="/images/team/byron-working.webp"
				imageAlt="Professional plumbing maintenance"
				title="Expert Tips & Homeowner Guides"
			/>

			<Suspense
				fallback={
					<section className="container-shell section-y">
						Loading guides…
					</section>
				}
			>
				<TipsGrid />
			</Suspense>

			<ContactCta title="Have a plumbing or septic question?" />
		</main>
	)
}
