import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ArticleArchive } from "@/components/article-archive"
import { getCollection, taxonomySlug } from "@/lib/content"
import { getRelatedForTopic } from "@/lib/related-content"
import { buildPageMetadata } from "@/lib/seo"

export async function generateStaticParams() {
	const posts = await getCollection("posts")
	const slugs = posts.flatMap((post) => post.tags?.map(taxonomySlug) ?? [])

	return [...new Set(slugs)].map((slug) => ({ slug }))
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params
	const posts = await getCollection("posts")
	const matched = posts.filter((post) =>
		post.tags?.some((tag) => taxonomySlug(tag) === slug),
	)

	if (!matched.length) return {}

	const label =
		matched[0]?.tags?.find((tag) => taxonomySlug(tag) === slug) ??
		slug.replaceAll("-", " ")

	return buildPageMetadata({
		title: `${label} Guides`,
		description: `Wade's plumbing and septic articles about ${slug.replaceAll("-", " ")}.`,
		pathname: `/tag/${slug}`,
	})
}

export default async function TagPage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const posts = await getCollection("posts")
	const matched = posts.filter((post) =>
		post.tags?.some((tag) => taxonomySlug(tag) === slug),
	)

	if (!matched.length) notFound()

	const label =
		matched[0]?.tags?.find((tag) => taxonomySlug(tag) === slug) ??
		slug.replaceAll("-", " ")

	const related = await getRelatedForTopic(
		{
			label,
			description: `Helpful Wade's articles filed under ${label}.`,
			tags: [label],
			keywords: [label, slug.replaceAll("-", " ")],
			excludeSlugs: matched.map((post) => post.slug),
		},
		{ posts: 3, services: 3 },
	)

	return (
		<ArticleArchive
			description={`Helpful Wade's articles filed under ${label}.`}
			posts={matched}
			related={related}
			title={label}
		/>
	)
}
