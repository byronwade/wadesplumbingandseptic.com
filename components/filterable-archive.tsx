"use client"

import type { Route } from "next"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, ChevronDown } from "@/components/icons"
import {
	startTransition,
	useEffect,
	useMemo,
	type ReactNode,
} from "react"

import { ContentCard } from "@/components/content-card"
import { buttonVariants } from "@/components/ui/button"
import {
	type ArchiveItem,
	buildArchiveFilters,
	filterArchiveItems,
	paginateArchiveItems,
	resolveArchiveCategory,
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
			aria-pressed={selected}
			className={cn(
				"focus-visible:ring-ring inline-flex shrink-0 items-center gap-2 rounded-md border px-3.5 py-2 text-sm font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]",
				selected
					? "border-ink bg-ink text-white"
					: "border-border-strong bg-card text-foreground hover:border-primary/40 hover:bg-muted",
			)}
			onClick={onSelect}
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

function ArchiveSelect({
	id,
	label,
	value,
	onChange,
	children,
}: {
	id: string
	label: string
	value: string
	onChange: (value: string) => void
	children: ReactNode
}) {
	return (
		<label className="grid gap-1.5" htmlFor={id}>
			<span className="text-muted-foreground font-mono text-[0.6875rem] font-semibold tracking-[0.12em] uppercase">
				{label}
			</span>
			<span className="relative block">
				<select
					className="border-border-strong bg-card text-foreground focus-visible:ring-ring w-full appearance-none rounded-md border py-3 pr-11 pl-3.5 text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]"
					id={id}
					onChange={(event) => onChange(event.target.value)}
					value={value}
				>
					{children}
				</select>
				<ChevronDown
					aria-hidden="true"
					className="text-muted-foreground pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2"
				/>
			</span>
		</label>
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

	const requestedCategory = searchParams.get("category")
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
	const activeCategory = resolveArchiveCategory(filters, requestedCategory)
	const canFilter = showFilters && filters.length > 1
	const sortOptions = useMemo(
		() =>
			SORT_OPTIONS.filter((option) =>
				variant === "service" ? option.value !== "newest" : true,
			),
		[variant],
	)
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
		const params = new URLSearchParams(searchParams.toString())
		let dirty = false

		/* Drop stale/unknown category keys so the select is never blank. */
		if (
			requestedCategory &&
			requestedCategory !== "all" &&
			activeCategory === null
		) {
			params.delete("category")
			dirty = true
		}

		if (requestedPage !== page) {
			if (page <= 1) params.delete("page")
			else params.set("page", String(page))
			dirty = true
		}

		if (!dirty) return
		router.replace(hrefWithParams(pathname, params), { scroll: false })
	}, [
		activeCategory,
		page,
		pathname,
		requestedCategory,
		requestedPage,
		router,
		searchParams,
	])

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
	const heading =
		activeFilter && canFilter ? activeFilter.label : allLabel
	const allSelected = activeCategory === null
	const sortVisible = showSort && !lockedSort
	const activeSortLabel =
		sortOptions.find((option) => option.value === activeSort)?.label ??
		"Default"
	const showControls = canFilter || sortVisible

	return (
		<section className="container-shell section-y">
			<div
				className="border-border mb-[var(--space-block)] border-b pb-6"
				id="archive-filters"
			>
				<div className="section-head">
					<p className="spec-label">{countLabel}</p>
					<h2 className="type-title">{heading}</h2>
					{sortVisible && activeSort !== "default" ? (
						<p className="type-meta text-muted-foreground">
							Sorted by {activeSortLabel.toLowerCase()}
						</p>
					) : null}
				</div>

				{showControls ? (
					<>
						{/*
						  Mobile: two labeled selects. Clear job per control, no chip
						  wall, native picker on iOS/Android.
						*/}
						<div className="mt-6 grid gap-3 sm:hidden">
							{canFilter ? (
								<ArchiveSelect
									id="archive-category"
									label="Category"
									onChange={(value) => updateParams({ category: value })}
									value={activeCategory ?? "all"}
								>
									<option value="all">
										{allLabel} ({items.length})
									</option>
									{filters.map((filter) => (
										<option key={filter.key} value={filter.key}>
											{filter.label} ({filter.count})
										</option>
									))}
								</ArchiveSelect>
							) : null}
							{sortVisible ? (
								<ArchiveSelect
									id="archive-sort"
									label="Sort"
									onChange={(value) =>
										updateParams({ sort: value as ArchiveSort })
									}
									value={activeSort}
								>
									{sortOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</ArchiveSelect>
							) : null}
						</div>

						{/* Desktop: chips stay glanceable when there is room. */}
						<div className="mt-6 hidden space-y-5 sm:block">
							{sortVisible ? (
								<div className="flex flex-wrap items-center gap-2">
									<p className="spec-tag mr-1">Sort</p>
									{sortOptions.map((option) => (
										<button
											aria-pressed={activeSort === option.value}
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
									className="chip-rail"
									role="group"
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
											onSelect={() =>
												updateParams({ category: filter.key })
											}
											selected={activeCategory === filter.key}
										/>
									))}
								</div>
							) : null}
						</div>
					</>
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
						<span className="text-muted-foreground/80 font-normal">
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
