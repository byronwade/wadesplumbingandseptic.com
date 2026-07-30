import { Check, Clock, Phone, ShieldCheck } from "@/components/icons"

import { ContactCta } from "@/components/contact-cta"
import { ContentConversionCta } from "@/components/content-conversion-cta"
import { ContentHero } from "@/components/content-hero"
import { JsonLd } from "@/components/json-ld"
import { MarkdownContent } from "@/components/markdown-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ContentDocument } from "@/lib/content"
import { getServiceImage } from "@/lib/service-images"
import { breadcrumbJsonLd } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

const promises = [
	"Clear recommendations before work begins",
	"Licensed and insured local professionals",
	"Code-compliant materials and workmanship",
	"Testing and cleanup before completion",
] as const

export function ServiceLandingPage({ service }: { service: ContentDocument }) {
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
								className="border-border surface-sunken flex items-center gap-3 rounded-lg border p-4 text-sm font-bold"
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

				<aside className="space-y-[var(--space-grid)] lg:sticky lg:top-[var(--header-offset)] lg:self-start">
					<Card className="border-primary/25 bg-primary/5">
						<CardHeader>
							<CardTitle>Fast local response</CardTitle>
						</CardHeader>
						<CardContent className="text-muted-foreground space-y-4 text-sm">
							<p className="flex gap-3">
								<Clock
									className="text-primary size-5 shrink-0"
									aria-hidden="true"
								/>
								{siteConfig.hours}
							</p>
							<p className="flex gap-3">
								<ShieldCheck
									className="text-primary size-5 shrink-0"
									aria-hidden="true"
								/>
								{siteConfig.licenses}
							</p>
							<a
								className="text-primary flex items-center gap-3 font-bold"
								href={siteConfig.phoneHref}
							>
								<Phone className="size-5 shrink-0" aria-hidden="true" />
								{siteConfig.phone}
							</a>
						</CardContent>
					</Card>
					<ContactCta compact title="Request service" />
				</aside>
			</section>

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
