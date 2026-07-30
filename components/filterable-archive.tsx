"use client"

import type { Route } from "next"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight } from "@/components/icons"
import { startTransition, useEffect, useMemo } from "react"

import { ContentCard } from "@/components/content-card"
import { buttonVariants } from "@/components/ui/button"
import {
	type ArchiveItem,
	buildArchiveFilters,
	filterArchiveItems,
	paginateArchiveItems,
} from "@/lib/archive"
import {
	parseArchiveSort,
	sortArchiveItems,
	type ArchiveSort,
	type RankedArchiveItem,
} from "@/lib/page-views/ranking"
import { cn } from "@/lib/utils"

const SORT_OPTIONS: Array<{ value: ArchiveSort; label: string }> = [
	{ value: "default", label: "Default" },
	{ value: "popular", label: "Most popular" },
	{ value: "trending", label: "Trending" },
	{ value: "newest", label: "Newest" },
]

const DEFAULT_PAGE_SIZE = 12

function parsePage(value: string | null) {
	const page = Number(value ?? "1")
	return Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1
}

function hrefWithParams(pathname: string, params: URLSearchParams) {
	const query = params.toString()
	// Query-string URLs aren't in the typed Routes union; pathname is always a
	// known archive route (/services, /expert-tips, etc.).
	return (query ? `${pathname}?${query}` : pathname) as Route
}

/*
 * One chip, both call sites. The "all" chip and the per-category chips were
 * separate copies of the same 20 lines of classes, so they drifted apart.
 */
function FilterChip({
	label,
	count,
	selected,
	onSelect,
}: {
	label: string
	count: number
	selected: boolean
	onSelect: () => void
}) {
	return (
		<button
			aria-selected={selected}
			className={cn(
				"focus-visible:ring-ring inline-flex shrink-0 items-center gap-2 rounded-md border px-3.5 py-2 text-sm font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]",
				selected
					? "border-ink bg-ink text-white"
					: "border-border-strong bg-card text-foreground hover:border-primary/40 hover:bg-muted",
			)}
			onClick={onSelect}
			role="tab"
			type="button"
		>
			{label}
			<span
				className={cn(
					"font-mono text-[0.6875rem] tabular-nums",
					selected ? "text-white/60" : "text-muted-foreground",
				)}
			>
				{count}
			</span>
		</button>
	)
}

export function FilterableArchive({
	items,
	variant,
	pageSize = DEFAULT_PAGE_SIZE,
	allLabel = "All",
	emptyLabel = "No results in this filter.",
	noun = { singular: "item", plural: "items" },
	showFilters = true,
	showSort = false,
	lockedSort = false,
}: {
	items: ArchiveItem[]
	variant: "service" | "tip"
	pageSize?: number
	allLabel?: string
	emptyLabel?: string
	noun?: { singular: string; plural: string }
	showFilters?: boolean
	showSort?: boolean
	lockedSort?: boolean
}) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const activeCategory = searchParams.get("category")
	const requestedPage = parsePage(searchParams.get("page"))
	const activeSort = lockedSort
		? parseArchiveSort(
				pathname.endsWith("/trending")
					? "trending"
					: pathname.endsWith("/popular")
						? "popular"
						: searchParams.get("sort"),
			)
		: parseArchiveSort(searchParams.get("sort"))

	const filters = useMemo(() => buildArchiveFilters(items), [items])
	const canFilter = showFilters && filters.length > 1
	const sorted = useMemo(() => {
		const ranked = items.map((item) => ({
			...item,
			uniqueViews: item.uniqueViews ?? 0,
			totalViews: item.totalViews ?? 0,
			trendingScore: item.trendingScore ?? 0,
		})) satisfies RankedArchiveItem[]
		return sortArchiveItems(ranked, activeSort)
	}, [items, activeSort])
	const filtered = useMemo(
		() => (canFilter ? filterArchiveItems(sorted, activeCategory) : sorted),
		[sorted, activeCategory, canFilter],
	)
	const { page, pageCount, pageItems, total } = useMemo(
		() => paginateArchiveItems(filtered, requestedPage, pageSize),
		[filtered, requestedPage, pageSize],
	)

	useEffect(() => {
		if (requestedPage === page) return
		const params = new URLSearchParams(searchParams.toString())
		if (page <= 1) params.delete("page")
		else params.set("page", String(page))
		router.replace(hrefWithParams(pathname, params), { scroll: false })
	}, [page, pathname, requestedPage, router, searchParams])

	function updateParams(
		next: {
			category?: string | null
			page?: number
			sort?: ArchiveSort | null
		},
		options?: { scrollToFilters?: boolean },
	) {
		const params = new URLSearchParams(searchParams.toString())

		if ("category" in next) {
			if (!next.category || next.category === "all") params.delete("category")
			else params.set("category", next.category)
			params.delete("page")
		}

		if ("sort" in next) {
			if (!next.sort || next.sort === "default") params.delete("sort")
			else params.set("sort", next.sort)
			params.delete("page")
		}

		if ("page" in next && typeof next.page === "number") {
			if (next.page <= 1) params.delete("page")
			else params.set("page", String(next.page))
		}

		startTransition(() => {
			router.replace(hrefWithParams(pathname, params), { scroll: false })
			if (options?.scrollToFilters) {
				document
					.getElementById("archive-filters")
					?.scrollIntoView({ behavior: "smooth", block: "start" })
			}
		})
	}

	const countLabel = `${total} ${total === 1 ? noun.singular : noun.plural}`
	const activeFilter = filters.find((filter) => filter.key === activeCategory)

	const allSelected = !activeCategory || activeCategory === "all"
	const sortVisible = showSort && !lockedSort

	return (
		<section className="container-shell section-y">
			<div
				className="border-border mb-[var(--space-block)] border-b pb-5"
				id="archive-filters"
			>
				<div className="section-head-row">
					<div className="section-head">
						<p className="spec-label">{countLabel}</p>
						<h2 className="type-title">
							{activeFilter && canFilter ? activeFilter.label : allLabel}
						</h2>
					</div>
					{canFilter || sortVisible ? (
						<p className="type-meta md:max-w-xs md:text-right">
							{sortVisible
								? "Sort by popularity or filter by category."
								: "Filter instantly, then page through results."}
						</p>
					) : null}
				</div>

				{sortVisible ? (
					<div className="mt-6 flex flex-wrap items-center gap-2">
						<p className="spec-tag mr-1">Sort</p>
						{SORT_OPTIONS.filter((option) =>
							variant === "service" ? option.value !== "newest" : true,
						).map((option) => (
							<button
								className={cn(
									"focus-visible:ring-ring inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]",
									activeSort === option.value
										? "border-primary bg-primary text-primary-foreground"
										: "border-border-strong bg-card text-foreground hover:border-primary/40 hover:bg-muted",
								)}
								key={option.value}
								onClick={() => updateParams({ sort: option.value })}
								type="button"
							>
								{option.label}
							</button>
						))}
					</div>
				) : null}

				{canFilter ? (
					<div
						aria-label="Filter by category"
						className="chip-rail mt-6"
						role="tablist"
					>
						<FilterChip
							count={items.length}
							label={allLabel}
							onSelect={() => updateParams({ category: "all" })}
							selected={allSelected}
						/>
						{filters.map((filter) => (
							<FilterChip
								count={filter.count}
								key={filter.key}
								label={filter.label}
								onSelect={() => updateParams({ category: filter.key })}
								selected={activeCategory === filter.key}
							/>
						))}
					</div>
				) : null}
			</div>

			{pageItems.length ? (
				<div className="card-rail defer-paint">
					{pageItems.map((item) => (
						<ContentCard
							item={item}
							key={item.slug}
							preferTrending={activeSort === "trending"}
							variant={variant}
						/>
					))}
				</div>
			) : (
				<p className="text-muted-foreground py-16 text-center text-sm font-bold">
					{emptyLabel}
				</p>
			)}

			{pageCount > 1 ? (
				<nav
					aria-label="Pagination"
					className="border-border mt-[var(--space-block)] flex flex-col items-stretch justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center"
				>
					<p className="type-meta font-bold tabular-nums">
						Page {page} of {pageCount}
						<span className="text-muted-foreground/80 font-medium">
							{" "}
							· showing {(page - 1) * pageSize + 1} to{" "}
							{Math.min(page * pageSize, total)} of {total}
						</span>
					</p>
					<div className="flex items-center gap-2">
						<button
							className={cn(
								buttonVariants({ variant: "outline", size: "sm" }),
								"min-w-28",
							)}
							disabled={page <= 1}
							onClick={() =>
								updateParams({ page: page - 1 }, { scrollToFilters: true })
							}
							type="button"
						>
							<ArrowLeft />
							Previous
						</button>
						<button
							className={cn(
								buttonVariants({ variant: "outline", size: "sm" }),
								"min-w-28",
							)}
							disabled={page >= pageCount}
							onClick={() =>
								updateParams({ page: page + 1 }, { scrollToFilters: true })
							}
							type="button"
						>
							Next
							<ArrowRight />
						</button>
					</div>
				</nav>
			) : null}
		</section>
	)
}
