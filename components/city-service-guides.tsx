import type { Route } from "next"
import Link from "next/link"

import { getCityServiceLinksForHub } from "@/lib/city-service-pages"

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
				<ul className="mt-6 flex flex-wrap gap-3">
					{links.map((link) => (
						<li key={link.href}>
							<Link
								prefetch={false}
								className="surface-panel inline-flex px-4 py-2 text-sm font-bold"
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
