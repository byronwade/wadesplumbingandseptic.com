import { Eye, Gauge } from "@/components/icons"
import { cn } from "@/lib/utils"

export type PageViewsStatProps = {
	uniqueViews?: number
	totalViews?: number
	trendingScore?: number
	/** Emphasize the 7-day trend figure (trending archives). */
	preferTrending?: boolean
	className?: string
	/** Dark surfaces (hero meta, float panels). */
	tone?: "default" | "on-dark"
}

function formatCount(count: number) {
	return new Intl.NumberFormat("en-US").format(count)
}

export function hasPageViews(stats: {
	uniqueViews?: number
	totalViews?: number
	trendingScore?: number
}) {
	return (
		(stats.uniqueViews ?? 0) > 0 ||
		(stats.totalViews ?? 0) > 0 ||
		(stats.trendingScore ?? 0) > 0
	)
}

/**
 * Compact page-view readout for cards and detail meta.
 * Prefers unique viewers; can surface weekly trend on trending surfaces.
 */
export function PageViewsStat({
	uniqueViews = 0,
	totalViews = 0,
	trendingScore = 0,
	preferTrending = false,
	className,
	tone = "default",
}: PageViewsStatProps) {
	const showTrend = preferTrending && trendingScore > 0
	const showUnique = uniqueViews > 0
	const showTotal = !showUnique && totalViews > 0

	if (!showTrend && !showUnique && !showTotal) return null

	const muted =
		tone === "on-dark" ? "text-on-dark-subtle" : "text-muted-foreground"
	const icon =
		tone === "on-dark" ? "text-primary-bright" : "text-primary"

	if (showTrend) {
		return (
			<p
				className={cn(
					"inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.08em] uppercase tabular-nums",
					muted,
					className,
				)}
			>
				<Gauge aria-hidden="true" className={cn("size-3.5 shrink-0", icon)} />
				<span>
					{formatCount(trendingScore)}{" "}
					{trendingScore === 1 ? "reader" : "readers"} this week
					{showUnique ? (
						<span className="opacity-70">
							{" "}
							· {formatCount(uniqueViews)} unique
						</span>
					) : null}
				</span>
			</p>
		)
	}

	const count = showUnique ? uniqueViews : totalViews
	const label = showUnique
		? count === 1
			? "unique view"
			: "unique views"
		: count === 1
			? "view"
			: "views"

	return (
		<p
			className={cn(
				"inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.08em] uppercase tabular-nums",
				muted,
				className,
			)}
		>
			<Eye aria-hidden="true" className={cn("size-3.5 shrink-0", icon)} />
			<span>
				{formatCount(count)} {label}
			</span>
		</p>
	)
}
