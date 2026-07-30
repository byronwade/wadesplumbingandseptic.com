import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { GlossaryTermPage } from "@/components/glossary-term-page"
import { getDocument } from "@/lib/content"
import {
	getGlossaryTerm,
	getGlossaryTermSlugs,
	getGlossaryTerms,
} from "@/lib/glossary"
import { buildPageMetadata } from "@/lib/seo"

export async function generateStaticParams() {
	const slugs = await getGlossaryTermSlugs("plumbing")
	return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params
	const term = await getGlossaryTerm("plumbing", slug)
	if (!term) return {}

	return buildPageMetadata({
		title: `${term.term}: Plumbing Glossary`,
		description: term.shortDefinition,
		pathname: `/glossary/plumbing/${term.slug}`,
		image: "/images/work/precision-valve-installation.webp",
	})
}

export default async function PlumbingGlossaryTermRoute({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const [term, allTerms] = await Promise.all([
		getGlossaryTerm("plumbing", slug),
		getGlossaryTerms("plumbing"),
	])

	if (!term) notFound()

	const relatedTerms = term.relatedTermSlugs
		.map((relatedSlug) => allTerms.find((item) => item.slug === relatedSlug))
		.filter((item): item is NonNullable<typeof item> => Boolean(item))

	const relatedServices = (
		await Promise.all(
			term.relatedServiceSlugs.map(async (serviceSlug) => {
				const service = await getDocument("services", serviceSlug)
				return service
					? { slug: service.slug, title: service.title }
					: null
			}),
		)
	).filter((item): item is NonNullable<typeof item> => Boolean(item))

	return (
		<GlossaryTermPage
			relatedServices={relatedServices}
			relatedTerms={relatedTerms}
			term={term}
			topic="plumbing"
		/>
	)
}
