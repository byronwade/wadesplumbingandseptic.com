import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { ServiceCard } from "@/components/service-card"
import { getCollection } from "@/lib/content"
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
			"Complete plumbing service for homes, including repairs, replacements, maintenance, and emergency response.",
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
		label: "Emergency Services",
		contentCategory: "Plumbing",
		description:
			"Call-first support for active leaks, burst pipes, sewer backups, failed water heaters, and urgent plumbing problems.",
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
				<section className="container-shell section-y grid gap-5 md:grid-cols-2 lg:grid-cols-3">
					{services.map((service) => (
						<ServiceCard key={service.slug} service={service} />
					))}
				</section>
			</Suspense>
			<ContactCta />
		</main>
	)
}
