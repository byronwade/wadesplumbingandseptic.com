import type { Metadata } from "next"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { RankedContentArchive } from "@/components/ranked-content-archive"
import { buildPageMetadata } from "@/lib/seo"

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
				description="Residential plumbing, commercial plumbing, and septic work across Santa Cruz County and selected Santa Clara County communities."
				eyebrow="What we do"
				image="/images/work/commercial-plumbing-installation.webp"
				imageAlt="Professional plumbing installation"
				indexKind="service"
				title="Plumbing & Septic Services"
				variant="index"
			/>

			<RankedContentArchive
				allLabel="All services"
				emptyLabel="No services in this category."
				noun={{ singular: "service", plural: "services" }}
				pageSize={12}
				variant="service"
			/>

			<ContactCta
				description="Call or message us. We will diagnose the problem and point you to the right service with no pressure."
				title="Not sure which service you need?"
			/>
		</main>
	)
}
