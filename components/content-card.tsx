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
import { cn } from "@/lib/utils"

function formatCardDate(date: string) {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		timeZone: "UTC",
	}).format(new Date(`${date}T00:00:00Z`))
}

export function ContentCard({
	item,
	variant,
	preferTrending = false,
	featured = false,
}: {
	item: ArchiveItem
	variant: "service" | "tip"
	preferTrending?: boolean
	/** Lead card of an archive page: spans the row, photo beside the copy when wide. */
	featured?: boolean
}) {
	const image =
		variant === "service"
			? getServiceImage(item.category, item.image)
			: (item.image ?? "/images/work/precision-valve-installation.webp")

	const showViews = hasPageViews(item)
	const showDate = variant === "tip" && Boolean(item.date)

	const media = (
		<Link
			prefetch={false}
			aria-label={
				variant === "service" ? `View ${item.title}` : `Read ${item.title}`
			}
			className="card-media bg-muted relative block aspect-16/9 overflow-hidden"
			href={item.href as Route}

			tabIndex={-1}
		>
			<Image
				alt={item.imageAlt ?? `${item.title}, Wade's Plumbing & Septic`}
				className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
				fill
				quality={60}
				sizes={
					featured
						? "(min-width: 1024px) 40rem, 100vw"
						: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
				}
				src={image}
			/>
			<span className="card-chip">{item.category}</span>
		</Link>
	)

	const copy = (
		<>
			<CardHeader className="flex-1 pb-[var(--space-card)]">
				<CardTitle className="group-hover:text-primary transition-colors">
					<Link prefetch={false} href={item.href as Route}>
						{item.title}
					</Link>
				</CardTitle>
				<CardDescription className={featured ? undefined : "line-clamp-3"}>
					{item.description}
				</CardDescription>
				<Link
					prefetch={false}
					className="text-primary mt-4 inline-flex items-center gap-2 text-sm font-bold"
					href={item.href as Route}
				>
					{variant === "service" ? "Learn more" : "Read guide"}
					<ArrowRight
						aria-hidden="true"
						className="size-4 transition-transform group-hover:translate-x-1"
					/>
				</Link>
			</CardHeader>

			{showViews || showDate ? (
				<div className="card-foot border-border text-muted-foreground border-t">
					<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
						{showViews ? (
							<PageViewsStat
								className="text-inherit"
								preferTrending={preferTrending}
								totalViews={item.totalViews}
								trendingScore={item.trendingScore}
								uniqueViews={item.uniqueViews}
							/>
						) : (
							<span />
						)}
						{showDate && item.date ? (
							<p className="type-meta inline-flex items-center gap-2 font-bold text-inherit">
								<CalendarDays
									aria-hidden="true"
									className="text-primary size-3.5 shrink-0"
								/>
								<time dateTime={item.date}>{formatCardDate(item.date)}</time>
							</p>
						) : null}
					</div>
				</div>
			) : null}
		</>
	)

	return (
		<Card
			className={cn(
				"group hover:border-border-strong h-full overflow-hidden transition-colors duration-200",
				featured && "card-featured",
			)}
		>
			{featured ? (
				<div className="card-featured-body">
					{media}
					<div className="card-featured-copy">{copy}</div>
				</div>
			) : (
				<>
					{media}
					{copy}
				</>
			)}
		</Card>
	)
}
