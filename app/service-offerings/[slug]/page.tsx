import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { ServiceLandingPage } from "@/components/service-landing-page"
import { getCollection, getDocument } from "@/lib/content"
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
			<ServiceLandingPage service={service} />
		</Suspense>
	)
}
