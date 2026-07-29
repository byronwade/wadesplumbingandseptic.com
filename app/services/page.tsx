import type { Metadata } from "next"
import { Suspense } from "react"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { FilterableArchive } from "@/components/filterable-archive"
import { toArchiveItem } from "@/lib/archive"
import { getCollection } from "@/lib/content"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
	title: "Plumbing & Septic Services",
	description:
		"Browse residential plumbing, commercial plumbing, and septic services across Santa Cruz County, selected Santa Clara County communities, and Pickens County, Georgia.",
	pathname: "/services",
	image: "/images/work/commercial-plumbing-installation.webp",
})

async function ServiceDirectory() {
	"use cache"

	const services = await getCollection("services")
	const items = services.map((service) =>
		toArchiveItem(
			service,
			`/service-offerings/${service.slug}`,
			service.category ?? "Plumbing",
		),
	)

	return (
		<FilterableArchive
			allLabel="All services"
			emptyLabel="No services in this category."
			items={items}
			noun={{ singular: "service", plural: "services" }}
			pageSize={12}
			variant="service"
		/>
	)
}

export default function ServicesPage() {
	return (
		<main id="main-content">
			<ContentHero
				description="Browse residential plumbing, commercial plumbing, and septic services across Santa Cruz County, selected Santa Clara County communities, and Pickens County, Georgia."
				eyebrow="Browse Services"
				image="/images/work/commercial-plumbing-installation.webp"
				imageAlt="Professional plumbing installation"
				title="All Plumbing & Septic Services"
			/>

			<Suspense
				fallback={
					<div className="container-shell section-y">Loading services…</div>
				}
			>
				<ServiceDirectory />
			</Suspense>

			<ContactCta
				description="Call or message us. We will diagnose the problem and point you to the right service with no pressure."
				title="Not sure which service you need?"
			/>
		</main>
	)
}
