"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import * as React from "react"
import {
	ArrowUpRight,
	BookOpen,
	CornerDownLeft,
	FileText,
	Hash,
	MapPin,
	Phone,
	Search,
	Sparkles,
	Wrench,
	X,
} from "@/components/icons"

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { getCachedSearchIndex, loadSearchIndex } from "@/lib/search-client"
import {
	groupSearchHits,
	highlightMatches,
	searchDocuments,
	suggestSearches,
	type SearchDocument,
	type SearchHit,
	type SearchResultType,
} from "@/lib/search"

const GROUP_ORDER: SearchResultType[] = ["service", "tip", "page", "action"]

/** Shared column so header, input, results, and footer share one edge. */
const SEARCH_SHELL = "mx-auto w-full max-w-[90rem] px-4 sm:px-8 lg:px-10"

const GROUP_META: Record<
	SearchResultType,
	{ label: string; icon: React.ComponentType<{ className?: string }> }
> = {
	service: { label: "Services", icon: Wrench },
	tip: { label: "Expert Tips", icon: BookOpen },
	page: { label: "Pages", icon: FileText },
	action: { label: "Quick actions", icon: Sparkles },
}

const TYPE_BADGE: Record<SearchResultType, string> = {
	service: "Service",
	tip: "Tip",
	page: "Page",
	action: "Action",
}

function ResultIcon({ doc }: { doc: SearchDocument }) {
	if (doc.type === "action") {
		if (doc.id === "action:call")
			return <Phone className="size-5" aria-hidden />
		if (doc.id.includes("area"))
			return <MapPin className="size-5" aria-hidden />
		return <Hash className="size-5" aria-hidden />
	}
	if (doc.type === "service") return <Wrench className="size-5" aria-hidden />
	if (doc.type === "tip") return <BookOpen className="size-5" aria-hidden />
	return <FileText className="size-5" aria-hidden />
}

function HighlightedTitle({ title, query }: { title: string; query: string }) {
	const parts = query.trim()
		? highlightMatches(title, query)
		: [{ text: title, match: false }]

	return (
		<span>
			{parts.map((part, index) =>
				part.match ? (
					<mark
						key={`${part.text}-${index}`}
						className="rounded-sm bg-[color-mix(in_srgb,var(--primary-bright)_28%,transparent)] text-inherit"
					>
						{part.text}
					</mark>
				) : (
					<span key={`${part.text}-${index}`}>{part.text}</span>
				),
			)}
		</span>
	)
}

function ResultCard({
	hit,
	query,
	active,
	onHover,
	onSelect,
}: {
	hit: SearchHit
	query: string
	active: boolean
	onHover: () => void
	onSelect: () => void
}) {
	return (
		<button
			type="button"
			id={`search-option-${hit.id}`}
			role="option"
			aria-selected={active}
			onMouseEnter={onHover}
			onFocus={onHover}
			onClick={onSelect}
			className={cn(
				"group grid w-full grid-cols-[5.5rem_minmax(0,1fr)] items-stretch gap-0 overflow-hidden rounded-md text-left transition-[background-color,transform] duration-75 sm:grid-cols-[7.5rem_minmax(0,1fr)]",
				"bg-white/[0.04] hover:bg-white/[0.07] active:scale-[0.995]",
				active &&
					"bg-white/[0.09] ring-1 ring-[color-mix(in_srgb,var(--primary-bright)_55%,transparent)]",
			)}
		>
			<div
				className={cn(
					"relative min-h-[5.5rem] sm:min-h-[7rem]",
					hit.image
						? "bg-dark-2"
						: "bg-[color-mix(in_srgb,var(--primary)_22%,var(--dark-2))] text-[var(--primary-bright)]",
				)}
			>
				{hit.image ? (
					<Image
						src={hit.image}
						alt={hit.title}
						fill
						className="object-cover transition-transform duration-150 group-hover:scale-[1.03]"
						sizes="120px"
					/>
				) : (
					<div className="absolute inset-0 flex items-center justify-center">
						<ResultIcon doc={hit} />
					</div>
				)}
			</div>

			<div className="flex min-w-0 flex-col justify-center px-3.5 py-3 sm:px-5 sm:py-4">
				<div className="flex items-center gap-2">
					<span className="spec-tag text-primary-bright">
						{TYPE_BADGE[hit.type]}
					</span>
					{hit.matchLabel === "Closest match" ? (
						<span className="type-meta text-on-dark-subtle truncate">
							Closest match
						</span>
					) : hit.category ? (
						<span className="type-meta text-on-dark-subtle truncate">
							{hit.category}
						</span>
					) : null}
				</div>
				<p className="font-display mt-1.5 text-[1.0625rem] leading-tight font-extrabold tracking-[-0.03em] text-white sm:text-[1.1875rem]">
					<HighlightedTitle title={hit.title} query={query} />
				</p>
				<p className="text-on-dark-subtle mt-1 line-clamp-2 text-sm leading-snug">
					{hit.description}
				</p>
				<div className="text-on-dark-subtle mt-2 flex items-center gap-1 text-xs font-bold transition-colors group-hover:text-[var(--primary-bright)]">
					Open
					<ArrowUpRight className="size-3.5" aria-hidden />
				</div>
			</div>
		</button>
	)
}

export function GlobalSearch({
	open,
	onOpenChange,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	const router = useRouter()
	const inputRef = React.useRef<HTMLInputElement>(null)
	const [query, setQuery] = React.useState("")
	const [index, setIndex] = React.useState<SearchDocument[] | null>(() =>
		getCachedSearchIndex(),
	)
	const [error, setError] = React.useState<string | null>(null)
	const [activeIndex, setActiveIndex] = React.useState(0)
	const loading = open && index === null && error === null

	const handleOpenChange = (next: boolean) => {
		if (!next) {
			setQuery("")
			setActiveIndex(0)
			setError(null)
		}
		onOpenChange(next)
	}

	React.useLayoutEffect(() => {
		if (!open) return
		inputRef.current?.focus({ preventScroll: true })
	}, [open])

	React.useEffect(() => {
		if (!open) return
		if (index) return

		let cancelled = false
		void loadSearchIndex().then((data) => {
			if (cancelled) return
			if (data) {
				setIndex(data)
				setError(null)
				return
			}
			setError("Search is temporarily unavailable.")
		})

		return () => {
			cancelled = true
		}
	}, [open, index])

	const hits = React.useMemo(() => {
		if (!index) return [] as SearchHit[]
		return searchDocuments(index, query, query.trim() ? 28 : 10)
	}, [index, query])

	const suggestions = React.useMemo(() => suggestSearches(query, 8), [query])
	const grouped = React.useMemo(() => groupSearchHits(hits), [hits])
	const flatHits = React.useMemo(
		() => GROUP_ORDER.flatMap((key) => grouped[key]),
		[grouped],
	)
	const safeActiveIndex =
		flatHits.length === 0 ? 0 : Math.min(activeIndex, flatHits.length - 1)

	const runHit = (hit: SearchHit) => {
		setQuery("")
		setActiveIndex(0)
		setError(null)
		onOpenChange(false)
		if (hit.href.startsWith("tel:")) {
			window.location.href = hit.href
			return
		}
		router.push(hit.href as never)
	}

	const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Escape") {
			event.preventDefault()
			handleOpenChange(false)
			return
		}

		if (!flatHits.length) return

		if (event.key === "ArrowDown") {
			event.preventDefault()
			setActiveIndex((current) => (current + 1) % flatHits.length)
			return
		}

		if (event.key === "ArrowUp") {
			event.preventDefault()
			setActiveIndex((current) =>
				current === 0 ? flatHits.length - 1 : current - 1,
			)
			return
		}

		if (event.key === "Enter") {
			event.preventDefault()
			const hit = flatHits[safeActiveIndex]
			if (hit) runHit(hit)
		}
	}

	const showEmpty =
		!(loading || error) && Boolean(query.trim()) && flatHits.length === 0
	const showPopular = !query.trim() && flatHits.length > 0

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent
				showCloseButton={false}
				className={cn(
					"bg-ink fixed inset-0 top-0 left-0 z-50 flex h-[100dvh] max-h-[100dvh] w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 p-0 text-white shadow-none duration-0",
					"!animate-none data-[state=closed]:!animate-none data-[state=open]:!animate-none",
					"focus:outline-none",
				)}
				overlayClassName="!animate-none bg-ink/90 duration-0 backdrop-blur-[2px] data-[state=closed]:!animate-none data-[state=open]:!animate-none"
				onOpenAutoFocus={(event) => {
					event.preventDefault()
					inputRef.current?.focus({ preventScroll: true })
				}}
			>
				<div
					aria-hidden
					className="tex-glow bg-ink pointer-events-none absolute inset-0"
				/>

				<div className="relative flex h-full min-h-0 flex-col">
					<header className="shrink-0 pt-[max(0.85rem,env(safe-area-inset-top))] sm:pt-5">
						<div
							className={cn(
								SEARCH_SHELL,
								"flex items-center justify-between gap-3 pb-3",
							)}
						>
							<div className="min-w-0">
								<p className="spec-label">Wade&apos;s</p>
								<DialogTitle className="type-headline mt-2 text-white">
									Looking for something?
								</DialogTitle>
								<DialogDescription className="sr-only">
									Search services, expert tips, pages, and quick actions.
								</DialogDescription>
							</div>

							<DialogClose className="text-on-dark-muted flex size-11 shrink-0 items-center justify-center rounded-md transition-colors duration-75 hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-[var(--primary-bright)] focus-visible:outline-none">
								<X className="size-5" />
								<span className="sr-only">Close search</span>
							</DialogClose>
						</div>
					</header>

					<div className="shrink-0">
						<div className={SEARCH_SHELL}>
							<label className="relative block">
								<span className="sr-only">Search services and tips</span>
								<Search
									className="pointer-events-none absolute top-1/2 left-0 size-6 -translate-y-1/2 text-[var(--primary-bright)] sm:size-7"
									aria-hidden
								/>
								<input
									ref={inputRef}
									value={query}
									onChange={(event) => {
										const value = event.target.value
										setActiveIndex(0)
										setQuery(value)
									}}
									onKeyDown={onKeyDown}
									placeholder="Service, tip, symptom, or city…"
									autoComplete="off"
									autoCorrect="off"
									spellCheck={false}
									enterKeyHint="search"
									role="combobox"
									aria-expanded={flatHits.length > 0}
									aria-controls="global-search-results"
									aria-activedescendant={
										flatHits[safeActiveIndex]
											? `search-option-${flatHits[safeActiveIndex].id}`
											: undefined
									}
									className="font-display h-16 w-full border-0 border-b border-white/15 bg-transparent pr-4 pl-10 text-[1.35rem] font-extrabold tracking-[-0.03em] text-white caret-[var(--primary-bright)] outline-none placeholder:font-bold placeholder:text-white/30 focus:border-[var(--primary-bright)] sm:h-[4.5rem] sm:pl-12 sm:text-[2rem]"
								/>
							</label>

							<div className="mt-3 flex items-center justify-between gap-3">
								<div className="chip-rail min-w-0 flex-1">
									{suggestions.map((suggestion) => (
										<button
											key={suggestion}
											type="button"
											onClick={() => {
												setQuery(suggestion)
												setActiveIndex(0)
												inputRef.current?.focus()
											}}
											className="spec-tag text-on-dark-muted hover:text-primary-bright shrink-0 border border-white/10 bg-white/[0.04] px-3 py-1.5 transition-colors duration-75 hover:border-white/20 hover:bg-white/[0.07]"
										>
											{suggestion}
										</button>
									))}
								</div>
								<p className="text-on-dark-subtle hidden shrink-0 items-center gap-1.5 text-xs sm:flex">
									<span className="inline-flex items-center gap-1 rounded-sm bg-white/[0.05] px-1.5 py-0.5 font-sans">
										<CornerDownLeft className="size-3" aria-hidden /> Enter
									</span>
									<span>to open</span>
								</p>
							</div>
						</div>
					</div>

					<div
						id="global-search-results"
						role="listbox"
						className="mt-5 min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4 sm:mt-7 sm:pb-6"
					>
						<div className={SEARCH_SHELL}>
							{loading ? (
								<p className="text-on-dark-subtle py-16 text-center text-sm">
									Warming up search…
								</p>
							) : null}

							{error ? (
								<p className="text-on-dark-subtle py-16 text-center text-sm">
									{error}
								</p>
							) : null}

							{showEmpty ? (
								<div className="section-head mx-auto max-w-lg py-14 text-center">
									<p className="type-title text-white">
										Nothing for “{query.trim()}”
									</p>
									<p className="type-lead text-on-dark-muted">
										Try a symptom, city, or service name. Typos are OK; we
										surface the closest matches when we can.
									</p>
								</div>
							) : null}

							{!(loading || error) && flatHits.length > 0 ? (
								<div className="space-y-7">
									<div className="flex items-end justify-between gap-3">
										<p className="spec-tag text-on-dark-subtle">
											{showPopular
												? "Start here"
												: `${flatHits.length} match${flatHits.length === 1 ? "" : "es"}`}
										</p>
										<p className="text-xs text-white/30 sm:hidden">
											Tap a result
										</p>
									</div>

									{GROUP_ORDER.map((key) => {
										const groupHits = grouped[key]
										if (!groupHits.length) return null
										const meta = GROUP_META[key]
										const Icon = meta.icon
										return (
											<section key={key} aria-label={meta.label}>
												{showPopular ? null : (
													<div className="mb-2.5 flex items-center gap-2">
														<Icon
															className="size-3.5 text-[var(--primary-bright)]"
															aria-hidden
														/>
														<h3 className="spec-tag text-on-dark-subtle">
															{meta.label}
														</h3>
													</div>
												)}
												<ul className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3">
													{groupHits.map((hit) => {
														const flatIndex = flatHits.findIndex(
															(item) => item.id === hit.id,
														)
														return (
															<li key={hit.id}>
																<ResultCard
																	hit={hit}
																	query={query}
																	active={flatIndex === safeActiveIndex}
																	onHover={() => setActiveIndex(flatIndex)}
																	onSelect={() => runHit(hit)}
																/>
															</li>
														)
													})}
												</ul>
											</section>
										)
									})}
								</div>
							) : null}
						</div>
					</div>

					<footer className="shrink-0 border-t border-white/10">
						<div
							className={cn(
								SEARCH_SHELL,
								"flex items-center justify-between gap-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-xs text-white/35",
							)}
						>
							<span>
								{flatHits.length
									? `${flatHits.length} result${flatHits.length === 1 ? "" : "s"}`
									: "Services · Tips · Areas · Actions"}
							</span>
							<span className="hidden sm:inline">Esc closes · ⌘K toggles</span>
						</div>
					</footer>
				</div>
			</DialogContent>
		</Dialog>
	)
}
