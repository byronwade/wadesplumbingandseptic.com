import type { Route } from "next"

import type { ContentDocument } from "@/lib/content"
import { articleJsonLd, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo"

import { ContactCta } from "@/components/contact-cta"
import { ContentConversionCta } from "@/components/content-conversion-cta"
import { ContentGallery } from "@/components/content-gallery"
import { ContentHero } from "@/components/content-hero"
import { JsonLd } from "@/components/json-ld"
import { MarkdownContent } from "@/components/markdown-content"

export function ContentPage({
	document,
	isPost = false,
}: {
	document: ContentDocument
	isPost?: boolean
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
			<ContentHero
				description={document.description}
				eyebrow={document.eyebrow ?? document.category}
				image={document.image}
				imageAlt={document.imageAlt}
				parent={parent}
				title={document.title}
			/>
			<article className="container-shell section-y grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
				<div>
					{isPost && document.date ? (
						<p className="text-muted-foreground mb-8 text-sm font-bold">
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
					<MarkdownContent content={document.content} />
				</div>
				<aside className="lg:sticky lg:top-28 lg:self-start">
					<ContactCta
						compact
						description="Tell us what is happening and get practical options from a local licensed team."
						title="Need help with this?"
					/>
				</aside>
			</article>
			<ContentConversionCta conversion={document.conversion} />
			<JsonLd
				data={[
					isPost ? articleJsonLd(document) : webPageJsonLd(document),
					breadcrumbJsonLd(breadcrumbs),
				]}
			/>
		</main>
	)
}
