import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ArticleArchive } from "@/components/article-archive"
import { getCollection, taxonomySlug } from "@/lib/content"

export function generateStaticParams() {
	const slugs = getCollection("posts").flatMap(
		(post) => post.tags?.map(taxonomySlug) ?? [],
	)

	return [...new Set(slugs)].map((slug) => ({ slug }))
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params
	const posts = getCollection("posts").filter((post) =>
		post.tags?.some((tag) => taxonomySlug(tag) === slug),
	)

	if (!posts.length) return {}

	return {
		title: `${posts[0].tags?.find((tag) => taxonomySlug(tag) === slug)} Guides`,
		description: `Wade's plumbing and septic articles about ${slug.replaceAll("-", " ")}.`,
		alternates: { canonical: `/tag/${slug}` },
	}
}

export default async function TagPage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const posts = getCollection("posts").filter((post) =>
		post.tags?.some((tag) => taxonomySlug(tag) === slug),
	)

	if (!posts.length) notFound()

	const label =
		posts[0].tags?.find((tag) => taxonomySlug(tag) === slug) ??
		slug.replaceAll("-", " ")

	return (
		<ArticleArchive
			description={`Helpful Wade's articles filed under ${label}.`}
			posts={posts}
			title={label}
		/>
	)
}
