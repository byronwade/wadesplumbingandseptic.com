import type { Metadata } from "next"
import type { Route } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check } from "@/components/icons"

import { AnswerFirst } from "@/components/answer-first"
import { CallButton } from "@/components/call-button"
import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { GoogleReviewInvite } from "@/components/google-reviews"
import { JsonLd } from "@/components/json-ld"
import { buttonVariants } from "@/components/ui/button"
import { cityServiceFaqs, isSepticWork } from "@/lib/answer-first"
import { contactInfo } from "@/lib/contact"
import {
	freeQuoteCtaLabel,
	freeQuoteHref,
	weekdayHoursPhrase,
} from "@/lib/public-facts"
import {
	cityServicePath,
	getCityLocation,
	getCityServicePage,
	getCityServiceStaticParams,
	getNearbyCityLocations,
} from "@/lib/city-service-pages"
import { getDocument } from "@/lib/content"
import { getServiceImage } from "@/lib/service-images"
import {
	breadcrumbJsonLd,
	buildPageMetadata,
	businessId,
	openingHoursJsonLd,
	serviceAreaPlaceJsonLd,
	serviceFaqJsonLd,
} from "@/lib/seo"
import { coverageDependsOnAddress } from "@/lib/service-areas"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

const chipClass =
	"surface-panel inline-flex max-w-full px-[min(1rem,16px)] py-[min(0.5rem,8px)] text-sm font-semibold [overflow-wrap:anywhere]"

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

	if (!page || !location) return {}

	return buildPageMetadata({
		title: `${page.serviceTitle} in ${location.name}, CA`,
		description: `${page.serviceTitle} for ${location.name} homes: ${page.commonIssues[0]!.replace(/\.$/, "")}. Quotes are free. Call 831.225.4344 ${weekdayHoursPhrase()}.`,
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

	if (!page || !location) notFound()

	const serviceDoc = await getDocument("services", service)
	const image = getServiceImage(
		serviceDoc?.category,
		serviceDoc?.image ?? "/images/locations/santa-cruz-plumber.webp",
	)
	const nearby = getNearbyCityLocations(page.nearbySlugs)
	const serviceHref = `/service-offerings/${service}` as Route
	const cityHubHref = location.href as Route
	const pathname = cityServicePath(city, service)

	const hours = openingHoursJsonLd()
	const schema = {
		"@context": "https://schema.org",
		"@type": "Service",
		name: `${page.serviceTitle} in ${location.name}`,
		description: page.localAngle,
		url: `${siteConfig.url}${pathname}`,
		serviceType: page.serviceTitle,
		areaServed: serviceAreaPlaceJsonLd(location),
		provider: {
			"@id": businessId,
		},
		hoursAvailable: hours,
		availableChannel: {
			"@type": "ServiceChannel",
			serviceUrl: `${siteConfig.url}/contact`,
			servicePhone: {
				"@type": "ContactPoint",
				telephone: siteConfig.phoneE164,
				contactType: "customer service",
				hoursAvailable: hours,
			},
		},
	}

	const faqs = cityServiceFaqs(
		page.serviceTitle,
		location,
		page.localAngle,
		page.commonIssues,
		page.faq,
	)
	const faqSchema = serviceFaqJsonLd(faqs)
	const jsonLd = [
		schema,
		breadcrumbJsonLd([
			{ name: "Home", path: "/" },
			{ name: "Service Areas", path: "/service-areas" },
			{ name: location.name, path: location.href },
			{ name: page.serviceTitle, path: pathname },
		]),
		...(faqSchema ? [faqSchema] : []),
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
				description={`${page.serviceTitle} for ${location.name}, ${location.county}. Quotes are free. Call ${siteConfig.phone} ${weekdayHoursPhrase()}.`}
				eyebrow={`${location.name}, CA`}
				image={image}
				imageAlt={`${page.serviceTitle} in ${location.name}`}
				title={`${page.serviceTitle} in ${location.name}`}
				variant="service"
			/>

			<AnswerFirst
				confirmAddress={coverageDependsOnAddress(location)}
				includeSepticNote={isSepticWork(page.serviceTitle)}
				place={`${location.name}, ${location.county}`}
				work={page.serviceTitle.toLowerCase()}
			/>

			<section className="container-shell section-y">
				<div className="mx-auto max-w-3xl">
					<p className="spec-label">Local context</p>
					<h2 className="type-title mt-3">
						Why this matters in {location.name}
					</h2>
					<p className="type-lead mt-4">{page.localAngle}</p>
					<div className="mt-8 flex min-w-0 flex-col flex-wrap items-stretch gap-3 sm:flex-row sm:items-center">
						<CallButton
							className="w-full sm:w-auto"
							desktopLabel={`Call ${contactInfo.phoneDisplay}`}
							size="lg"
						/>
						<Link
							prefetch={false}
							className={cn(
								buttonVariants({
									variant: "outline",
									size: "lg",
									wrap: true,
								}),
								"w-full justify-center sm:w-auto",
							)}
							href={freeQuoteHref as Route}
						>
							{freeQuoteCtaLabel}
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
									className="surface-panel panel-inset flex items-start gap-[min(0.75rem,12px)] text-sm font-semibold"
									key={issue}
								>
									<span className="bg-accent text-accent-foreground mt-0.5 grid size-[min(2rem,32px)] shrink-0 place-items-center rounded-md">
										<Check
											aria-hidden="true"
											className="size-[min(1rem,16px)]"
										/>
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
					<ul className="mt-8 flex flex-col gap-3 text-sm font-semibold sm:flex-row sm:flex-wrap">
						<li>
							<Link
								prefetch={false}
								className="text-primary underline-offset-4 hover:underline"
								href={serviceHref}
							>
								{page.serviceTitle} (county overview)
							</Link>
						</li>
						<li>
							<Link
								prefetch={false}
								className="text-primary underline-offset-4 hover:underline"
								href={cityHubHref}
							>
								All {location.name} plumbing and septic
							</Link>
						</li>
					</ul>
				</div>
			</section>

			{faqs.length ? (
				<section className="surface-sunken border-border border-y">
					<div className="container-shell section-y">
						<div className="mx-auto max-w-3xl">
							<p className="spec-label">FAQ</p>
							<h2 className="type-title mt-3">Quick answers</h2>
							<dl className="mt-[var(--space-block)] grid gap-6">
								{faqs.map((item) => (
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
						<ul className="mt-6 flex flex-wrap gap-[min(0.75rem,12px)]">
							{nearby.map((item) => (
								<li className="max-w-full min-w-0" key={item.slug}>
									<Link
										prefetch={false}
										className={chipClass}
										href={item.href as Route}
									>
										{item.name} plumbing and septic
									</Link>
								</li>
							))}
						</ul>
					</div>
				</section>
			) : null}

			<GoogleReviewInvite
				buttonLabel="Leave us a review on Google"
				message="If we recently finished this work at your home, you can leave us a review on Google."
			/>
			<ContactCta />
			<JsonLd data={jsonLd} />
		</main>
	)
}
