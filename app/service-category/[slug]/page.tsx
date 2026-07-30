import type { Metadata } from "next"
import { cacheLife, cacheTag } from "next/cache"
import { notFound } from "next/navigation"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { FilterableArchive } from "@/components/filterable-archive"
import { RelatedContentSectionsWithStats } from "@/components/related-content-with-stats"
import { toArchiveItem } from "@/lib/archive"
import { getCollection, type ContentDocument } from "@/lib/content"
import { rankItemsWithLiveStats } from "@/lib/page-views/live"
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

async function getServiceCategoryData(slug: ServiceCategorySlug) {
	"use cache"
	cacheTag("content:services", `content:service-category:${slug}`)
	cacheLife("max")

	const category = serviceCategories[slug]
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

	return { category, services, related }
}

async function RankedCategoryArchive({
	label,
	contentCategory,
	services,
}: {
	label: string
	contentCategory: string
	services: ContentDocument[]
}) {
	const items = await rankItemsWithLiveStats(
		services.map((service) =>
			toArchiveItem(
				service,
				`/service-offerings/${service.slug}`,
				service.category ?? contentCategory,
			),
		),
		"service",
	)

	return (
		<FilterableArchive
			allLabel={`${label} services`}
			emptyLabel="No services in this category."
			items={items}
			noun={{ singular: "service", plural: "services" }}
			pageSize={12}
			showFilters={false}
			variant="service"
		/>
	)
}

export default async function ServiceCategoryPage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const category = serviceCategories[slug as ServiceCategorySlug]

	if (!category) notFound()

	const data = await getServiceCategoryData(slug as ServiceCategorySlug)

	return (
		<main id="main-content">
			<ContentHero
				description={data.category.description}
				eyebrow={`${data.services.length} services`}
				image={data.category.image}
				imageAlt={data.category.label}
				parent={{ href: "/services", label: "Services" }}
				title={`${data.category.label} Services`}
			/>
			<RankedCategoryArchive
				contentCategory={data.category.contentCategory}
				label={data.category.label}
				services={data.services}
			/>
			<RelatedContentSectionsWithStats
				postsTitle="Related expert tips"
				related={data.related}
				servicesTitle="Related services"
			/>
			<ContactCta />
		</main>
	)
}
