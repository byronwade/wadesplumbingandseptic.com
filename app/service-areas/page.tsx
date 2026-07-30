import type { Metadata } from "next"
import type { Route } from "next"
import Link from "next/link"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { JsonLd } from "@/components/json-ld"
import { ServiceAreasMap } from "@/components/service-areas-map"
import type { ContentDocument } from "@/lib/content"
import { normalizeConversion } from "@/lib/content-conversion"
import { locationsByCounty, serviceAreaLocations } from "@/lib/service-areas"
import { breadcrumbJsonLd, buildPageMetadata, webPageJsonLd } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

const description =
	"Interactive map of Wade's Plumbing & Septic coverage across Santa Cruz County and the mountain foothills into Los Gatos and Saratoga, generally west of Highway 101."

export const metadata: Metadata = buildPageMetadata({
	title: "Plumbing & Septic Service Areas",
	description,
	pathname: "/service-areas",
	image: "/images/locations/santa-cruz-redwoods.webp",
})

const counties = [
	{
		title: "Santa Cruz County, California",
		summary:
			"Residential plumbing, commercial plumbing, septic diagnostics, conventional septic work, and engineered septic services throughout the county.",
		locations: locationsByCounty("Santa Cruz County"),
	},
	{
		title: "Santa Clara County, California",
		summary:
			"Foothill communities near the Santa Cruz County line (including Los Gatos and Saratoga) may be covered depending on the address. Call with the property address to confirm.",
		locations: locationsByCounty("Santa Clara County"),
	},
] as const

export default function ServiceAreasPage() {
	const document: ContentDocument = {
		title: "Plumbing & Septic Service Areas",
		description,
		slug: "service-areas",
		content: "",
		conversion: normalizeConversion(null, {
			title: "Plumbing & Septic Service Areas",
			description,
			slug: "service-areas",
			eyebrow: "Local Coverage",
		}),
	}

	return (
		<main id="main-content">
			<ContentHero
				description={description}
				eyebrow="Local Coverage"
				image="/images/locations/santa-cruz-redwoods.webp"
				imageAlt="Coastal redwoods in the Santa Cruz County service area"
				title="Plumbing & septic service areas"
			/>

			<section className="section-y overflow-x-clip">
				<div className="container-shell">
					<div className="section-head reveal mx-auto max-w-3xl text-center">
						<p className="spec-label spec-label-center">Coverage map</p>
						<h2 className="type-title">
							See where Wade&apos;s{" "}
							<span className="text-primary">serves on the Central Coast</span>
						</h2>
						<p className="type-lead">
							Mountain roads, coastal soils, older piping, steep lots, and
							septic regulations change how a job should be diagnosed. The map
							shows our approximate coverage: Santa Cruz County and the west
							foothills into Los Gatos and Saratoga. Tap the shaded area or
							browse communities below, and call to confirm your address.
						</p>
					</div>
				</div>

				{/* Full-bleed on mobile; map component constrains itself from md up. */}
				<div className="mt-[var(--space-block)]">
					<ServiceAreasMap />
				</div>

				<p className="text-muted-foreground container-shell mt-4 text-center text-sm font-bold">
					{serviceAreaLocations.length} communities listed · Call{" "}
					<a
						className="text-primary underline-offset-2 hover:underline"
						href={siteConfig.phoneHref}
					>
						{siteConfig.phone}
					</a>{" "}
					to confirm your address
				</p>
			</section>

			<section className="surface-sunken border-border border-y">
				<div className="container-shell section-y space-y-[var(--space-block)]">
					{counties.map((county) => (
						<div className="reveal" key={county.title}>
							<div className="section-head max-w-3xl">
								<p className="spec-label">County coverage</p>
								<h2 className="type-title">{county.title}</h2>
								<p className="type-lead">{county.summary}</p>
							</div>
							<ul className="mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
								{county.locations.map((location) => (
									<li key={location.slug}>
										<Link
											className="bg-background hover:bg-muted flex h-full items-center px-5 py-4 text-base font-bold tracking-[-0.02em] transition-colors"
											href={location.href as Route}
											prefetch
										>
											{location.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</section>

			<ContactCta
				description="Call with the city, ZIP code, and type of work. A real person will confirm coverage and schedule the right visit."
				title="Not sure if we cover your address?"
			/>
			<JsonLd
				data={[
					webPageJsonLd(document),
					breadcrumbJsonLd([
						{ name: "Home", path: "/" },
						{ name: "Service Areas", path: "/service-areas" },
					]),
					{
						"@context": "https://schema.org",
						"@type": "Service",
						name: "Plumbing and septic service areas",
						provider: {
							"@type": "Plumber",
							"@id": `${siteConfig.url}/#business`,
							name: siteConfig.name,
						},
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
					},
				]}
			/>
		</main>
	)
}
