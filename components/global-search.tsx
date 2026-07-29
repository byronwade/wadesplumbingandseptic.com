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
} from "lucide-react"

import {
	Dialog,
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
	type SearchResultType,
} from "@/lib/search"

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
		label: "Expert Tip",
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
				"grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-md px-3 py-3 text-left transition-colors",
				active ? "bg-muted" : "hover:bg-muted/70",
			)}
		>
			<div
				className={cn(
					"relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md",
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
				<div className="flex flex-wrap items-center gap-2">
					<span
						className={cn(
							"rounded-sm px-1.5 py-0.5 text-[0.68rem] font-extrabold tracking-[0.14em] uppercase",
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
				<p className="text-foreground mt-1 truncate text-[1.05rem] font-extrabold tracking-[-0.02em]">
					{hit.title}
				</p>
				<p className="text-muted-foreground mt-0.5 line-clamp-2 text-sm leading-snug">
					{hit.description}
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
	const [index, setIndex] = React.useState<SearchDocument[] | null>(null)
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

		void fetch("/api/search-index")
			.then(async (response) => {
				if (!response.ok) throw new Error("Could not load search index")
				const data = (await response.json()) as SearchDocument[]
				if (!cancelled) {
					setIndex(Array.isArray(data) ? data : [])
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
		return searchDocuments(index, query, query.trim() ? 24 : 8)
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
				showCloseButton
				className={cn(
					"bg-background text-foreground top-[max(1.25rem,8vh)] max-h-[min(88vh,52rem)] w-[min(96vw,48rem)] max-w-none translate-y-0 gap-0 overflow-hidden rounded-xl border-0 p-0 shadow-[0_28px_80px_rgba(16,18,20,0.32)] sm:max-w-none",
					"data-[state=open]:animate-rise",
				)}
				overlayClassName="bg-ink/55 backdrop-blur-md supports-backdrop-filter:bg-ink/40"
			>
				<DialogHeader className="border-border border-b px-5 pt-5 pb-4 sm:px-7 sm:pt-6">
					<DialogTitle className="text-2xl font-extrabold tracking-[-0.03em] sm:text-[1.85rem]">
						Search Wade&apos;s
					</DialogTitle>
					<DialogDescription className="text-muted-foreground text-sm sm:text-base">
						Find plumbing &amp; septic services, expert tips, and pages across
						the Central Coast.
					</DialogDescription>
				</DialogHeader>

				<div className="border-border border-b px-5 py-4 sm:px-7">
					<label className="relative block">
						<span className="sr-only">Search services and tips</span>
						<Search
							className="text-primary pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2"
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
							placeholder="Try “clogged drain”, “septic pumping”, or “water heater”…"
							autoComplete="off"
							autoCorrect="off"
							spellCheck={false}
							role="combobox"
							aria-expanded
							aria-controls="global-search-results"
							aria-activedescendant={
								flatHits[safeActiveIndex]
									? `search-option-${flatHits[safeActiveIndex].id}`
									: undefined
							}
							className="border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/25 h-14 w-full rounded-lg border pr-4 pl-12 text-base outline-none focus-visible:ring-2 sm:h-16 sm:text-lg"
						/>
					</label>
					<p className="text-muted-foreground mt-2.5 text-xs sm:text-sm">
						Smart matching understands synonyms like toilet ↔ clog and septic ↔
						pumping. Use ↑ ↓ and Enter.
					</p>
				</div>

				<div
					id="global-search-results"
					role="listbox"
					className="max-h-[min(52vh,28rem)] overflow-y-auto px-2 py-3 sm:px-3"
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
							<p className="text-foreground text-xl font-extrabold tracking-[-0.02em]">
								No matches for “{query.trim()}”
							</p>
							<p className="text-muted-foreground mt-2 text-sm">
								Try a service name, symptom, city, or tip topic.
							</p>
						</div>
					) : null}

					{!loading && !error && flatHits.length > 0 ? (
						<div className="space-y-5">
							{showPopular ? (
								<p className="text-muted-foreground px-3 text-xs font-extrabold tracking-[0.16em] uppercase">
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
											<div className="mb-1.5 flex items-center gap-2 px-3">
												<Icon className="text-primary size-3.5" aria-hidden />
												<h3 className="text-muted-foreground text-xs font-extrabold tracking-[0.16em] uppercase">
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

				<div className="border-border bg-muted/50 text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-t px-5 py-3 text-xs sm:px-7">
					<span>
						{flatHits.length
							? `${flatHits.length} result${flatHits.length === 1 ? "" : "s"}`
							: "Services · Tips · Pages"}
					</span>
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
