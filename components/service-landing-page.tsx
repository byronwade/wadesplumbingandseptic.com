import { Check } from "@/components/icons"

import { ContentConversionCta } from "@/components/content-conversion-cta"
import { ContentHero } from "@/components/content-hero"
import { ContentSectionBands } from "@/components/content-section-bands"
import { JsonLd } from "@/components/json-ld"
import { RelatedContentSections } from "@/components/related-content"
import type { ContentDocument } from "@/lib/content"
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
}: {
	service: ContentDocument
	related?: RelatedContent
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
			<ContentHero
				description={service.description}
				eyebrow={service.category ?? "Service"}
				image={image}
				imageAlt={service.imageAlt ?? service.title}
				parent={{ href: "/services", label: "Services" }}
				title={service.title}
				variant="marketing"
			/>

			<ContentSectionBands content={service.content} />

			<section className="surface-sunken border-border border-y">
				<div className="container-shell section-y">
					<div className="section-head reveal mx-auto max-w-3xl text-center">
						<p className="spec-label spec-label-center">What you can expect</p>
						<h2 className="type-title">Clear process, clean finish</h2>
						<p className="type-lead">
							Whether the visit is a diagnosis or a full install, the standard
							stays the same: explain the options, do the work right, and leave
							the site better than we found it.
						</p>
					</div>
					<ul className="reveal mt-[var(--space-block)] grid gap-[var(--space-grid)] sm:grid-cols-2">
						{promises.map((item) => (
							<li
								className="surface-panel flex items-center gap-3 p-[var(--space-card)] text-sm font-bold"
								key={item}
							>
								<span className="bg-accent text-accent-foreground grid size-8 shrink-0 place-items-center rounded-md">
									<Check aria-hidden="true" className="size-4" />
								</span>
								{item}
							</li>
						))}
					</ul>
				</div>
			</section>

			{related ? (
				<RelatedContentSections
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
