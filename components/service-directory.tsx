import type { Route } from "next"
import Link from "next/link"

import {
	serviceCategories,
	serviceCategorySlugs,
} from "@/lib/service-categories"

type DirectoryService = {
	slug: string
	title: string
	category?: string
}

/**
 * Crawlable full catalog on /services. The ranked archive paginates, so AI
 * crawlers and people who skip filters still get every service in two clicks
 * from home (Home to Services to the service page).
 */
export function ServiceDirectory({
	services,
}: {
	services: DirectoryService[]
}) {
	const grouped = serviceCategorySlugs.map((slug) => {
		const category = serviceCategories[slug]
		return {
			slug,
			label: category.label,
			items: services
				.filter((service) => service.category === category.contentCategory)
				.slice()
				.sort((left, right) => left.title.localeCompare(right.title)),
		}
	})
	const listed = new Set(
		grouped.flatMap((group) => group.items.map((item) => item.slug)),
	)
	const leftover = services
		.filter((service) => !listed.has(service.slug))
		.slice()
		.sort((left, right) => left.title.localeCompare(right.title))
	const sections = leftover.length
		? [...grouped, { slug: "other", label: "Other", items: leftover }]
		: grouped

	return (
		<nav aria-label="Every service" className="container-shell section-y-tight">
			<div className="section-head mb-6 max-w-2xl">
				<p className="spec-label">Full catalog</p>
				<h2 className="type-title">Every service</h2>
				<p className="type-lead">
					All plumbing, commercial, and septic pages, including engineered
					septic installation with your engineer. Wade&apos;s does not pump
					septic tanks.
				</p>
			</div>
			<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
				{sections.map((section) => (
					<div key={section.slug}>
						<h3 className="type-subtitle text-[1.0625rem]">{section.label}</h3>
						<ul className="mt-4 space-y-1 text-sm">
							{section.items.map((service) => (
								<li key={service.slug}>
									<Link
										prefetch={false}
										className="hover:text-primary inline-flex min-h-6 items-center py-1 underline-offset-4 hover:underline"
										href={`/service-offerings/${service.slug}` as Route}
									>
										{service.title}
									</Link>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</nav>
	)
}
