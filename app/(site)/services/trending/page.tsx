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
	title: "Trending Plumbing & Septic Services",
	description:
		"Services gaining the most unique interest over the last week from Santa Cruz County homeowners.",
	pathname: "/services/trending",
	image: "/images/work/commercial-plumbing-installation.webp",
})

export default function TrendingServicesPage() {
	return (
		<main id="main-content">
			<ContentHero
				description={`Ranked by unique viewers in the last ${PAGE_VIEW_TREND_DAYS} days. Useful when seasonal issues start stacking up.`}
				eyebrow="Trending now"
				image="/images/work/drain-cleaning-equipment.webp"
				imageAlt="Drain cleaning equipment on a job site"
				indexKind="service"
				parent={{ href: "/services" as Route, label: "Services" }}
				title="Trending Services"
				variant="index"
			/>

			<section className="container-shell pt-[var(--space-block)]">
				<div className="flex flex-wrap gap-2">
					<Link
						className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
						href={"/services/popular" as Route}
						prefetch
					>
						Most popular
					</Link>
					<Link
						className={cn(buttonVariants({ size: "sm" }))}
						href={"/services/trending" as Route}
						prefetch
					>
						Trending now
					</Link>
					<Link
						className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
						href={"/services" as Route}
						prefetch
					>
						All services
					</Link>
				</div>
			</section>

			<RankedContentArchive
				allLabel="Trending services"
				emptyLabel="No services in this category."
				lockedSort
				noun={{ singular: "service", plural: "services" }}
				pageSize={12}
				sort="trending"
				variant="service"
			/>

			<ContactCta title="Seeing the same problem at your place?" />
		</main>
	)
}
