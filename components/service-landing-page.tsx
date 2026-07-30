import { Check } from "@/components/icons"

import { ContentConversionCta } from "@/components/content-conversion-cta"
import { ContentHero } from "@/components/content-hero"
import { JsonLd } from "@/components/json-ld"
import { MarkdownContent } from "@/components/markdown-content"
import { PageViewTracker } from "@/components/page-view-tracker"
import { PageViewsStat } from "@/components/page-views-stat"
import { RelatedContentSectionsWithStats } from "@/components/related-content-with-stats"
import type { ContentDocument } from "@/lib/content"
import type { PageViewStats } from "@/lib/page-views"
import type { RelatedContent } from "@/lib/related-content"
import { getServiceImage } from "@/lib/service-images"
import { breadcrumbJsonLd } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

const promises = [
	"Clear recommendations before work begins",
	"Licensed and insured local professionals",
	"Code-compliant materials and workmanship",
	"Testing and cleanup before completion",
] as const

export function ServiceLandingPage({
	service,
	related,
	viewStats,
}: {
	service: ContentDocument
	related?: RelatedContent
	viewStats?: PageViewStats
}) {
	const image = getServiceImage(service.category, service.image)
	const schema = {
		"@context": "https://schema.org",
		"@type": "Service",
		name: service.title,
		description: service.description,
		url: `${siteConfig.url}/service-offerings/${service.slug}`,
		serviceType: service.category ?? "Plumbing",
		category: service.category,
		areaServed: [
			{
				"@type": "AdministrativeArea",
				name: "Santa Cruz County, California",
			},
			{
				"@type": "AdministrativeArea",
				name: "Santa Clara County, California",
			},
		],
		provider: {
			"@id": `${siteConfig.url}/#business`,
		},
		brand: {
			"@type": "Brand",
			name: siteConfig.name,
		},
	}

	return (
		<main id="main-content">
			<PageViewTracker kind="service" slug={service.slug} />
			<ContentHero
				description={service.description}
				eyebrow={service.category ?? "Service"}
				image={image}
				imageAlt={service.imageAlt ?? service.title}
				parent={{ href: "/services", label: "Services" }}
				title={service.title}
			/>

			<section className="article-shell section-y">
				<article>
					{viewStats ? (
						<div className="border-border mb-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b pb-5">
							<p className="spec-label">Page interest</p>
							{viewStats.unique > 0 || viewStats.views > 0 ? (
								<PageViewsStat
									totalViews={viewStats.views}
									trendingScore={viewStats.trending}
									uniqueViews={viewStats.unique}
								/>
							) : (
								<p className="text-muted-foreground font-mono text-[0.6875rem] tracking-[0.08em] uppercase">
									New on the site · your visit counts
								</p>
							)}
						</div>
					) : null}
					<MarkdownContent content={service.content} demoteH1 />

					<div className="mt-[var(--space-block)] grid gap-[var(--space-grid)] sm:grid-cols-2">
						{promises.map((item) => (
							<div
								className="surface-panel flex items-center gap-3 p-4 text-sm font-bold"
								key={item}
							>
								<span className="bg-accent text-accent-foreground grid size-8 shrink-0 place-items-center rounded-md">
									<Check className="size-4" aria-hidden="true" />
								</span>
								{item}
							</div>
						))}
					</div>
				</article>
			</section>

			{related ? (
				<RelatedContentSectionsWithStats
					postsTitle="Related expert tips"
					related={related}
					servicesTitle="Related services"
				/>
			) : null}
			<ContentConversionCta conversion={service.conversion} />
			<JsonLd
				data={[
					schema,
					breadcrumbJsonLd([
						{ name: "Home", path: "/" },
						{ name: "Services", path: "/services" },
						{
							name: service.title,
							path: `/service-offerings/${service.slug}`,
						},
					]),
				]}
			/>
		</main>
	)
}
