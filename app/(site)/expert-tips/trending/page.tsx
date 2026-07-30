import type { Metadata } from "next"
import type { Route } from "next"
import Link from "next/link"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { RankedContentArchive } from "@/components/ranked-content-archive"
import { buttonVariants } from "@/components/ui/button"
import { PAGE_VIEW_TREND_DAYS } from "@/lib/page-views/types"
import { buildPageMetadata } from "@/lib/seo"
import { cn } from "@/lib/utils"

export const metadata: Metadata = buildPageMetadata({
	title: "Trending Expert Tips",
	description:
		"Guides homeowners are reading most right now, ranked by unique views over the last week.",
	pathname: "/expert-tips/trending",
	image: "/images/team/byron-working.webp",
})

export default function TrendingTipsPage() {
	return (
		<main id="main-content">
			<ContentHero
				description={`Ranked by unique readers in the last ${PAGE_VIEW_TREND_DAYS} days. A fast way to see what neighbors are researching this week.`}
				eyebrow="Trending now"
				image="/images/team/byron-working.webp"
				imageAlt="Professional plumbing maintenance"
				indexKind="tip"
				parent={{ href: "/expert-tips" as Route, label: "Expert Tips" }}
				title="Trending Guides"
				variant="index"
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
						className={cn(buttonVariants({ size: "sm" }))}
						href={"/expert-tips/trending" as Route}
						prefetch
					>
						Trending now
					</Link>
					<Link
						className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
						href={"/expert-tips" as Route}
						prefetch
					>
						All guides
					</Link>
				</div>
			</section>

			<RankedContentArchive
				allLabel="Trending guides"
				emptyLabel="No guides in this category."
				lockedSort
				noun={{ singular: "guide", plural: "guides" }}
				pageSize={9}
				sort="trending"
				variant="tip"
			/>

			<ContactCta title="Have a plumbing or septic question?" />
		</main>
	)
}
