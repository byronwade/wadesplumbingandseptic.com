import type { Route } from "next"
import Link from "next/link"

import {
	getCityServiceLinksForHub,
	getCityServiceLinksForService,
} from "@/lib/city-service-pages"

/** Links a city hub page to its local service pages. */
export function CityServiceGuides({ pathname }: { pathname: string }) {
	const links = getCityServiceLinksForHub(pathname)
	if (!links.length) return null

	const cityName = links[0]!.cityName

	return (
		<section className="container-shell section-y">
			<div className="mx-auto max-w-3xl">
				<p className="spec-label">Local services</p>
				<h2 className="type-title mt-3">Services in {cityName}</h2>
				<ul className="mt-6 flex flex-wrap gap-[min(0.75rem,12px)]">
					{links.map((link) => (
						<li className="max-w-full min-w-0" key={link.href}>
							<Link
								prefetch={false}
								className="surface-panel inline-flex max-w-full px-[min(1rem,16px)] py-[min(0.5rem,8px)] text-sm font-semibold [overflow-wrap:anywhere]"
								href={link.href as Route}
							>
								{link.title} in {cityName}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}

/** Links a service page to the city pages written for that service. */
export function ServiceCityLinks({ serviceSlug }: { serviceSlug: string }) {
	const links = getCityServiceLinksForService(serviceSlug)
	if (!links.length) return null

	return (
		<section className="container-shell section-y">
			<div className="mx-auto max-w-3xl">
				<p className="spec-label">Local pages</p>
				<h2 className="type-title mt-3">{links[0]!.title} near you</h2>
				<ul className="mt-6 flex flex-wrap gap-[min(0.75rem,12px)]">
					{links.map((link) => (
						<li className="max-w-full min-w-0" key={link.href}>
							<Link
								prefetch={false}
								className="surface-panel inline-flex max-w-full px-[min(1rem,16px)] py-[min(0.5rem,8px)] text-sm font-semibold [overflow-wrap:anywhere]"
								href={link.href as Route}
							>
								{link.title} in {link.cityName}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
