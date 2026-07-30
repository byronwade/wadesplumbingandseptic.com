import type { Metadata } from "next"
import type { Route } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { RankedContentArchive } from "@/components/ranked-content-archive"
import { buttonVariants } from "@/components/ui/button"
import { buildPageMetadata } from "@/lib/seo"
import { cn } from "@/lib/utils"

export const metadata: Metadata = buildPageMetadata({
	title: "Expert Plumbing & Septic Tips",
	description:
		"Practical plumbing and septic education for Santa Cruz County homeowners from Wade's licensed local team.",
	pathname: "/expert-tips",
	image: "/images/team/byron-working.webp",
})

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

			<section className="container-shell pt-[var(--space-block)]">
				<div className="flex flex-wrap gap-2">
					<Link
						className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
						href={"/expert-tips/popular" as Route}
						prefetch
					>
						Most popular
					</Link>
					<Link
						className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
						href={"/expert-tips/trending" as Route}
						prefetch
					>
						Trending now
					</Link>
				</div>
			</section>

			<Suspense
				fallback={
					<section className="container-shell section-y">
						Loading guides…
					</section>
				}
			>
				<RankedContentArchive
					allLabel="All guides"
					emptyLabel="No guides in this category."
					noun={{ singular: "guide", plural: "guides" }}
					pageSize={9}
					variant="tip"
				/>
			</Suspense>

			<ContactCta title="Have a plumbing or septic question?" />
		</main>
	)
}
