import type { Metadata } from "next"
import { cacheLife, cacheTag } from "next/cache"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { ArticleArchive } from "@/components/article-archive"
import { getCollection, taxonomySlug } from "@/lib/content"
import { postCategoryAliases } from "@/lib/post-categories"
import { getRelatedForTopic } from "@/lib/related-content"
import { buildPageMetadata } from "@/lib/seo"

export async function generateStaticParams() {
	const posts = await getCollection("posts")
	const slugs = posts.map((post) =>
		taxonomySlug(post.category ?? "Expert Tips"),
	)

	return [
		...new Set([...slugs, ...Object.keys(postCategoryAliases)]),
	].map((slug) => ({
		slug,
	}))
}

async function postsForCategory(slug: string) {
	const posts = await getCollection("posts")
	const aliasLabels = postCategoryAliases[slug] ?? []

	return posts.filter((post) => {
		const category = post.category ?? "Expert Tips"
		return taxonomySlug(category) === slug || aliasLabels.includes(category)
	})
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params
	const posts = await postsForCategory(slug)

	if (!posts.length) return {}

	const label =
		postCategoryAliases[slug]?.[0] ?? posts[0]?.category ?? "Expert Tips"

	return buildPageMetadata({
		title: label,
		description: `${label} from Wade's licensed plumbing and septic team.`,
		pathname: `/category/${slug}`,
	})
}

async function getCategoryArchiveData(slug: string) {
	"use cache"
	cacheTag("content:posts", `content:category:${slug}`)
	cacheLife("max")

	const posts = await postsForCategory(slug)
	if (!posts.length) return null

	const label =
		postCategoryAliases[slug]?.[0] ?? posts[0]?.category ?? "Expert Tips"
	const related = await getRelatedForTopic(
		{
			label,
			description: `Practical ${label.toLowerCase()} from Wade's field experience.`,
			categories: postCategoryAliases[slug] ?? [label],
			keywords: [label, slug.replaceAll("-", " ")],
			excludeSlugs: posts.map((post) => post.slug),
		},
		{ posts: 3, services: 3 },
	)

	return { posts, label, related }
}

async function CategoryArchive({ slug }: { slug: string }) {
	const data = await getCategoryArchiveData(slug)
	if (!data) return null

	return (
		<ArticleArchive
			description={`Practical ${data.label.toLowerCase()} from Wade's field experience.`}
			posts={data.posts}
			related={data.related}
			title={data.label}
		/>
	)
}

export default async function CategoryPage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const posts = await postsForCategory(slug)

	if (!posts.length) notFound()

	return (
		<Suspense fallback={<main id="main-content" className="min-h-[50vh]" />}>
			<CategoryArchive slug={slug} />
		</Suspense>
	)
}
