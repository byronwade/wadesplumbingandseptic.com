import type { Route } from "next"

import type { ContentDocument } from "@/lib/content"
import { resolveContentLayout } from "@/lib/content-layout"
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
import {
	estimateReadingMinutes,
	formatReadingTime,
} from "@/lib/reading-time"
import { stripLeadingMarkdownImage } from "@/lib/sanitize-content"
import { siteConfig } from "@/lib/site"

import { ContentConversionCta } from "@/components/content-conversion-cta"
import { ContentGallery } from "@/components/content-gallery"
import { ContentHero } from "@/components/content-hero"
import { ContentSectionBands } from "@/components/content-section-bands"
import { JsonLd } from "@/components/json-ld"
import { MarkdownContent } from "@/components/markdown-content"
import { PageViewTracker } from "@/components/page-view-tracker"
import { PageViewsStat } from "@/components/page-views-stat"
import { RelatedContentSectionsWithStats } from "@/components/related-content-with-stats"

function formatPostDate(date: string) {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "UTC",
	}).format(new Date(`${date}T00:00:00Z`))
}

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
	const layout = resolveContentLayout(document, { isPost })
	const marketing = layout === "marketing"

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

	const articleBody =
		isPost && document.image
			? stripLeadingMarkdownImage(document.content)
			: document.content

	const readingTime = isPost
		? formatReadingTime(estimateReadingMinutes(articleBody))
		: null

	const articleMeta = isPost ? (
		<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
			<p className="type-meta text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 font-bold">
				{document.date ? (
					<span>
						Published{" "}
						<time dateTime={document.date}>
							{formatPostDate(document.date)}
						</time>
					</span>
				) : null}
				{document.date && readingTime ? (
					<span aria-hidden="true" className="text-border">
						·
					</span>
				) : null}
				{readingTime ? <span>{readingTime}</span> : null}
				{document.updated ? (
					<>
						<span aria-hidden="true" className="text-border">
							·
						</span>
						<span>Updated {document.updated}</span>
					</>
				) : null}
			</p>
			{viewStats && (viewStats.unique > 0 || viewStats.views > 0) ? (
				<PageViewsStat
					totalViews={viewStats.views}
					trendingScore={viewStats.trending}
					uniqueViews={viewStats.unique}
				/>
			) : null}
		</div>
	) : null

	return (
		<main id="main-content">
			{isPost ? <PageViewTracker kind="tip" slug={document.slug} /> : null}
			<ContentHero
				description={document.description}
				eyebrow={document.eyebrow ?? document.category}
				image={document.image}
				imageAlt={document.imageAlt}
				meta={articleMeta}
				pageCta={
					document.slug === "contact" || document.slug === "contact-call-first"
						? "call"
						: "contact"
				}
				parent={parent}
				showActions={!isPost}
				title={document.title}
				variant={isPost ? "article" : "page"}
			/>

			{marketing ? (
				<>
					{document.gallery?.length ? (
						<ContentGallery images={document.gallery} variant="rail" />
					) : null}
					<ContentSectionBands content={articleBody} />
				</>
			) : (
				<article
					className={
						isPost
							? "article-shell pb-[var(--space-section-y)] pt-8 sm:pt-10"
							: "article-shell section-y"
					}
				>
					{document.gallery?.length ? (
						<ContentGallery images={document.gallery} />
					) : null}
					<MarkdownContent content={articleBody} demoteH1 />
				</article>
			)}

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
