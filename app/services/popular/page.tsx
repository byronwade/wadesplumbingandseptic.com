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
	title: "Most Popular Plumbing & Septic Services",
	description:
		"Services with the most unique page views from homeowners researching plumbing and septic work with Wade's.",
	pathname: "/services/popular",
	image: "/images/work/commercial-plumbing-installation.webp",
})

export default function PopularServicesPage() {
	return (
		<main id="main-content">
			<ContentHero
				description="Ranked by unique visitors. One view per browser, so return visits do not inflate the list."
				eyebrow="Most popular"
				image="/images/work/commercial-plumbing-installation.webp"
				imageAlt="Professional plumbing installation"
				parent={{ href: "/services" as Route, label: "Services" }}
				title="Most Popular Services"
			/>

			<section className="container-shell pt-[var(--space-block)]">
				<div className="flex flex-wrap gap-2">
					<Link
						className={cn(buttonVariants({ size: "sm" }))}
						href={"/services/popular" as Route}
						prefetch
					>
						Most popular
					</Link>
					<Link
						className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
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

			<Suspense
				fallback={
					<div className="container-shell section-y">Loading services…</div>
				}
			>
				<RankedContentArchive
					allLabel="Most popular services"
					emptyLabel="No services in this category."
					lockedSort
					noun={{ singular: "service", plural: "services" }}
					pageSize={12}
					sort="popular"
					variant="service"
				/>
			</Suspense>

			<ContactCta title="Looking for a specific repair?" />
		</main>
	)
}
