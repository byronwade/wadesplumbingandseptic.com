import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ArticleArchive } from "@/components/article-archive"
import { getCollection, taxonomySlug } from "@/lib/content"

const aliases: Record<string, string> = {
	"santa-cruz-plumbing": "Plumbing Maintenance",
	"septic-issues-in-santa-cruz-county": "Septic Guidance",
}

export function generateStaticParams() {
	const slugs = getCollection("posts").map((post) =>
		taxonomySlug(post.category ?? "Expert Tips"),
	)

	return [...new Set([...slugs, ...Object.keys(aliases)])].map((slug) => ({
		slug,
	}))
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params
	const posts = getCollection("posts").filter(
		(post) =>
			taxonomySlug(post.category ?? "Expert Tips") === slug ||
			post.category === aliases[slug],
	)

	if (!posts.length) return {}

	const label = aliases[slug] ?? posts[0].category ?? "Expert Tips"

	return {
		title: label,
		description: `${label} from Wade's licensed plumbing and septic team.`,
		alternates: { canonical: `/category/${slug}` },
	}
}

export default async function CategoryPage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const posts = getCollection("posts").filter(
		(post) =>
			taxonomySlug(post.category ?? "Expert Tips") === slug ||
			post.category === aliases[slug],
	)

	if (!posts.length) notFound()

	const label = aliases[slug] ?? posts[0].category ?? "Expert Tips"

	return (
		<ArticleArchive
			description={`Practical ${label.toLowerCase()} from Wade's field experience.`}
			posts={posts}
			title={label}
		/>
	)
}
