import { Check, Clock, Phone, ShieldCheck } from "lucide-react"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { JsonLd } from "@/components/json-ld"
import { MarkdownContent } from "@/components/markdown-content"
import { RelatedContentSections } from "@/components/related-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ContentDocument } from "@/lib/content"
import type { RelatedContent } from "@/lib/related-content"
import { getServiceImage } from "@/lib/service-images"
import { breadcrumbJsonLd } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

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
			"Pickens County, Georgia",
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

			<section className="container-shell section-y grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem]">
				<article>
					<MarkdownContent content={service.content} />

					<div className="mt-12 grid gap-4 sm:grid-cols-2">
						{[
							"Clear recommendations before work begins",
							"Licensed and insured local professionals",
							"Code-compliant materials and workmanship",
							"Testing and cleanup before completion",
						].map((item) => (
							<div
								className="border-border bg-secondary/50 flex items-center gap-3 rounded-lg border p-4 text-sm font-bold"
								key={item}
							>
								<span className="bg-accent text-accent-foreground grid size-8 shrink-0 place-items-center rounded-md">
									<Check className="size-4" />
								</span>
								{item}
							</div>
						))}
					</div>
				</article>

				<aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
					<Card className="border-primary/25 bg-primary/5">
						<CardHeader>
							<CardTitle>Fast local response</CardTitle>
						</CardHeader>
						<CardContent className="text-muted-foreground space-y-4 text-sm">
							<div className="flex gap-3">
								<Clock className="text-primary size-5 shrink-0" />
								<span>{siteConfig.hours}</span>
							</div>
							<div className="flex gap-3">
								<ShieldCheck className="text-primary size-5 shrink-0" />
								<span>{siteConfig.licenses}</span>
							</div>
							<a
								className="text-primary flex items-center gap-3 font-extrabold"
								href={siteConfig.phoneHref}
							>
								<Phone className="size-5" />
								{siteConfig.phone}
							</a>
						</CardContent>
					</Card>
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
			<ContactCta
				description={`Contact us today for professional ${service.title.toLowerCase()} service.`}
			/>
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
