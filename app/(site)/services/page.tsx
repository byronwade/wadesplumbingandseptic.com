import type { Metadata } from "next"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { RankedContentArchive } from "@/components/ranked-content-archive"
import { JsonLd } from "@/components/json-ld"
import { getCollection } from "@/lib/content"
import {
	breadcrumbJsonLd,
	buildPageMetadata,
	collectionPageJsonLd,
} from "@/lib/seo"

const description =
	"Browse residential plumbing, commercial plumbing, and septic services across Santa Cruz County and selected Santa Clara County communities."

export const metadata: Metadata = buildPageMetadata({
	title: "Plumbing & Septic Services",
	description,
	pathname: "/services",
	image: "/images/work/commercial-plumbing-installation.webp",
	eyebrow: "What we do",
})

export default async function ServicesPage() {
	const items = await getCollection("services")

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
			<JsonLd
				data={[
					collectionPageJsonLd({
						name: "Plumbing & Septic Services",
						description,
						pathname: "/services",
						items: items.map((item) => ({
							name: item.title,
							path: `/service-offerings/${item.slug}`,
						})),
					}),
					breadcrumbJsonLd([
						{ name: "Home", path: "/" },
						{ name: "Services", path: "/services" },
					]),
				]}
			/>
		</main>
	)
}
