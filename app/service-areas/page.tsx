import type { Metadata } from "next"
import type { Route } from "next"
import Link from "next/link"
import { MapPinned, Phone } from "lucide-react"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { JsonLd } from "@/components/json-ld"
import { ServiceAreasMap } from "@/components/service-areas-map"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import type { ContentDocument } from "@/lib/content"
import { normalizeConversion } from "@/lib/content-conversion"
import { locationsByCounty, serviceAreaLocations } from "@/lib/service-areas"
import { breadcrumbJsonLd, buildPageMetadata, webPageJsonLd } from "@/lib/seo"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

const description =
	"Interactive map of Wade's Plumbing & Septic coverage across Santa Cruz County and the mountain foothills into Los Gatos and Saratoga - generally west of Highway 101."

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
			"Foothill communities near the Santa Cruz County line - including Los Gatos and Saratoga - may be covered depending on the address. Call with the property address to confirm.",
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
					<div className="mx-auto max-w-3xl text-center">
						<Badge>Coverage Map</Badge>
						<h2 className="type-title mt-5">
							See where Wade&apos;s{" "}
							<span className="text-primary">serves on the Central Coast</span>
						</h2>
						<p className="type-lead mt-5">
							Mountain roads, coastal soils, older piping, steep lots, and septic
							regulations change how a job should be diagnosed. The map shows our
							approximate coverage - Santa Cruz County and the west foothills into
							Los Gatos and Saratoga. Tap the shaded area or browse communities
							below, and call to confirm your address.
						</p>
					</div>
				</div>

				{/* Full-bleed on mobile; map component constrains itself from md up. */}
				<div className="mt-10">
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

			<section className="border-border bg-card border-y">
				<div className="container-shell section-y space-y-16">
					{counties.map((county) => (
						<div key={county.title}>
							<div className="max-w-3xl">
								<h2 className="type-title text-3xl sm:text-4xl">
									{county.title}
								</h2>
								<p className="type-lead mt-4">{county.summary}</p>
							</div>
							<ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{county.locations.map((location) => (
									<li key={location.slug}>
										<Link
											className="border-border bg-background hover:border-primary/40 flex items-center gap-4 rounded-lg border px-5 py-4 text-base font-extrabold tracking-[-0.02em] transition-colors"
											href={location.href as Route}
											prefetch
										>
											<span className="bg-accent text-accent-foreground grid size-10 shrink-0 place-items-center rounded-md">
												<MapPinned className="size-5" aria-hidden="true" />
											</span>
											{location.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</section>

			<section className="container-shell section-y">
				<div className="surface-panel mx-auto max-w-3xl p-8 text-center sm:p-10">
					<h2 className="type-title text-3xl sm:text-4xl">
						Not sure if we cover your address?
					</h2>
					<p className="type-lead mt-4">
						Call with the city, ZIP code, and type of work. A real person will
						confirm coverage and schedule the right visit.
					</p>
					<a
						className={cn(buttonVariants({ size: "xl" }), "mt-7 gap-2")}
						href={siteConfig.phoneHref}
					>
						<Phone className="size-5" />
						Call {siteConfig.phone}
					</a>
				</div>
			</section>

			<ContactCta />
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
