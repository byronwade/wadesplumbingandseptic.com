import { Check, Clock, Phone, ShieldCheck } from "@/components/icons"

import { ContactCta } from "@/components/contact-cta"
import { ContentConversionCta } from "@/components/content-conversion-cta"
import { ContentHero } from "@/components/content-hero"
import { JsonLd } from "@/components/json-ld"
import { MarkdownContent } from "@/components/markdown-content"
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
		category: service.category,
		areaServed: [
			"Santa Cruz County, California",
			"Santa Clara County, California",
		],
		provider: {
			"@type": "Plumber",
			"@id": `${siteConfig.url}/#business`,
			name: siteConfig.name,
			telephone: "+18312254344",
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
			/>

			<section className="article-shell section-y grid items-start gap-[var(--space-block)] lg:grid-cols-[minmax(0,1fr)_var(--sidebar-w)]">
				<article className="min-w-0">
					<MarkdownContent content={service.content} />

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

				{/*
				  Desktop sticky rail only. Mobile already has the hero CTAs plus the
				  end conversion band; stacking another Call/Request block here felt
				  spammy on short viewports.
				*/}
				<aside className="hidden space-y-[var(--space-grid)] lg:sticky lg:top-[var(--header-offset)] lg:block lg:self-start">
					<div className="surface-float rounded-xl p-[var(--space-card)]">
						<p className="spec-label">Fast local response</p>
						<ul className="text-on-dark-muted mt-5 space-y-0 text-sm">
							<li className="flex gap-3 border-b border-white/10 py-3.5">
								<Clock
									className="text-primary-bright size-5 shrink-0"
									aria-hidden="true"
								/>
								{siteConfig.hours}
							</li>
							<li className="flex gap-3 border-b border-white/10 py-3.5">
								<ShieldCheck
									className="text-primary-bright size-5 shrink-0"
									aria-hidden="true"
								/>
								{siteConfig.licenses}
							</li>
							<li className="pt-3.5">
								<a
									className="text-primary-bright flex items-center gap-3 font-bold transition-colors hover:text-white"
									href={siteConfig.phoneHref}
								>
									<Phone className="size-5 shrink-0" aria-hidden="true" />
									{siteConfig.phone}
								</a>
							</li>
						</ul>
					</div>
					<ContactCta compact title="Request service" />
				</aside>
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
