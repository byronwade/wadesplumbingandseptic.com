"use client"

import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react"
import { startTransition, useEffect, useMemo } from "react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	type ArchiveItem,
	buildArchiveFilters,
	filterArchiveItems,
	paginateArchiveItems,
} from "@/lib/archive"
import { getServiceImage } from "@/lib/service-images"
import { cn } from "@/lib/utils"

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

function ArchiveCard({
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
					quality={60}
					sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
					src={image}
				/>
			</Link>
			<CardHeader>
				<Badge className="w-fit" tone="muted">
					{item.category}
				</Badge>
				<CardTitle className="group-hover:text-primary mt-3 transition-colors">
					<Link href={item.href as Route} prefetch={false}>
						{item.title}
					</Link>
				</CardTitle>
				<CardDescription>{item.description}</CardDescription>
			</CardHeader>
			<CardContent className="mt-auto">
				{variant === "tip" && item.date ? (
					<p className="text-muted-foreground mb-4 flex items-center gap-2 text-xs font-bold">
						<CalendarDays className="text-primary size-4" />
						{item.date}
					</p>
				) : null}
				<Link
					className="text-primary inline-flex items-center gap-2 text-sm font-extrabold"
					href={item.href as Route}
					prefetch={false}
				>
					{variant === "service" ? "Learn more" : "Read guide"}
					<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
				</Link>
			</CardContent>
		</Card>
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
}: {
	items: ArchiveItem[]
	variant: "service" | "tip"
	pageSize?: number
	allLabel?: string
	emptyLabel?: string
	noun?: { singular: string; plural: string }
	showFilters?: boolean
}) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const activeCategory = searchParams.get("category")
	const requestedPage = parsePage(searchParams.get("page"))

	const filters = useMemo(() => buildArchiveFilters(items), [items])
	const canFilter = showFilters && filters.length > 1
	const filtered = useMemo(
		() => (canFilter ? filterArchiveItems(items, activeCategory) : items),
		[items, activeCategory, canFilter],
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
		next: { category?: string | null; page?: number },
		options?: { scrollToFilters?: boolean },
	) {
		const params = new URLSearchParams(searchParams.toString())

		if ("category" in next) {
			if (!next.category || next.category === "all") params.delete("category")
			else params.set("category", next.category)
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

	return (
		<section className="container-shell section-y">
			<div className="border-border mb-8 border-b pb-5" id="archive-filters">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<p className="type-eyebrow">{countLabel}</p>
						<h2 className="mt-2 text-3xl font-extrabold tracking-[-0.03em]">
							{activeFilter && canFilter ? activeFilter.label : allLabel}
						</h2>
					</div>
					{canFilter ? (
						<p className="text-muted-foreground text-sm lg:max-w-sm lg:text-right">
							Filter instantly, then page through results.
						</p>
					) : null}
				</div>

				{canFilter ? (
					<div
						aria-label="Filter by category"
						className="mt-5 flex [scrollbar-width:none] gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
						role="tablist"
					>
						<button
							aria-selected={!activeCategory || activeCategory === "all"}
							className={cn(
								"inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-bold transition-colors",
								!activeCategory || activeCategory === "all"
									? "border-ink bg-ink text-white"
									: "border-border bg-card text-foreground hover:border-foreground/25 hover:bg-muted",
							)}
							onClick={() => updateParams({ category: "all" })}
							role="tab"
							type="button"
						>
							{allLabel}
							<span
								className={cn(
									"rounded px-1.5 py-0.5 text-xs font-extrabold tabular-nums",
									!activeCategory || activeCategory === "all"
										? "bg-white/15 text-white"
										: "bg-muted text-muted-foreground",
								)}
							>
								{items.length}
							</span>
						</button>
						{filters.map((filter) => {
							const selected = activeCategory === filter.key
							return (
								<button
									aria-selected={selected}
									className={cn(
										"inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-bold transition-colors",
										selected
											? "border-ink bg-ink text-white"
											: "border-border bg-card text-foreground hover:border-foreground/25 hover:bg-muted",
									)}
									key={filter.key}
									onClick={() => updateParams({ category: filter.key })}
									role="tab"
									type="button"
								>
									{filter.label}
									<span
										className={cn(
											"rounded px-1.5 py-0.5 text-xs font-extrabold tabular-nums",
											selected
												? "bg-white/15 text-white"
												: "bg-muted text-muted-foreground",
										)}
									>
										{filter.count}
									</span>
								</button>
							)
						})}
					</div>
				) : null}
			</div>

			{pageItems.length ? (
				<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
					{pageItems.map((item) => (
						<ArchiveCard item={item} key={item.slug} variant={variant} />
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
					className="border-border mt-10 flex flex-col items-stretch justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center"
				>
					<p className="text-muted-foreground text-sm font-bold tabular-nums">
						Page {page} of {pageCount}
						<span className="text-muted-foreground/80 font-medium">
							{" "}
							· showing {(page - 1) * pageSize + 1}–
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
