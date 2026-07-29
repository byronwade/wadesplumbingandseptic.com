import type { Metadata } from "next"

import type { ContentDocument } from "@/lib/content"
import { siteConfig } from "@/lib/site"

export function absoluteUrl(pathname: string) {
	if (pathname.startsWith("http")) return pathname
	return `${siteConfig.url}${pathname.startsWith("/") ? pathname : `/${pathname}`}`
}

export function buildPageMetadata({
	title,
	description,
	pathname,
	image,
	type = "website",
	noindex = false,
}: {
	title: string
	description: string
	pathname: string
	image?: string
	type?: "website" | "article"
	noindex?: boolean
}): Metadata {
	const url = absoluteUrl(pathname)
	const ogImage = absoluteUrl(image ?? "/images/brand/wades-mark.webp")

	return {
		title,
		description,
		alternates: { canonical: pathname },
		openGraph: {
			title,
			description,
			url,
			type,
			siteName: siteConfig.name,
			locale: "en_US",
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [ogImage],
		},
		robots: noindex ? { index: false, follow: false } : undefined,
	}
}

export function articleJsonLd(document: ContentDocument) {
	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: document.title,
		description: document.description,
		datePublished: document.date,
		dateModified: document.updated ?? document.date,
		image: absoluteUrl(
			document.image ?? "/images/work/precision-valve-installation.webp",
		),
		author: {
			"@type": "Organization",
			name: siteConfig.name,
			url: siteConfig.url,
		},
		publisher: {
			"@type": "Organization",
			name: siteConfig.name,
			logo: {
				"@type": "ImageObject",
				url: absoluteUrl("/images/brand/wades-mark.webp"),
			},
		},
		mainEntityOfPage: absoluteUrl(`/${document.slug}`),
	}
}

export function webPageJsonLd(document: ContentDocument) {
	return {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: document.title,
		description: document.description,
		url: absoluteUrl(`/${document.slug}`),
		isPartOf: {
			"@type": "WebSite",
			name: siteConfig.name,
			url: siteConfig.url,
		},
		about: {
			"@id": `${siteConfig.url}/#business`,
		},
	}
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: absoluteUrl(item.path),
		})),
	}
}
