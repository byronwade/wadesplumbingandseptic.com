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
				indexKind="service"
				parent={{ href: "/services" as Route, label: "Services" }}
				title="Most Popular Services"
				variant="index"
			/>

			<section className="container-shell pt-[var(--space-block)]">
				<div className="flex flex-wrap gap-2">
					<Link prefetch={false}
						className={cn(buttonVariants({ size: "sm" }))}
						href={"/services/popular" as Route}

					>
						Most popular
					</Link>
					<Link prefetch={false}
						className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
						href={"/services/trending" as Route}

					>
						Trending now
					</Link>
					<Link prefetch={false}
						className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
						href={"/services" as Route}

					>
						All services
					</Link>
				</div>
			</section>

			<RankedContentArchive
				allLabel="Most popular services"
				emptyLabel="No services in this category."
				lockedSort
				noun={{ singular: "service", plural: "services" }}
				pageSize={12}
				sort="popular"
				variant="service"
			/>

			<ContactCta title="Looking for a specific repair?" />
		</main>
	)
}
