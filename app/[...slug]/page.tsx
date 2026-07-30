import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { ContentPage } from "@/components/content-page"
import { getCollection, getDocument, getPageOrPost } from "@/lib/content"
import { getRelatedForPost, getRelatedForTopic } from "@/lib/related-content"
import { buildPageMetadata } from "@/lib/seo"

export async function generateStaticParams() {
	const [pages, posts] = await Promise.all([
		getCollection("pages"),
		getCollection("posts"),
	])

	return [...pages, ...posts].map((document) => ({
		slug: document.slug.split("/"),
	}))
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
	const { slug: slugParts } = await params
	const slug = slugParts.join("/")
	const document = await getPageOrPost(slug)

	if (!document) return {}

	const isPost = Boolean(await getDocument("posts", slug))

	return buildPageMetadata({
		title: document.title,
		description: document.description,
		pathname: `/${document.slug}`,
		image: document.image,
		type: isPost ? "article" : "website",
		noindex: document.noindex,
	})
}

async function RelatedMarkdownPage({
	document,
	isPost,
}: {
	document: NonNullable<Awaited<ReturnType<typeof getPageOrPost>>>
	isPost: boolean
}) {
	const related = isPost
		? await getRelatedForPost(document)
		: document.slug.startsWith("service-area/")
			? await getRelatedForTopic(
					{
						label: document.title,
						description: document.description,
						keywords: [
							document.slug.replaceAll("-", " "),
							"plumbing",
							"septic",
							...(document.slug.includes("santa-cruz") ? ["santa cruz"] : []),
						],
						excludeSlugs: [document.slug],
					},
					{ posts: 3, services: 3 },
				)
			: undefined

	return <ContentPage document={document} isPost={isPost} related={related} />
}

export default async function MarkdownPage({
	params,
}: {
	params: Promise<{ slug: string[] }>
}) {
	const { slug: slugParts } = await params
	const slug = slugParts.join("/")
	const [document, post] = await Promise.all([
		getPageOrPost(slug),
		getDocument("posts", slug),
	])

	if (!document) notFound()

	return (
		<Suspense fallback={<main id="main-content" className="min-h-[50vh]" />}>
			<RelatedMarkdownPage document={document} isPost={Boolean(post)} />
		</Suspense>
	)
}
