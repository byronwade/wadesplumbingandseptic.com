import type { Metadata } from "next"
import { cacheLife, cacheTag } from "next/cache"
import { notFound } from "next/navigation"

import { ServiceLandingPage } from "@/components/service-landing-page"
import { getCollection, getDocument, type ContentDocument } from "@/lib/content"
import { getLiveViewStats } from "@/lib/page-views/live"
import { getRelatedForService } from "@/lib/related-content"
import { getServiceImage } from "@/lib/service-images"
import { buildPageMetadata } from "@/lib/seo"

export async function generateStaticParams() {
	const services = await getCollection("services")
	return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params
	const service = await getDocument("services", slug)

	if (!service) return {}

	return buildPageMetadata({
		title: service.title,
		description: service.description,
		pathname: `/service-offerings/${service.slug}`,
		image: getServiceImage(service.category, service.image),
		eyebrow: service.category ?? "Service",
	})
}

async function getRelatedCached(service: ContentDocument) {
	"use cache"
	cacheTag("content:services", `content:services:${service.slug}`)
	cacheLife("max")

	return getRelatedForService(service)
}

export default async function ServiceOfferingPage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const service = await getDocument("services", slug)

	if (!service) notFound()

	const [related, viewStats] = await Promise.all([
		getRelatedCached(service),
		getLiveViewStats("service", service.slug),
	])

	return (
		<ServiceLandingPage
			related={related}
			service={service}
			viewStats={viewStats}
		/>
	)
}
