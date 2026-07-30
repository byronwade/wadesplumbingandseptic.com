import type { Metadata } from "next"
import { cacheLife, cacheTag } from "next/cache"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { ArticleArchive } from "@/components/article-archive"
import { getCollection, taxonomySlug } from "@/lib/content"
import { getRelatedForTopic } from "@/lib/related-content"
import { buildPageMetadata } from "@/lib/seo"

export async function generateStaticParams() {
	const posts = await getCollection("posts")
	const slugs = posts.flatMap((post) => post.tags?.map(taxonomySlug) ?? [])

	return [...new Set(slugs)].map((slug) => ({ slug }))
}

async function postsForTag(slug: string) {
	const posts = await getCollection("posts")
	return posts.filter((post) =>
		post.tags?.some((tag) => taxonomySlug(tag) === slug),
	)
}

function labelForTag(
	slug: string,
	matched: Awaited<ReturnType<typeof postsForTag>>,
) {
	return (
		matched[0]?.tags?.find((tag) => taxonomySlug(tag) === slug) ??
		slug.replaceAll("-", " ")
	)
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params
	const matched = await postsForTag(slug)

	if (!matched.length) return {}

	const label = labelForTag(slug, matched)

	return buildPageMetadata({
		title: `${label} Guides`,
		description: `Wade's plumbing and septic articles about ${slug.replaceAll("-", " ")}.`,
		pathname: `/tag/${slug}`,
	})
}

async function TagArchive({ slug }: { slug: string }) {
	"use cache"
	cacheTag("content:posts", `content:tag:${slug}`)
	cacheLife("max")

	const matched = await postsForTag(slug)
	if (!matched.length) return null

	const label = labelForTag(slug, matched)
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

export default async function TagPage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const matched = await postsForTag(slug)

	if (!matched.length) notFound()

	return (
		<Suspense fallback={<main id="main-content" className="min-h-[50vh]" />}>
			<TagArchive slug={slug} />
		</Suspense>
	)
}
