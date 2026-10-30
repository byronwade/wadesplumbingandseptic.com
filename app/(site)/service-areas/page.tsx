import type { Metadata } from "next"
import type { Route } from "next"
import Link from "next/link"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { MapPin } from "@/components/icons"
import { JsonLd } from "@/components/json-ld"
import { ServiceAreasMapLazy } from "@/components/service-areas-map-lazy"
import type { ContentDocument } from "@/lib/content"
import { normalizeConversion } from "@/lib/content-conversion"
import { locationsByCounty } from "@/lib/service-areas"
import {
	breadcrumbJsonLd,
	buildPageMetadata,
	businessId,
	serviceAreasJsonLd,
	webPageJsonLd,
} from "@/lib/seo"

const description =
	"Interactive map of Wade's Plumbing & Septic coverage across Santa Cruz County and the mountain foothills into Los Gatos and Saratoga, generally west of Highway 101."

export const metadata: Metadata = buildPageMetadata({
	title: "Plumbing & Septic Service Areas",
	description,
	pathname: "/service-areas",
	image: "/images/locations/santa-cruz-redwoods.webp",
})

const santaCruz = {
	title: "Santa Cruz County, California",
	summary:
		"Residential plumbing, commercial plumbing, septic diagnostics, conventional septic work, and engineered septic services throughout the county.",
	locations: locationsByCounty("Santa Cruz County"),
}

const santaClara = {
	title: "Santa Clara County, California",
	summary:
		"Foothill communities near the Santa Cruz County line (including Los Gatos and Saratoga) may be covered depending on the address. Call with the property address to confirm.",
	locations: locationsByCounty("Santa Clara County"),
}

function TownList({
	locations,
}: {
	locations: ReturnType<typeof locationsByCounty>
}) {
	return (
		<ul className="town-grid mt-6">
			{locations.map((location) => (
				<li key={location.slug}>
					<Link
						prefetch={false}
						className="town-link"
						href={location.href as Route}
					>
						<MapPin
							aria-hidden="true"
							className="text-primary size-4 shrink-0"
						/>
						<span className="min-w-0">{location.name}</span>
					</Link>
				</li>
			))}
		</ul>
	)
}

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
				eyebrow="Local coverage"
				image="/images/locations/santa-cruz-redwoods.webp"
				imageAlt="Coastal redwoods in the Santa Cruz County service area"
				showActions={false}
				title="Plumbing & septic service areas"
				variant="page"
			/>

			<section className="section-y overflow-x-clip">
				<div className="container-shell section-head-row reveal">
					<div className="section-head max-w-2xl">
						<p className="spec-label">Coverage map</p>
						<h2 className="type-title">
							See where Wade&apos;s{" "}
							<span className="text-primary">serves on the Central Coast</span>
						</h2>
					</div>
					<p className="type-lead max-w-xl">
						Mountain roads, coastal soils, older piping, steep lots, and septic
						regulations change how a job should be diagnosed. Tap the shaded
						area or pick your community below, and call to confirm your address.
					</p>
				</div>

				{/* Full-bleed on mobile; map JS loads only when this shell nears view. */}
				<div className="mt-[var(--space-block)]">
					<ServiceAreasMapLazy />
				</div>
			</section>

			<section className="surface-sunken border-border border-y">
				<div className="container-shell section-y grid grid-cols-1 gap-[var(--space-block)] lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-16">
					<div className="reveal min-w-0">
						<div className="section-head max-w-3xl">
							<p className="spec-label">
								{santaCruz.locations.length} communities
							</p>
							<h2 className="type-title">{santaCruz.title}</h2>
							<p className="type-lead">{santaCruz.summary}</p>
						</div>
						<TownList locations={santaCruz.locations} />
					</div>

					<aside className="reveal flex min-w-0 flex-col gap-[var(--space-grid)] lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
						<div className="surface-panel panel-inset rounded-lg">
							<p className="spec-label">Foothill coverage</p>
							<h2 className="type-title mt-3 text-[length:var(--type-card)] sm:text-2xl">
								{santaClara.title}
							</h2>
							<p className="text-muted-foreground mt-3 text-sm leading-relaxed">
								{santaClara.summary}
							</p>
							<TownList locations={santaClara.locations} />
						</div>
					</aside>
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
						// A reference to the sitewide business node. A typed Plumber
						// here is a second LocalBusiness with no address or phone,
						// which validators report as a markup error.
						provider: { "@id": businessId },
						areaServed: serviceAreasJsonLd(),
					},
				]}
			/>
		</main>
	)
}
