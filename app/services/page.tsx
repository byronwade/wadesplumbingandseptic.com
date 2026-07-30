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
	title: "Plumbing & Septic Services",
	description:
		"Browse residential plumbing, commercial plumbing, and septic services across Santa Cruz County and selected Santa Clara County communities.",
	pathname: "/services",
	image: "/images/work/commercial-plumbing-installation.webp",
})

export default function ServicesPage() {
	return (
		<main id="main-content">
			<ContentHero
				description="Browse residential plumbing, commercial plumbing, and septic services across Santa Cruz County and selected Santa Clara County communities."
				eyebrow="Browse Services"
				image="/images/work/commercial-plumbing-installation.webp"
				imageAlt="Professional plumbing installation"
				title="All Plumbing & Septic Services"
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
						className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
						href={"/services/trending" as Route}
						prefetch
					>
						Trending now
					</Link>
				</div>
			</section>

			<Suspense
				fallback={
					<div className="container-shell section-y">Loading services…</div>
				}
			>
				<RankedContentArchive
					allLabel="All services"
					emptyLabel="No services in this category."
					noun={{ singular: "service", plural: "services" }}
					pageSize={12}
					variant="service"
				/>
			</Suspense>

			<ContactCta
				description="Call or message us. We will diagnose the problem and point you to the right service with no pressure."
				title="Not sure which service you need?"
			/>
		</main>
	)
}
