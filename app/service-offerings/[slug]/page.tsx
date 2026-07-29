import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ServiceLandingPage } from "@/components/service-landing-page"
import { getCollection, getDocument } from "@/lib/content"
import { getServiceImage } from "@/lib/service-images"

export function generateStaticParams() {
	return getCollection("services").map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params
	const service = getDocument("services", slug)

	if (!service) return {}

	return {
		title: service.title,
		description: service.description,
		alternates: { canonical: `/service-offerings/${service.slug}` },
		openGraph: {
			title: service.title,
			description: service.description,
			images: [getServiceImage(service.category, service.image)],
		},
	}
}

export default async function ServiceOfferingPage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const service = getDocument("services", slug)

	if (!service) notFound()

	return <ServiceLandingPage service={service} />
}
