import type { Route } from "next"
import Link from "next/link"

import { featuredTownLinks } from "@/lib/town-page-links"

const chipClass =
	"surface-panel inline-flex max-w-full px-[min(1rem,16px)] py-[min(0.5rem,8px)] text-sm font-semibold [overflow-wrap:anywhere]"

export function ServiceTownLinks() {
	const towns = featuredTownLinks()

	return (
		<section className="container-shell section-y">
			<div className="mx-auto max-w-3xl">
				<p className="spec-label">Service area</p>
				<h2 className="type-title mt-3">Towns we serve</h2>
				<p className="type-lead mt-4">
					This service is available in Santa Cruz County and selected Santa
					Clara County foothill communities. Confirm your address when you
					request a free quote.
				</p>
				<ul className="mt-6 flex flex-wrap gap-[min(0.75rem,12px)]">
					{towns.map((town) => (
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
			</div>
		</section>
	)
}
