import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import type { ArchiveItem } from "@/lib/archive"
import type { RelatedContent } from "@/lib/related-content"
import { getServiceImage } from "@/lib/service-images"
import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

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
		<Card className="group hover:border-primary/35 flex h-full flex-col overflow-hidden transition-[border-color,transform] duration-200 hover:-translate-y-0.5">
			<Link
				aria-label={
					variant === "service" ? `View ${item.title}` : `Read ${item.title}`
				}
				className="bg-muted relative block aspect-[16/9] overflow-hidden"
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
			<CardHeader className="space-y-2">
				<Badge className="w-fit" tone="muted">
					{item.category}
				</Badge>
				<CardTitle className="group-hover:text-primary text-lg transition-colors">
					<Link href={item.href as Route} prefetch={false}>
						{item.title}
					</Link>
				</CardTitle>
				<CardDescription className="line-clamp-2">
					{item.description}
				</CardDescription>
			</CardHeader>
			<CardContent className="mt-auto">
				<Link
					className="text-primary inline-flex items-center gap-2 text-sm font-extrabold"
					href={item.href as Route}
					prefetch={false}
				>
					{variant === "service" ? "View service" : "Read guide"}
					<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
				</Link>
			</CardContent>
		</Card>
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
					className="text-primary inline-flex items-center gap-2 text-sm font-extrabold"
					href={viewAllHref}
					prefetch={false}
				>
					{viewAllLabel}
					<ArrowRight className="size-4" />
				</Link>
			</div>
			<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
			<div className="container-shell section-y space-y-14">
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
