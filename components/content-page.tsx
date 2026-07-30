import type { Route } from "next"

import type { ContentDocument } from "@/lib/content"
import { resolveContentLayout } from "@/lib/content-layout"
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
import { ContentSectionBands } from "@/components/content-section-bands"
import { JsonLd } from "@/components/json-ld"
import { MarkdownContent } from "@/components/markdown-content"
import { RelatedContentSections } from "@/components/related-content"

export function ContentPage({
	document,
	isPost = false,
	related,
}: {
	document: ContentDocument
	isPost?: boolean
	related?: RelatedContent
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

	return (
		<main id="main-content">
			<ContentHero
				description={document.description}
				eyebrow={document.eyebrow ?? document.category}
				image={document.image}
				imageAlt={document.imageAlt}
				parent={parent}
				title={document.title}
				variant={marketing ? "marketing" : "default"}
			/>

			{marketing ? (
				<>
					{document.gallery?.length ? (
						<ContentGallery images={document.gallery} variant="rail" />
					) : null}
					<ContentSectionBands content={document.content} />
				</>
			) : (
				<article className="article-shell section-y">
					{isPost && document.date ? (
						<p className="type-meta border-border mb-8 border-b pb-5 font-bold">
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
					) : null}
					{document.gallery?.length ? (
						<ContentGallery images={document.gallery} />
					) : null}
					<MarkdownContent content={document.content} demoteH1 />
				</article>
			)}

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
			<JsonLd data={jsonLd} />
		</main>
	)
}
