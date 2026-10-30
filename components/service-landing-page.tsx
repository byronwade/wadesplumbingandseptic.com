import Link from "next/link"

import { ContentConversionCta } from "@/components/content-conversion-cta"
import { ServiceCityLinks } from "@/components/city-service-guides"
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
import { parseServiceSections } from "@/lib/service-sections"
import { breadcrumbJsonLd, serviceFaqJsonLd, serviceJsonLd } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

/** Answer-first facts for people and AI assistants: where, when, cost, booking. */
function ServiceFacts() {
	const linkClass =
		"text-primary underline decoration-current/40 underline-offset-4 hover:decoration-current"
	return (
		<div className="container-shell py-6">
			<h2 className="spec-label" id="service-facts-heading">
				At a glance
			</h2>
			<dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
				<div>
					<dt className="text-muted-foreground text-xs font-bold">
						Service area
					</dt>
					<dd className="mt-1 text-sm font-bold">{siteConfig.serviceArea}</dd>
				</div>
				<div>
					<dt className="text-muted-foreground text-xs font-bold">Hours</dt>
					<dd className="mt-1 text-sm font-bold">{`${siteConfig.hours}.`}</dd>
				</div>
				<div>
					<dt className="text-muted-foreground text-xs font-bold">Pricing</dt>
					<dd className="mt-1 text-sm font-bold">{siteConfig.pricing}</dd>
				</div>
				<div>
					<dt className="text-muted-foreground text-xs font-bold">
						How to book
					</dt>
					<dd className="mt-1 text-sm font-bold">
						Call{" "}
						<a className={linkClass} href={siteConfig.phoneHref}>
							{siteConfig.phone}
						</a>{" "}
						or{" "}
						<Link className={linkClass} href="/contact" prefetch={false}>
							request a free quote
						</Link>
						.
					</dd>
				</div>
			</dl>
		</div>
	)
}

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
	const { sections } = parseServiceSections(service.content)
	const faqSchema = serviceFaqJsonLd(
		sections.filter((section) => section.kind === "faq").flatMap((s) => s.faqs),
	)

	return (
		<main id="main-content">
			<PageViewTracker kind="service" slug={service.slug} />
			<ContentHero
				description={service.description}
				eyebrow={category}
				image={image}
				imageAlt={service.imageAlt ?? service.title}
				parent={{ href: "/services", label: "Services" }}
				title={service.heroTitle ?? service.title}
				variant="service"
			/>

			<section
				aria-labelledby="service-facts-heading"
				className="border-border bg-card border-b"
			>
				<ServiceFacts />
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

			<ServiceCityLinks serviceSlug={service.slug} />

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
					serviceJsonLd(service),
					...(faqSchema ? [faqSchema] : []),
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
