import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ContentPage } from "@/components/content-page"
import { getCollection, getDocument, getPageOrPost } from "@/lib/content"

export function generateStaticParams() {
	return [...getCollection("pages"), ...getCollection("posts")].map(
		(document) => ({ slug: document.slug.split("/") }),
	)
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
	const { slug: slugParts } = await params
	const slug = slugParts.join("/")
	const document = getPageOrPost(slug)

	if (!document) return {}

	return {
		title: document.title,
		description: document.description,
		alternates: { canonical: `/${document.slug}` },
		openGraph: {
			title: document.title,
			description: document.description,
			type: getDocument("posts", slug) ? "article" : "website",
			images: [document.image ?? "/images/brand/wades-mark.webp"],
		},
		robots: document.noindex ? { index: false, follow: false } : undefined,
	}
}

export default async function MarkdownPage({
	params,
}: {
	params: Promise<{ slug: string[] }>
}) {
	const { slug: slugParts } = await params
	const slug = slugParts.join("/")
	const document = getPageOrPost(slug)

	if (!document) notFound()

	return (
		<ContentPage
			document={document}
			isPost={Boolean(getDocument("posts", slug))}
		/>
	)
}
