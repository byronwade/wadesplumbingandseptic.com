import type { Metadata } from "next"
import type { Route } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, Phone } from "@/components/icons"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { JsonLd } from "@/components/json-ld"
import { buttonVariants } from "@/components/ui/button"
import {
	cityServicePath,
	getCityLocation,
	getCityServicePage,
	getCityServiceStaticParams,
	getNearbyCityLocations,
} from "@/lib/city-service-pages"
import { getDocument } from "@/lib/content"
import { getServiceImage } from "@/lib/service-images"
import { breadcrumbJsonLd, buildPageMetadata, faqPageJsonLd } from "@/lib/seo"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

export function generateStaticParams() {
	return getCityServiceStaticParams()
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ city: string; service: string }>
}): Promise<Metadata> {
	const { city, service } = await params
	const page = getCityServicePage(city, service)
	const location = getCityLocation(city)

	if (!(page && location)) return {}

	return buildPageMetadata({
		title: `${page.serviceTitle} in ${location.name}, CA`,
		description: `${page.serviceTitle} for ${location.name} homes: ${page.commonIssues[0]!.replace(/\.$/, "")}. Licensed and insured. Call 831.225.4344.`,
		pathname: cityServicePath(city, service),
		image: "/images/locations/santa-cruz-plumber.webp",
	})
}

export default async function CityServicePage({
	params,
}: {
	params: Promise<{ city: string; service: string }>
}) {
	const { city, service } = await params
	const page = getCityServicePage(city, service)
	const location = getCityLocation(city)

	if (!(page && location)) notFound()

	const serviceDoc = await getDocument("services", service)
	const image = getServiceImage(
		serviceDoc?.category,
		serviceDoc?.image ?? "/images/locations/santa-cruz-plumber.webp",
	)
	const nearby = getNearbyCityLocations(page.nearbySlugs)
	const serviceHref = `/service-offerings/${service}` as Route
	const cityHubHref = location.href as Route
	const pathname = cityServicePath(city, service)

	const schema = {
		"@context": "https://schema.org",
		"@type": "Service",
		name: `${page.serviceTitle} in ${location.name}`,
		description: page.localAngle,
		url: `${siteConfig.url}${pathname}`,
		serviceType: page.serviceTitle,
		areaServed: {
			"@type": "City",
			name: `${location.name}, California`,
		},
		provider: {
			"@id": `${siteConfig.url}/#business`,
		},
	}

	const jsonLd = [
		schema,
		breadcrumbJsonLd([
			{ name: "Home", path: "/" },
			{ name: "Service Areas", path: "/service-areas" },
			{ name: location.name, path: location.href },
			{ name: page.serviceTitle, path: pathname },
		]),
		...(page.faq?.length ? [faqPageJsonLd(page.faq)] : []),
	]

	return (
		<main id="main-content">
			<ContentHero
				breadcrumbs={[
					{ href: "/" as Route, label: "Home" },
					{ href: "/service-areas" as Route, label: "Service Areas" },
					{ href: cityHubHref, label: location.name },
					{ label: page.serviceTitle },
				]}
				description={`${page.serviceTitle} for ${location.name}, ${location.county}. Local licensed help with clear pricing before work begins.`}
				eyebrow={`${location.name}, CA`}
				image={image}
				imageAlt={`${page.serviceTitle} in ${location.name}`}
				title={`${page.serviceTitle} in ${location.name}`}
				variant="service"
			/>

			<section className="container-shell section-y">
				<div className="mx-auto max-w-3xl">
					<p className="spec-label">Local context</p>
					<h2 className="type-title mt-3">
						Why this matters in {location.name}
					</h2>
					<p className="type-lead mt-4">{page.localAngle}</p>
					<div className="mt-8 flex flex-col gap-3 sm:flex-row">
						<a
							className={cn(buttonVariants({ size: "lg" }), "justify-center")}
							href={siteConfig.phoneHref}
						>
							<Phone aria-hidden="true" className="size-4" />
							Call {siteConfig.phone}
						</a>
						<Link
							className={cn(
								buttonVariants({ variant: "outline", size: "lg" }),
								"justify-center",
							)}
							href={"/contact" as Route}
						>
							Request service
						</Link>
					</div>
				</div>
			</section>

			<section className="surface-sunken border-border border-y">
				<div className="container-shell section-y">
					<div className="mx-auto max-w-3xl">
						<p className="spec-label">Common local issues</p>
						<h2 className="type-title mt-3">
							What {location.name} homeowners call about
						</h2>
						<ul className="mt-[var(--space-block)] grid gap-[var(--space-grid)]">
							{page.commonIssues.map((issue) => (
								<li
									className="surface-panel flex items-start gap-3 p-[var(--space-card)] text-sm font-bold"
									key={issue}
								>
									<span className="bg-accent text-accent-foreground mt-0.5 grid size-8 shrink-0 place-items-center rounded-md">
										<Check aria-hidden="true" className="size-4" />
									</span>
									{issue}
								</li>
							))}
						</ul>
						{page.permitNote ? (
							<p className="type-body text-muted-foreground mt-8">
								{page.permitNote}
							</p>
						) : null}
					</div>
				</div>
			</section>

			<section className="container-shell section-y">
				<div className="mx-auto max-w-3xl">
					<p className="spec-label">Service details</p>
					<h2 className="type-title mt-3">What the job includes</h2>
					<p className="type-lead mt-4">
						This {location.name} page covers local conditions for{" "}
						{page.serviceTitle.toLowerCase()}. For the full county-wide scope,
						materials, and process, see the main service page. For neighborhood
						context across plumbing and septic, start at the {location.name}{" "}
						hub.
					</p>
					<ul className="mt-8 flex flex-col gap-3 text-sm font-bold sm:flex-row sm:flex-wrap">
						<li>
							<Link
								className="text-accent underline-offset-4 hover:underline"
								href={serviceHref}
							>
								{page.serviceTitle} (county overview)
							</Link>
						</li>
						<li>
							<Link
								className="text-accent underline-offset-4 hover:underline"
								href={cityHubHref}
							>
								All {location.name} plumbing and septic
							</Link>
						</li>
					</ul>
				</div>
			</section>

			{page.faq?.length ? (
				<section className="surface-sunken border-border border-y">
					<div className="container-shell section-y">
						<div className="mx-auto max-w-3xl">
							<p className="spec-label">FAQ</p>
							<h2 className="type-title mt-3">Quick answers</h2>
							<dl className="mt-[var(--space-block)] grid gap-6">
								{page.faq.map((item) => (
									<div key={item.question}>
										<dt className="type-title text-xl">{item.question}</dt>
										<dd className="type-body text-muted-foreground mt-2">
											{item.answer}
										</dd>
									</div>
								))}
							</dl>
						</div>
					</div>
				</section>
			) : null}

			{nearby.length ? (
				<section className="container-shell section-y">
					<div className="mx-auto max-w-3xl">
						<p className="spec-label">Nearby</p>
						<h2 className="type-title mt-3">Other cities we serve</h2>
						<ul className="mt-6 flex flex-wrap gap-3">
							{nearby.map((item) => (
								<li key={item.slug}>
									<Link
										className="surface-panel inline-flex px-4 py-2 text-sm font-bold"
										href={item.href as Route}
									>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</section>
			) : null}

			<ContactCta />
			<JsonLd data={jsonLd} />
		</main>
	)
}
