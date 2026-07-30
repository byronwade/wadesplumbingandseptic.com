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
import {
	serviceCategories,
	serviceCategorySlugs,
	type ServiceCategorySlug,
} from "@/lib/service-categories"

export function generateStaticParams() {
	return serviceCategorySlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params
	const category = serviceCategories[slug as ServiceCategorySlug]

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
	const category = serviceCategories[slug as ServiceCategorySlug]

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
