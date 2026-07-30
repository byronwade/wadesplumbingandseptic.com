import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "@/components/icons"

import type { ArchiveItem } from "@/lib/archive"
import type { RelatedContent } from "@/lib/related-content"
import { getServiceImage } from "@/lib/service-images"
import { Badge } from "@/components/ui/badge"

function RelatedCard({
	item,
	variant,
}: {
	item: ArchiveItem
	variant: "service" | "tip"
}) {
	const image =
		variant === "service"
			? getServiceImage(item.category, item.image)
			: (item.image ?? "/images/work/precision-valve-installation.webp")

	return (
		<article className="group surface-panel flex h-full flex-col overflow-hidden">
			<Link
				aria-label={
					variant === "service" ? `View ${item.title}` : `Read ${item.title}`
				}
				className="bg-muted relative block aspect-16/9 overflow-hidden"
				href={item.href as Route}
				prefetch={false}
				tabIndex={-1}
			>
				<Image
					alt=""
					className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
					fill
					quality={55}
					sizes="(min-width: 1024px) 22vw, (min-width: 768px) 33vw, 100vw"
					src={image}
				/>
			</Link>
			<div className="flex flex-1 flex-col gap-3 p-[var(--space-card)]">
				<Badge className="w-fit" tone="muted">
					{item.category}
				</Badge>
				<h3 className="type-subtitle text-[1.0625rem] transition-colors group-hover:text-primary">
					<Link href={item.href as Route} prefetch={false}>
						{item.title}
					</Link>
				</h3>
				<p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
					{item.description}
				</p>
				<Link
					className="text-primary mt-auto inline-flex items-center gap-2 text-sm font-bold"
					href={item.href as Route}
					prefetch={false}
				>
					{variant === "service" ? "View service" : "Read guide"}
					<ArrowRight
						aria-hidden="true"
						className="size-4 transition-transform group-hover:translate-x-1"
					/>
				</Link>
			</div>
		</article>
	)
}

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
			<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<h2 className="type-title text-2xl sm:text-3xl">{title}</h2>
				<Link
					className="text-primary inline-flex items-center gap-2 text-sm font-bold"
					href={viewAllHref}
					prefetch={false}
				>
					{viewAllLabel}
					<ArrowRight aria-hidden="true" className="size-4" />
				</Link>
			</div>
			<div className="grid gap-[var(--space-grid)] md:grid-cols-2 xl:grid-cols-3">
				{items.map((item) => (
					<RelatedCard item={item} key={item.slug} variant={variant} />
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
	if (!related.services.length && !related.posts.length) return null

	return (
		<section className="border-border bg-secondary/35 border-y">
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
			</div>
		</section>
	)
}
