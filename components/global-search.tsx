"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import * as React from "react"
import {
	BookOpen,
	FileText,
	Hash,
	Loader2,
	MapPin,
	Phone,
	Search,
	Sparkles,
	Wrench,
	X,
} from "lucide-react"

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
	groupSearchHits,
	searchDocuments,
	type SearchDocument,
	type SearchHit,
	type SearchIndexPayload,
	type SearchResultType,
} from "@/lib/search"
import { loadSearchIndex } from "@/lib/search-client"

const GROUP_ORDER: SearchResultType[] = ["service", "tip", "page", "action"]

const GROUP_META: Record<
	SearchResultType,
	{ label: string; icon: React.ComponentType<{ className?: string }> }
> = {
	service: { label: "Services", icon: Wrench },
	tip: { label: "Expert Tips", icon: BookOpen },
	page: { label: "Pages", icon: FileText },
	action: { label: "Quick actions", icon: Sparkles },
}

const TYPE_BADGE: Record<
	SearchResultType,
	{ label: string; className: string }
> = {
	service: {
		label: "Service",
		className: "bg-accent text-accent-foreground",
	},
	tip: {
		label: "Tip",
		className: "bg-secondary text-secondary-foreground",
	},
	page: {
		label: "Page",
		className: "bg-muted text-muted-foreground",
	},
	action: {
		label: "Action",
		className: "bg-accent text-accent-foreground",
	},
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

function ResultRow({
	hit,
	active,
	onHover,
	onSelect,
}: {
	hit: SearchHit
	active: boolean
	onHover: () => void
	onSelect: () => void
}) {
	const badge = TYPE_BADGE[hit.type]

	return (
		<button
			type="button"
			id={`search-option-${hit.id}`}
			role="option"
			aria-selected={active}
			onMouseEnter={onHover}
			onClick={onSelect}
			className={cn(
				"grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-4 sm:rounded-md sm:px-3 sm:py-3",
				"active:bg-muted min-h-16 sm:min-h-0",
				active ? "bg-muted" : "hover:bg-muted/70",
			)}
		>
			<div
				className={cn(
					"relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md sm:size-14",
					hit.image ? "bg-muted" : "bg-accent text-primary",
				)}
			>
				{hit.image ? (
					<Image
						src={hit.image}
						alt=""
						fill
						className="object-cover"
						sizes="56px"
					/>
				) : (
					<ResultIcon doc={hit} />
				)}
			</div>

			<div className="min-w-0">
				<div className="flex min-w-0 items-center gap-2">
					<span
						className={cn(
							"shrink-0 rounded-sm px-1.5 py-0.5 text-[0.65rem] font-extrabold tracking-[0.12em] uppercase sm:text-[0.68rem] sm:tracking-[0.14em]",
							badge.className,
						)}
					>
						{badge.label}
					</span>
					{hit.category ? (
						<span className="text-muted-foreground truncate text-xs">
							{hit.category}
						</span>
					) : null}
				</div>
				<p className="text-foreground mt-1 truncate text-base font-extrabold tracking-[-0.02em] sm:text-[1.05rem]">
					{hit.title}
				</p>
				<p className="text-muted-foreground mt-0.5 line-clamp-1 text-sm leading-snug sm:line-clamp-2">
					{hit.snippet && hit.matchedOn === "body"
						? hit.snippet
						: hit.description}
				</p>
			</div>

			<span className="text-muted-foreground hidden shrink-0 text-xs sm:inline">
				{active ? "Enter ↵" : ""}
			</span>
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
	const [index, setIndex] = React.useState<SearchIndexPayload | null>(null)
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

	React.useEffect(() => {
		if (!open) return
		const timer = window.setTimeout(() => inputRef.current?.focus(), 30)
		return () => window.clearTimeout(timer)
	}, [open])

	React.useEffect(() => {
		if (!open || index) return

		let cancelled = false

		void loadSearchIndex()
			.then((payload) => {
				if (!cancelled) {
					setIndex(payload)
					setError(null)
				}
			})
			.catch(() => {
				if (!cancelled) setError("Search is temporarily unavailable.")
			})

		return () => {
			cancelled = true
		}
	}, [open, index])

	const hits = React.useMemo(() => {
		if (!index) return [] as SearchHit[]
		return searchDocuments(
			index.documents,
			query,
			query.trim() ? 24 : 8,
			index.inverted,
		)
	}, [index, query])

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
		!loading && !error && Boolean(query.trim()) && flatHits.length === 0
	const showPopular = !query.trim() && flatHits.length > 0

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent
				showCloseButton={false}
				className={cn(
					"bg-background text-foreground z-50 flex max-w-none flex-col gap-0 overflow-hidden border-0 p-0 shadow-[0_28px_80px_rgba(16,18,20,0.32)]",
					// Mobile: full-viewport sheet that keeps the input pinned
					"inset-0 top-0 left-0 h-[100dvh] max-h-[100dvh] w-full translate-x-0 translate-y-0 rounded-none",
					// Desktop: large floating palette
					"sm:inset-auto sm:top-[max(1.25rem,8vh)] sm:left-[50%] sm:h-auto sm:max-h-[min(88vh,52rem)] sm:w-[min(96vw,48rem)] sm:translate-x-[-50%] sm:translate-y-0 sm:rounded-xl",
					"data-[state=open]:animate-rise",
				)}
				overlayClassName="bg-ink/60 backdrop-blur-md supports-backdrop-filter:bg-ink/45"
			>
				<DialogHeader className="border-border shrink-0 border-b px-4 pt-[max(0.85rem,env(safe-area-inset-top))] pr-14 pb-3 sm:px-7 sm:pt-6 sm:pr-7 sm:pb-4">
					<div className="flex items-start justify-between gap-3">
						<div className="min-w-0">
							<DialogTitle className="text-xl font-extrabold tracking-[-0.03em] sm:text-[1.85rem]">
								Search Wade&apos;s
							</DialogTitle>
							<DialogDescription className="text-muted-foreground mt-1 text-sm sm:mt-1.5 sm:text-base">
								<span className="sm:hidden">
									Services, tips, and pages on the Central Coast.
								</span>
								<span className="hidden sm:inline">
									Find plumbing &amp; septic services, expert tips, and pages
									across the Central Coast.
								</span>
							</DialogDescription>
						</div>
					</div>
					<DialogClose className="focus-visible:ring-ring text-foreground/70 hover:bg-muted hover:text-foreground absolute top-[max(0.65rem,env(safe-area-inset-top))] right-3 flex size-11 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none sm:top-4 sm:right-4 sm:size-9">
						<X className="size-5 sm:size-4" />
						<span className="sr-only">Close</span>
					</DialogClose>
				</DialogHeader>

				<div className="border-border shrink-0 border-b px-4 py-3 sm:px-7 sm:py-4">
					<label className="relative block">
						<span className="sr-only">Search services and tips</span>
						<Search
							className="text-primary pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 sm:left-4"
							aria-hidden
						/>
						<input
							ref={inputRef}
							value={query}
							onChange={(event) => {
								setQuery(event.target.value)
								setActiveIndex(0)
							}}
							onKeyDown={onKeyDown}
							placeholder="Search services, tips, pages, or symptoms…"
							autoComplete="off"
							autoCorrect="off"
							spellCheck={false}
							enterKeyHint="search"
							role="combobox"
							aria-expanded
							aria-controls="global-search-results"
							aria-activedescendant={
								flatHits[safeActiveIndex]
									? `search-option-${flatHits[safeActiveIndex].id}`
									: undefined
							}
							className="border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/25 h-14 w-full rounded-lg border pr-4 pl-11 text-base outline-none focus-visible:ring-2 sm:h-16 sm:pl-12 sm:text-lg"
						/>
					</label>
					<p className="text-muted-foreground mt-2 hidden text-sm sm:mt-2.5 sm:block">
						Searches titles and full page content. Synonyms like toilet ↔ clog
						and septic ↔ pumping. Use ↑ ↓ and Enter.
					</p>
					{!query.trim() ? (
						<div className="mt-2.5 flex [scrollbar-width:none] gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] sm:hidden [&::-webkit-scrollbar]:hidden">
							{[
								"clogged drain",
								"septic pumping",
								"water heater",
								"toilet",
							].map((suggestion) => (
								<button
									key={suggestion}
									type="button"
									onClick={() => {
										setQuery(suggestion)
										setActiveIndex(0)
										inputRef.current?.focus()
									}}
									className="border-border bg-card text-foreground shrink-0 rounded-md border px-3 py-1.5 text-xs font-extrabold tracking-[-0.01em]"
								>
									{suggestion}
								</button>
							))}
						</div>
					) : null}
				</div>

				<div
					id="global-search-results"
					role="listbox"
					className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2 sm:max-h-[min(52vh,28rem)] sm:flex-none sm:px-3 sm:py-3"
				>
					{loading ? (
						<div className="text-muted-foreground flex items-center justify-center gap-2 px-4 py-12 text-sm">
							<Loader2 className="size-4 animate-spin" aria-hidden />
							Loading search…
						</div>
					) : null}

					{error ? (
						<p className="text-muted-foreground px-4 py-10 text-center text-sm">
							{error}
						</p>
					) : null}

					{showEmpty ? (
						<div className="px-4 py-10 text-center">
							<p className="text-foreground text-lg font-extrabold tracking-[-0.02em] sm:text-xl">
								No matches for “{query.trim()}”
							</p>
							<p className="text-muted-foreground mt-2 text-sm">
								Try a service name, symptom, city, or tip topic.
							</p>
						</div>
					) : null}

					{!loading && !error && flatHits.length > 0 ? (
						<div className="space-y-4 sm:space-y-5">
							{showPopular ? (
								<p className="text-muted-foreground px-2.5 text-[0.7rem] font-extrabold tracking-[0.16em] uppercase sm:px-3 sm:text-xs">
									Popular right now
								</p>
							) : null}

							{GROUP_ORDER.map((key) => {
								const groupHits = grouped[key]
								if (!groupHits.length) return null
								const meta = GROUP_META[key]
								const Icon = meta.icon
								return (
									<section key={key} aria-label={meta.label}>
										{!showPopular ? (
											<div className="mb-1 flex items-center gap-2 px-2.5 sm:mb-1.5 sm:px-3">
												<Icon className="text-primary size-3.5" aria-hidden />
												<h3 className="text-muted-foreground text-[0.7rem] font-extrabold tracking-[0.16em] uppercase sm:text-xs">
													{meta.label}
												</h3>
											</div>
										) : null}
										<ul className="space-y-0.5">
											{groupHits.map((hit) => {
												const flatIndex = flatHits.findIndex(
													(item) => item.id === hit.id,
												)
												return (
													<li key={hit.id}>
														<ResultRow
															hit={hit}
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

				<div className="border-border bg-muted/50 text-muted-foreground flex shrink-0 flex-wrap items-center justify-between gap-2 border-t px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-xs sm:px-7 sm:pb-3">
					<span>
						{flatHits.length
							? `${flatHits.length} result${flatHits.length === 1 ? "" : "s"}`
							: "Services · Tips · Pages"}
					</span>
					<span className="sm:hidden">Tap a result to open</span>
					<span className="hidden sm:inline">
						<kbd className="border-border bg-card rounded-sm border px-1.5 py-0.5 font-sans">
							Esc
						</kbd>{" "}
						to close ·{" "}
						<kbd className="border-border bg-card rounded-sm border px-1.5 py-0.5 font-sans">
							⌘K
						</kbd>
					</span>
				</div>
			</DialogContent>
		</Dialog>
	)
}
