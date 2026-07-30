import type { Metadata } from "next"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { RankedContentArchive } from "@/components/ranked-content-archive"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
	title: "Expert Plumbing & Septic Tips",
	description:
		"Practical plumbing and septic education for Santa Cruz County homeowners from Wade's licensed local team.",
	pathname: "/expert-tips",
	image: "/images/team/byron-working.webp",
	eyebrow: "Homeowner guides",
})

export default function ExpertTipsPage() {
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
				pageSize={9}
				variant="tip"
			/>

			<ContactCta title="Have a plumbing or septic question?" />
		</main>
	)
}
