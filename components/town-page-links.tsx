import type { Route } from "next"
import Link from "next/link"

import { CallButton } from "@/components/call-button"
import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import {
	callForFreeQuoteLabel,
	freeQuoteCtaLabel,
	freeQuoteHref,
	septicSummary,
} from "@/lib/public-facts"
import { quoteEmailConfigured } from "@/lib/quote-request"
import { siteConfig } from "@/lib/site"
import {
	locationFromPathname,
	nearbyTownsFor,
	townGuideLinks,
	townServiceLinks,
} from "@/lib/town-page-links"
import { cn } from "@/lib/utils"

const chipClass =
	"surface-panel inline-flex max-w-full px-[min(1rem,16px)] py-[min(0.5rem,8px)] text-sm font-semibold [overflow-wrap:anywhere]"

export function TownPageLinks({
	pathname,
	quoteEmailReady = quoteEmailConfigured(),
}: {
	pathname: string
	quoteEmailReady?: boolean
}) {
	const location = locationFromPathname(pathname)
	if (!location) return null

	const nearby = nearbyTownsFor(location)
	const services = townServiceLinks()

	return (
		<section className="border-border bg-card border-y">
			<div className="container-shell section-y">
				<div className="mx-auto max-w-3xl">
					<p className="spec-label">Local plumbing and septic</p>
					<h2 className="type-title mt-3">
						Services Wade&apos;s provides in {location.name}
					</h2>
					<p className="type-lead mt-4">
						Residential and commercial plumbing, drain, water heater, and septic
						work for {location.name} homes in {location.county}. Septic:{" "}
						{septicSummary} Quotes are free.
					</p>
					<ul className="mt-6 flex flex-wrap gap-[min(0.75rem,12px)]">
						{services.map((service) => (
							<li className="max-w-full min-w-0" key={service.href}>
								<Link
									className={chipClass}
									href={service.href as Route}
									prefetch={false}
								>
									{service.title}
								</Link>
							</li>
						))}
					</ul>

					<p className="spec-label mt-12">Nearby towns</p>
					<h3 className="type-subtitle mt-3">Nearby communities we serve</h3>
					<ul className="mt-6 flex flex-wrap gap-[min(0.75rem,12px)]">
						{nearby.map((town) => (
							<li className="max-w-full min-w-0" key={town.slug}>
								<Link
									className={chipClass}
									href={town.href as Route}
									prefetch={false}
								>
									{town.name} plumbing and septic
								</Link>
							</li>
						))}
						<li className="max-w-full min-w-0">
							<Link
								className={chipClass}
								href={"/service-areas" as Route}
								prefetch={false}
							>
								All service areas
							</Link>
						</li>
					</ul>

					<p className="spec-label mt-12">Homeowner guides</p>
					<ul className="mt-4 flex flex-col gap-2 text-sm font-semibold">
						{townGuideLinks.map((guide) => (
							<li key={guide.href}>
								<Link
									className="text-primary underline-offset-4 hover:underline"
									href={guide.href as Route}
									prefetch={false}
								>
									{guide.title}
								</Link>
							</li>
						))}
					</ul>

					<div className="mt-10 flex min-w-0 flex-col flex-wrap items-stretch gap-3 sm:flex-row sm:items-center">
						<CallButton
							className="w-full sm:w-auto"
							desktopLabel={`Call ${contactInfo.phoneDisplay}`}
							size="lg"
						/>
						{quoteEmailReady ? (
							<Link
								className={cn(
									buttonVariants({
										variant: "outline",
										size: "lg",
										wrap: true,
									}),
									"w-full sm:w-auto",
								)}
								href={freeQuoteHref as Route}
								prefetch={false}
							>
								{freeQuoteCtaLabel}
							</Link>
						) : (
							<p className="text-muted-foreground text-sm">
								{callForFreeQuoteLabel}
							</p>
						)}
					</div>
					<p className="text-muted-foreground mt-4 text-sm">
						Office hours: {siteConfig.hours}.
					</p>
				</div>
			</div>
		</section>
	)
}
