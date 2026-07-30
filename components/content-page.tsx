import type { Route } from "next"

import type { ContentDocument } from "@/lib/content"
import type { PageViewStats } from "@/lib/page-views"
import type { RelatedContent } from "@/lib/related-content"
import { articleJsonLd, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

import { ContactCta } from "@/components/contact-cta"
import { ContentConversionCta } from "@/components/content-conversion-cta"
import { ContentGallery } from "@/components/content-gallery"
import { ContentHero } from "@/components/content-hero"
import { JsonLd } from "@/components/json-ld"
import { MarkdownContent } from "@/components/markdown-content"
import { PageViewTracker } from "@/components/page-view-tracker"
import { PageViewsStat } from "@/components/page-views-stat"
import { RelatedContentSections } from "@/components/related-content"

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
	const breadcrumbs = [
		{ name: "Home", path: "/" },
		...(isPost
			? [{ name: "Expert Tips", path: "/expert-tips" }]
			: document.slug.startsWith("service-area/")
				? [{ name: "Service Areas", path: "/service-areas" }]
				: []),
		{ name: document.title, path: `/${document.slug}` },
	]

	const parent = isPost
		? { href: "/expert-tips" as Route, label: "Expert Tips" }
		: document.slug.startsWith("service-area/")
			? { href: "/service-areas" as Route, label: "Service Areas" }
			: undefined

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
			{/* Sidebar width comes from --sidebar-w so this template and the service
			    template share one measurement (they were 20rem and 21rem). */}
			<article className="article-shell section-y grid items-start gap-[var(--space-block)] lg:grid-cols-[minmax(0,1fr)_var(--sidebar-w)]">
				<div className="min-w-0">
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
									{document.updated
										? ` · Updated ${document.updated}`
										: null}
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
					<MarkdownContent content={document.content} />
				</div>
				<aside className="lg:sticky lg:top-[var(--header-offset)] lg:self-start">
					<ContactCta
						compact
						description="Tell us what is happening and get practical options from a local licensed team."
						title="Need help with this?"
					/>
				</aside>
			</article>
			{related ? <RelatedContentSections related={related} /> : null}
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
			<JsonLd
				data={[
					isPost ? articleJsonLd(document) : webPageJsonLd(document),
					breadcrumbJsonLd(breadcrumbs),
				]}
			/>
		</main>
	)
}
