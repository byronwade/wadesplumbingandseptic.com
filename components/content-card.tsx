import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarDays } from "@/components/icons"

import { PageViewsStat, hasPageViews } from "@/components/page-views-stat"
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import type { ArchiveItem } from "@/lib/archive"
import { getServiceImage } from "@/lib/service-images"

export function ContentCard({
	item,
	variant,
	preferTrending = false,
}: {
	item: ArchiveItem
	variant: "service" | "tip"
	preferTrending?: boolean
}) {
	const image =
		variant === "service"
			? getServiceImage(item.category, item.image)
			: (item.image ?? "/images/work/precision-valve-installation.webp")

	const showViews = hasPageViews(item)
	const showDate = variant === "tip" && Boolean(item.date)

	return (
		<Card className="group hover:border-border-strong h-full overflow-hidden transition-colors duration-200">
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
					alt={item.imageAlt ?? `${item.title}, Wade's Plumbing & Septic`}
					className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
					fill
					quality={60}
					sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
					src={image}
				/>
			</Link>

			<CardHeader className="flex-1 pb-[var(--space-card)]">
				<p className="spec-tag">{item.category}</p>
				<CardTitle className="group-hover:text-primary mt-2.5 transition-colors">
					<Link href={item.href as Route} prefetch={false}>
						{item.title}
					</Link>
				</CardTitle>
				<CardDescription className="line-clamp-3">
					{item.description}
				</CardDescription>
				<Link
					className="text-primary mt-4 inline-flex items-center gap-2 text-sm font-bold"
					href={item.href as Route}
					prefetch={false}
				>
					{variant === "service" ? "Learn more" : "Read guide"}
					<ArrowRight
						aria-hidden="true"
						className="size-4 transition-transform group-hover:translate-x-1"
					/>
				</Link>
			</CardHeader>

			{/*
			 * Extended footer band: same card width/radius/border as the body,
			 * with a soft copper-tinted ground so the silhouette still reads as one card.
			 */}
			<div className="card-foot border-border border-t bg-[color-mix(in_srgb,var(--muted)_86%,var(--primary)_14%)]">
				<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
					{showViews ? (
						<PageViewsStat
							preferTrending={preferTrending}
							totalViews={item.totalViews}
							trendingScore={item.trendingScore}
							uniqueViews={item.uniqueViews}
						/>
					) : (
						<span className="text-muted-foreground font-mono text-[0.6875rem] tracking-[0.08em] uppercase">
							{variant === "service" ? "Local service" : "Homeowner guide"}
						</span>
					)}
					{showDate ? (
						<p className="type-meta inline-flex items-center gap-2 font-bold">
							<CalendarDays
								aria-hidden="true"
								className="text-primary size-3.5 shrink-0"
							/>
							{item.date}
						</p>
					) : null}
				</div>
			</div>
		</Card>
	)
}
