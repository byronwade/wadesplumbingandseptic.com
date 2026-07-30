import type { Metadata } from "next"
import { connection } from "next/server"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { ServiceLandingPage } from "@/components/service-landing-page"
import { getCollection, getDocument } from "@/lib/content"
import {
	getPageViewStoreCached,
	getStatsForSlug,
} from "@/lib/page-views"
import { withRelatedViewStats } from "@/lib/page-views/attach-related"
import { utcDayNow } from "@/lib/page-views/stats"
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
	})
}

async function RelatedServicePage({
	service,
}: {
	service: NonNullable<Awaited<ReturnType<typeof getDocument>>>
}) {
	await connection()
	const today = utcDayNow()
	const [related, store] = await Promise.all([
		getRelatedForService(service),
		getPageViewStoreCached(),
	])
	const viewStats = getStatsForSlug(store, "service", service.slug, today)
	const relatedWithStats = await withRelatedViewStats(related)
	return (
		<ServiceLandingPage
			related={relatedWithStats}
			service={service}
			viewStats={viewStats}
		/>
	)
}

export default async function ServiceOfferingPage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const service = await getDocument("services", slug)

	if (!service) notFound()

	return (
		<Suspense fallback={<main id="main-content" className="min-h-[50vh]" />}>
			<RelatedServicePage service={service} />
		</Suspense>
	)
}
