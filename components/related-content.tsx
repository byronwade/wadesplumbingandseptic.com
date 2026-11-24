import type { Route } from "next"
import Link from "next/link"
import { ArrowRight } from "@/components/icons"

import { ContentCard } from "@/components/content-card"
import type { ArchiveItem } from "@/lib/archive"
import type { RelatedContent } from "@/lib/related-content"

const chipClass =
	"surface-panel inline-flex max-w-full px-[min(1rem,16px)] py-[min(0.5rem,8px)] text-sm font-semibold [overflow-wrap:anywhere]"

function RelatedGroup({
	title,
	items,
	variant,
	viewAllHref,
	viewAllLabel,
}: {
	title: string
	items: ArchiveItem[]
	variant: "service" | "tip"
	viewAllHref: Route
	viewAllLabel: string
}) {
	if (!items.length) return null

	return (
		<div>
			<div className="section-head-row mb-8">
				<div className="section-head">
					<p className="spec-label">Keep exploring</p>
					<h2 className="type-title">{title}</h2>
				</div>
				<Link
					prefetch={false}
					className="text-primary inline-flex items-center gap-2 text-sm font-semibold"
					href={viewAllHref}
				>
					{viewAllLabel}
					<ArrowRight aria-hidden="true" className="size-4" />
				</Link>
			</div>
			<div className="card-rail">
				{items.map((item) => (
					<ContentCard item={item} key={item.slug} variant={variant} />
				))}
			</div>
		</div>
	)
}

export function RelatedContentSections({
	related,
	servicesTitle = "Related services",
	postsTitle = "Related guides",
}: {
	related: RelatedContent
	servicesTitle?: string
	postsTitle?: string
}) {
	if (
		!related.services.length &&
		!related.posts.length &&
		!related.towns.length
	)
		return null

	return (
		<section className="surface-sunken border-border border-y">
			<div className="container-shell section-y space-y-[var(--space-block)]">
				<RelatedGroup
					items={related.services}
					title={servicesTitle}
					variant="service"
					viewAllHref={"/services" as Route}
					viewAllLabel="Browse all services"
				/>
				<RelatedGroup
					items={related.posts}
					title={postsTitle}
					variant="tip"
					viewAllHref={"/expert-tips" as Route}
					viewAllLabel="Browse all guides"
				/>
				{related.towns.length ? (
					<div>
						<div className="section-head-row mb-8">
							<div className="section-head">
								<p className="spec-label">Keep exploring</p>
								<h2 className="type-title">Towns we serve</h2>
							</div>
							<Link
								prefetch={false}
								className="text-primary inline-flex items-center gap-2 text-sm font-semibold"
								href={"/service-areas" as Route}
							>
								Browse all towns
								<ArrowRight aria-hidden="true" className="size-4" />
							</Link>
						</div>
						<ul className="flex flex-wrap gap-[min(0.75rem,12px)]">
							{related.towns.map((item) => (
								<li className="max-w-full min-w-0" key={item.href}>
									<Link
										className={chipClass}
										href={item.href as Route}
										prefetch={false}
									>
										{item.title}
									</Link>
								</li>
							))}
						</ul>
					</div>
				) : null}
			</div>
		</section>
	)
}
