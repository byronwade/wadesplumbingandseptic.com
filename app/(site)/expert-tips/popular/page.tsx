import type { Metadata } from "next"
import type { Route } from "next"
import Link from "next/link"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { RankedContentArchive } from "@/components/ranked-content-archive"
import { buttonVariants } from "@/components/ui/button"
import { buildPageMetadata } from "@/lib/seo"
import { cn } from "@/lib/utils"

export const metadata: Metadata = buildPageMetadata({
	title: "Most Popular Expert Tips",
	description:
		"Homeowner guides with the most unique readers from Wade's plumbing and septic library.",
	pathname: "/expert-tips/popular",
	image: "/images/team/byron-working.webp",
})

export default function PopularTipsPage() {
	return (
		<main id="main-content">
			<ContentHero
				description="Ranked by unique readers. Each browser counts once, so the list reflects real interest rather than refresh spam."
				eyebrow="Most popular"
				image="/images/team/byron-working.webp"
				imageAlt="Professional plumbing maintenance"
				indexKind="tip"
				parent={{ href: "/expert-tips" as Route, label: "Expert Tips" }}
				title="Most Popular Guides"
				variant="index"
			/>

			<section className="container-shell pt-[var(--space-block)]">
				<div className="flex flex-wrap gap-2">
					<Link prefetch={false}
						className={cn(buttonVariants({ size: "sm" }))}
						href={"/expert-tips/popular" as Route}

					>
						Most popular
					</Link>
					<Link prefetch={false}
						className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
						href={"/expert-tips/trending" as Route}

					>
						Trending now
					</Link>
					<Link prefetch={false}
						className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
						href={"/expert-tips" as Route}

					>
						All guides
					</Link>
				</div>
			</section>

			<RankedContentArchive
				allLabel="Most popular guides"
				emptyLabel="No guides in this category."
				lockedSort
				noun={{ singular: "guide", plural: "guides" }}
				pageSize={9}
				sort="popular"
				variant="tip"
			/>

			<ContactCta title="Have a plumbing or septic question?" />
		</main>
	)
}
