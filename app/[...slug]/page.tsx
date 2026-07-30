import type { Metadata } from "next"
import { cacheLife, cacheTag } from "next/cache"
import { connection } from "next/server"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { ContentPage } from "@/components/content-page"
import {
	getCollection,
	resolvePageOrPost,
	type ContentDocument,
} from "@/lib/content"
import {
	getPageViewStoreCached,
	getStatsForSlug,
} from "@/lib/page-views"
import { utcDayNow } from "@/lib/page-views/stats"
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
	const resolved = await resolvePageOrPost(slug)

	if (!resolved) return {}

	return buildPageMetadata({
		title: resolved.document.title,
		description: resolved.document.description,
		pathname: `/${resolved.document.slug}`,
		image: resolved.document.image,
		type: resolved.isPost ? "article" : "website",
		noindex: resolved.document.noindex,
	})
}

async function getRelatedForDocument(
	document: ContentDocument,
	isPost: boolean,
) {
	"use cache"
	cacheTag(
		`content:${isPost ? "posts" : "pages"}`,
		`content:${isPost ? "posts" : "pages"}:${document.slug}`,
	)
	cacheLife("max")

	if (isPost) return getRelatedForPost(document)
	if (document.slug.startsWith("service-area/")) {
		return getRelatedForTopic(
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
	}
	return undefined
}

async function RelatedMarkdownPage({
	document,
	isPost,
}: {
	document: ContentDocument
	isPost: boolean
}) {
	const related = await getRelatedForDocument(document, isPost)

	await connection()
	const today = utcDayNow()
	const store = await getPageViewStoreCached()
	const viewStats = isPost
		? getStatsForSlug(store, "tip", document.slug, today)
		: undefined

	return (
		<ContentPage
			document={document}
			isPost={isPost}
			related={related}
			viewStats={viewStats}
		/>
	)
}

export default async function MarkdownPage({
	params,
}: {
	params: Promise<{ slug: string[] }>
}) {
	const { slug: slugParts } = await params
	const slug = slugParts.join("/")
	const resolved = await resolvePageOrPost(slug)

	if (!resolved) notFound()

	return (
		<Suspense fallback={<main id="main-content" className="min-h-[50vh]" />}>
			<RelatedMarkdownPage
				document={resolved.document}
				isPost={resolved.isPost}
			/>
		</Suspense>
	)
}
