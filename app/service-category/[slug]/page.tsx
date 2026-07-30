import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { FilterableArchive } from "@/components/filterable-archive"
import { RelatedContentSections } from "@/components/related-content"
import { toArchiveItem } from "@/lib/archive"
import { getCollection } from "@/lib/content"
import { getRelatedForTopic } from "@/lib/related-content"
import { buildPageMetadata } from "@/lib/seo"

const categories = {
	plumbing: {
		label: "Plumbing",
		contentCategory: "Plumbing",
		description:
			"Residential plumbing repairs, drains, water heaters, fixtures, piping, sewers, and specialty diagnostics.",
		image: "/images/work/precision-valve-installation.webp",
	},
	"residential-plumbing": {
		label: "Residential Plumbing",
		contentCategory: "Plumbing",
		description:
			"Complete plumbing service for homes, including repairs, replacements, maintenance, and urgent repairs.",
		image: "/images/services/drain-clearing.webp",
	},
	commercial: {
		label: "Commercial",
		contentCategory: "Commercial",
		description:
			"Commercial repairs, maintenance, drains, grease traps, backflow devices, water heaters, and septic support.",
		image: "/images/services/commercial-plumbing.webp",
	},
	"commercial-plumbing": {
		label: "Commercial Plumbing",
		contentCategory: "Commercial",
		description:
			"Professional plumbing service that helps businesses minimize downtime and maintain safe, code-compliant systems.",
		image: "/images/work/commercial-plumbing-installation.webp",
	},
	septic: {
		label: "Septic",
		contentCategory: "Septic",
		description:
			"Septic inspections, diagnostics, repairs, maintenance, permitting, installation, and engineered treatment systems.",
		image: "/images/work/engineered-septic-hero.webp",
	},
	"septic-services": {
		label: "Septic Services",
		contentCategory: "Septic",
		description:
			"Complete conventional and advanced septic support for tanks, pumps, controls, treatment, and drain fields.",
		image: "/images/work/completed-multi-tank.webp",
	},
	"emergency-services": {
		label: "Urgent Repairs",
		contentCategory: "Plumbing",
		description:
			"Call-first support during business hours for active leaks, burst pipes, sewer backups, failed water heaters, and other time-sensitive plumbing problems.",
		image: "/images/work/drain-cleaning-equipment.webp",
	},
	"specialty-services": {
		label: "Specialty Services",
		contentCategory: "Plumbing",
		description:
			"Advanced inspection, hydro jetting, trenchless work, smoke testing, water treatment, and difficult plumbing diagnostics.",
		image: "/images/work/new-construction-rough-in.webp",
	},
} as const

export function generateStaticParams() {
	return Object.keys(categories).map((slug) => ({ slug }))
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params
	const category = categories[slug as keyof typeof categories]

	if (!category) return {}

	return buildPageMetadata({
		title: `${category.label} Services`,
		description: category.description,
		pathname: `/service-category/${slug}`,
		image: category.image,
	})
}

export default async function ServiceCategoryPage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const category = categories[slug as keyof typeof categories]

	if (!category) notFound()

	const services = (await getCollection("services")).filter(
		(service) => service.category === category.contentCategory,
	)
	const related = await getRelatedForTopic(
		{
			label: category.label,
			description: category.description,
			categories: [category.contentCategory],
			keywords: [
				category.label,
				category.contentCategory,
				slug.replaceAll("-", " "),
			],
			excludeSlugs: services.map((service) => service.slug),
		},
		{ posts: 3, services: 3 },
	)

	return (
		<main id="main-content">
			<ContentHero
				description={category.description}
				eyebrow={`${services.length} services`}
				image={category.image}
				imageAlt={category.label}
				parent={{ href: "/services", label: "Services" }}
				title={`${category.label} Services`}
			/>
			<Suspense
				fallback={
					<section className="container-shell section-y">
						Loading services…
					</section>
				}
			>
				<FilterableArchive
					allLabel={`${category.label} services`}
					emptyLabel="No services in this category."
					items={services.map((service) =>
						toArchiveItem(
							service,
							`/service-offerings/${service.slug}`,
							service.category ?? category.contentCategory,
						),
					)}
					noun={{ singular: "service", plural: "services" }}
					pageSize={12}
					showFilters={false}
					variant="service"
				/>
			</Suspense>
			<RelatedContentSections
				postsTitle="Related expert tips"
				related={related}
				servicesTitle="Related services"
			/>
			<ContactCta />
		</main>
	)
}
