import type { Metadata } from "next"
import { cacheLife, cacheTag } from "next/cache"
import { connection } from "next/server"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { ServiceLandingPage } from "@/components/service-landing-page"
import { getCollection, getDocument, type ContentDocument } from "@/lib/content"
import {
	getPageViewStoreCached,
	getStatsForSlug,
} from "@/lib/page-views"
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

async function getRelatedCached(service: ContentDocument) {
	"use cache"
	cacheTag("content:services", `content:services:${service.slug}`)
	cacheLife("max")

	return getRelatedForService(service)
}

async function RelatedServicePage({ service }: { service: ContentDocument }) {
	const related = await getRelatedCached(service)

	await connection()
	const today = utcDayNow()
	const store = await getPageViewStoreCached()
	const viewStats = getStatsForSlug(store, "service", service.slug, today)

	return (
		<ServiceLandingPage
			related={related}
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
