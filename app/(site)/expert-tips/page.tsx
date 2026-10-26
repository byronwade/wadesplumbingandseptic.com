import type { Metadata } from "next"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { RankedContentArchive } from "@/components/ranked-content-archive"
import { JsonLd } from "@/components/json-ld"
import { getCollection } from "@/lib/content"
import {
	breadcrumbJsonLd,
	buildPageMetadata,
	collectionPageJsonLd,
} from "@/lib/seo"

const description =
	"Practical plumbing and septic education for Santa Cruz County homeowners from Wade's licensed local team."

export const metadata: Metadata = buildPageMetadata({
	title: "Expert Plumbing & Septic Tips",
	description,
	pathname: "/expert-tips",
	image: "/images/team/byron-working.webp",
	eyebrow: "Homeowner guides",
})

export default async function ExpertTipsPage() {
	const items = await getCollection("posts")

	return (
		<main id="main-content">
			<ContentHero
				description="Practical plumbing and septic education from the people doing the work. Straight answers, useful maintenance guidance, and local insight."
				eyebrow="Homeowner guides"
				image="/images/team/byron-working.webp"
				imageAlt="Professional plumbing maintenance"
				indexKind="tip"
				title="Expert Tips"
				variant="index"
			/>

			<RankedContentArchive
				allLabel="All guides"
				emptyLabel="No guides in this category."
				noun={{ singular: "guide", plural: "guides" }}
				pageSize={10}
				variant="tip"
			/>

			<ContactCta title="Have a plumbing or septic question?" />
			<JsonLd
				data={[
					collectionPageJsonLd({
						name: "Expert Plumbing & Septic Tips",
						description,
						pathname: "/expert-tips",
						items: items.map((item) => ({
							name: item.title,
							path: `/${item.slug}`,
						})),
					}),
					breadcrumbJsonLd([
						{ name: "Home", path: "/" },
						{ name: "Expert Tips", path: "/expert-tips" },
					]),
				]}
			/>
		</main>
	)
}
