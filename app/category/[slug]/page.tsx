import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ArticleArchive } from "@/components/article-archive"
import { getCollection, taxonomySlug } from "@/lib/content"
import { buildPageMetadata } from "@/lib/seo"

const aliases: Record<string, string[]> = {
	"santa-cruz-plumbing": ["Plumbing Maintenance", "Santa Cruz Plumbing"],
	"septic-issues-in-santa-cruz-county": [
		"Septic Guidance",
		"Septic Maintenance",
		"Santa Cruz Plumbing",
	],
	"diy-projects": ["DIY Projects"],
	"plumbing-maintenance": ["Plumbing Maintenance", "Plumbing Tips"],
	"plumbing-tips": ["Plumbing Tips"],
	"septic-maintenance": ["Septic Maintenance"],
}

export async function generateStaticParams() {
	const posts = await getCollection("posts")
	const slugs = posts.map((post) =>
		taxonomySlug(post.category ?? "Expert Tips"),
	)

	return [...new Set([...slugs, ...Object.keys(aliases)])].map((slug) => ({
		slug,
	}))
}

async function postsForCategory(slug: string) {
	const posts = await getCollection("posts")
	const aliasLabels = aliases[slug] ?? []

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

	const label = aliases[slug]?.[0] ?? posts[0]?.category ?? "Expert Tips"

	return buildPageMetadata({
		title: label,
		description: `${label} from Wade's licensed plumbing and septic team.`,
		pathname: `/category/${slug}`,
	})
}

export default async function CategoryPage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const posts = await postsForCategory(slug)

	if (!posts.length) notFound()

	const label = aliases[slug]?.[0] ?? posts[0]?.category ?? "Expert Tips"

	return (
		<ArticleArchive
			description={`Practical ${label.toLowerCase()} from Wade's field experience.`}
			posts={posts}
			title={label}
		/>
	)
}
