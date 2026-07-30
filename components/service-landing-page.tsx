import { BadgeCheck } from "@/components/icons"

import { ContentConversionCta } from "@/components/content-conversion-cta"
import { ContentHero } from "@/components/content-hero"
import { JsonLd } from "@/components/json-ld"
import { PageViewTracker } from "@/components/page-view-tracker"
import { PageViewsStat } from "@/components/page-views-stat"
import { RelatedContentSectionsWithStats } from "@/components/related-content-with-stats"
import { ServiceContentSections } from "@/components/service-content-sections"
import type { ContentDocument } from "@/lib/content"
import type { PageViewStats } from "@/lib/page-views"
import type { RelatedContent } from "@/lib/related-content"
import { getServiceImage } from "@/lib/service-images"
import { breadcrumbJsonLd } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

const trustPoints = [
	"Family owned and operated",
	"Licensed and insured",
	"Clear options before work",
	"4.9 local rating",
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
	const category = service.category ?? "Service"
	const schema = {
		"@context": "https://schema.org",
		"@type": "Service",
		name: service.title,
		description: service.description,
		url: `${siteConfig.url}/service-offerings/${service.slug}`,
		serviceType: category,
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
				eyebrow={category}
				image={image}
				imageAlt={service.imageAlt ?? service.title}
				parent={{ href: "/services", label: "Services" }}
				title={service.title}
				variant="service"
			/>

			<section className="border-border bg-card border-b">
				<ul className="container-shell grid grid-cols-1 gap-x-8 gap-y-3 py-5 sm:grid-cols-2 lg:grid-cols-4">
					{trustPoints.map((item) => (
						<li
							className="text-muted-foreground flex items-center gap-2.5 text-sm font-bold"
							key={item}
						>
							<BadgeCheck
								aria-hidden="true"
								className="text-primary size-4 shrink-0"
							/>
							{item}
						</li>
					))}
				</ul>
			</section>

			{viewStats ? (
				<div className="container-shell pt-[var(--space-section-y-tight)]">
					<div className="border-border flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b pb-4">
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
				</div>
			) : null}

			<ServiceContentSections
				asideBody={
					category.toLowerCase().includes("septic")
						? "Clear recommendations before work begins. Careful septic work that protects your tank, filter, and drainfield."
						: "Clear recommendations before work begins. Licensed local crews, honest options, and a clean finish."
				}
				asideTitle={`Licensed ${category.toLowerCase()} work across Santa Cruz County`}
				category={category}
				content={service.content}
			/>

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
