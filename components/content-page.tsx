import type { Route } from "next"

import type { ContentDocument } from "@/lib/content"
import type { PageViewStats } from "@/lib/page-views"
import type { RelatedContent } from "@/lib/related-content"
import {
	articleJsonLd,
	breadcrumbJsonLd,
	cityNameFromServiceArea,
	extractFaqPairs,
	faqPageJsonLd,
	serviceAreaJsonLd,
	webPageJsonLd,
} from "@/lib/seo"
import { siteConfig } from "@/lib/site"

import { ContentConversionCta } from "@/components/content-conversion-cta"
import { ContentGallery } from "@/components/content-gallery"
import { ContentHero } from "@/components/content-hero"
import { JsonLd } from "@/components/json-ld"
import { MarkdownContent } from "@/components/markdown-content"
import { PageViewTracker } from "@/components/page-view-tracker"
import { PageViewsStat } from "@/components/page-views-stat"
import { RelatedContentSectionsWithStats } from "@/components/related-content-with-stats"

export function ContentPage({
	document,
	isPost = false,
	related,
	viewStats,
}: {
	document: ContentDocument
	isPost?: boolean
	related?: RelatedContent
	viewStats?: PageViewStats
}) {
	const isServiceArea = document.slug.startsWith("service-area/")
	const isFaq = document.slug === "faq"

	const breadcrumbs = [
		{ name: "Home", path: "/" },
		...(isPost
			? [{ name: "Expert Tips", path: "/expert-tips" }]
			: isServiceArea
				? [{ name: "Service Areas", path: "/service-areas" }]
				: isFaq
					? [{ name: "Company", path: "/about-us" }]
					: []),
		{ name: document.title, path: `/${document.slug}` },
	]

	const parent = isPost
		? { href: "/expert-tips" as Route, label: "Expert Tips" }
		: isServiceArea
			? { href: "/service-areas" as Route, label: "Service Areas" }
			: undefined

	const faqPairs = isFaq ? extractFaqPairs(document.content) : []

	const jsonLd = [
		isPost
			? articleJsonLd(document)
			: isServiceArea
				? serviceAreaJsonLd(document, cityNameFromServiceArea(document))
				: webPageJsonLd(document),
		breadcrumbJsonLd(breadcrumbs),
		...(faqPairs.length ? [faqPageJsonLd(faqPairs)] : []),
	]

	return (
		<main id="main-content">
			{isPost ? <PageViewTracker kind="tip" slug={document.slug} /> : null}
			<ContentHero
				description={document.description}
				eyebrow={document.eyebrow ?? document.category}
				image={document.image}
				imageAlt={document.imageAlt}
				parent={parent}
				title={document.title}
			/>
			<article className="article-shell section-y">
				{isPost ? (
					<div className="border-border mb-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b pb-5">
						{document.date ? (
							<p className="type-meta font-bold">
								Published{" "}
								<time dateTime={document.date}>
									{new Intl.DateTimeFormat("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
										timeZone: "UTC",
									}).format(new Date(`${document.date}T00:00:00Z`))}
								</time>
								{document.updated ? ` · Updated ${document.updated}` : null}
							</p>
						) : (
							<span />
						)}
						{viewStats ? (
							viewStats.unique > 0 || viewStats.views > 0 ? (
								<PageViewsStat
									totalViews={viewStats.views}
									trendingScore={viewStats.trending}
									uniqueViews={viewStats.unique}
								/>
							) : (
								<p className="text-muted-foreground font-mono text-[0.6875rem] tracking-[0.08em] uppercase">
									New guide · your visit counts
								</p>
							)
						) : null}
					</div>
				) : null}
				{document.gallery?.length ? (
					<ContentGallery images={document.gallery} />
				) : null}
				<MarkdownContent content={document.content} demoteH1 />
			</article>
			{related ? <RelatedContentSectionsWithStats related={related} /> : null}
			<ContentConversionCta
				conversion={document.conversion}
				secondaryAction={
					document.slug === "contact" || document.slug.startsWith("careers")
						? {
								href: `mailto:${siteConfig.email}`,
								label: "Email Us",
								external: true,
							}
						: undefined
				}
			/>
			<JsonLd data={jsonLd} />
		</main>
	)
}
