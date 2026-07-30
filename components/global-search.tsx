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
			return <Phone className="size-[1.125rem]" aria-hidden />
		if (doc.id.includes("area"))
			return <MapPin className="size-[1.125rem]" aria-hidden />
		return <Hash className="size-[1.125rem]" aria-hidden />
	}
	if (doc.type === "service")
		return <Wrench className="size-[1.125rem]" aria-hidden />
	if (doc.type === "tip")
		return <BookOpen className="size-[1.125rem]" aria-hidden />
	return <FileText className="size-[1.125rem]" aria-hidden />
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
						className="rounded-[2px] bg-[color-mix(in_srgb,var(--primary-bright)_32%,transparent)] text-inherit"
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

function Kbd({ children }: { children: React.ReactNode }) {
	return (
		<kbd className="border-white/12 bg-white/[0.06] text-on-dark-subtle inline-flex h-5 min-w-5 items-center justify-center rounded-[4px] border px-1.5 font-mono text-[0.625rem] tracking-[0.04em] uppercase">
			{children}
		</kbd>
	)
}

function ResultRow({
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
				"group grid w-full grid-cols-[3.75rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-[background-color,box-shadow,transform] duration-150 sm:grid-cols-[4.25rem_minmax(0,1fr)_auto] sm:gap-3.5 sm:px-3 sm:py-2.5",
				"hover:bg-white/[0.045]",
				active &&
					"bg-white/[0.07] shadow-[inset_3px_0_0_0_var(--primary-bright)]",
			)}
		>
			<div
				className={cn(
					"relative aspect-square overflow-hidden rounded-md",
					hit.image
						? "bg-dark-3"
						: "bg-[color-mix(in_srgb,var(--primary)_24%,var(--dark-3))] text-[var(--primary-bright)]",
				)}
			>
				{hit.image ? (
					<Image
						src={hit.image}
						alt=""
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
						sizes="68px"
					/>
				) : (
					<div className="absolute inset-0 flex items-center justify-center">
						<ResultIcon doc={hit} />
					</div>
				)}
			</div>

			<div className="min-w-0">
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
				<p className="font-display mt-1 truncate text-[0.98rem] leading-snug font-extrabold tracking-[-0.03em] text-white sm:text-[1.05rem]">
					<HighlightedTitle title={hit.title} query={query} />
				</p>
				<p className="text-on-dark-subtle mt-0.5 line-clamp-1 text-[0.8125rem] leading-snug">
					{hit.description}
				</p>
			</div>

			<span
				className={cn(
					"text-on-dark-subtle hidden items-center gap-1 text-xs font-bold transition-opacity sm:inline-flex",
					active ? "opacity-100" : "opacity-0 group-hover:opacity-70",
				)}
			>
				Open
				<ArrowUpRight className="size-3.5" aria-hidden />
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
		return searchDocuments(index, query, query.trim() ? 24 : 8)
	}, [index, query])

	const suggestions = React.useMemo(() => suggestSearches(query, 6), [query])
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
		!loading && !error && Boolean(query.trim()) && flatHits.length === 0
	const showPopular = !query.trim() && flatHits.length > 0

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent
				showCloseButton={false}
				className={cn(
					"search-dialog-panel surface-float tex-glow isolate",
					"fixed top-[max(1rem,6dvh)] left-1/2 z-50 flex max-h-[min(42rem,88dvh)] w-[min(44rem,calc(100vw-1.25rem))] translate-x-[-50%] translate-y-0 flex-col gap-0 overflow-hidden rounded-xl border-0 p-0 text-white shadow-[var(--hairline-all),var(--shadow-float)]",
					"data-[state=open]:animate-search-in data-[state=closed]:animate-search-out",
					"focus:outline-none",
				)}
				overlayClassName="bg-ink/55 backdrop-blur-[3px]"
				onOpenAutoFocus={(event) => {
					event.preventDefault()
					inputRef.current?.focus({ preventScroll: true })
				}}
			>
				<header className="relative shrink-0 border-b border-white/10 px-4 pt-4 pb-3 sm:px-5 sm:pt-5">
					<div className="mb-4 flex items-start justify-between gap-3">
						<div className="min-w-0">
							<div className="flex items-center gap-2.5">
								<Image
									alt=""
									className="size-8 rounded-md sm:size-9"
									height={36}
									src="/images/brand/wades-mark-sm.webp"
									width={36}
								/>
								<div className="min-w-0">
									<p className="spec-label">Wade&apos;s</p>
									<DialogTitle className="font-display mt-1 text-[1.35rem] leading-none font-extrabold tracking-[-0.03em] text-white sm:text-[1.55rem]">
										Search the site
									</DialogTitle>
								</div>
							</div>
							<DialogDescription className="text-on-dark-muted mt-2 max-w-md text-sm leading-snug">
								Services, tips, cities, and quick actions.
							</DialogDescription>
						</div>

						<DialogClose className="text-on-dark-muted hover:bg-white/[0.06] flex size-10 shrink-0 items-center justify-center rounded-md transition-colors duration-150 hover:text-white focus-visible:ring-2 focus-visible:ring-[var(--primary-bright)] focus-visible:outline-none">
							<X className="size-5" />
							<span className="sr-only">Close search</span>
						</DialogClose>
					</div>

					<label className="relative block">
						<span className="sr-only">Search services and tips</span>
						<Search
							className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-[var(--primary-bright)]"
							aria-hidden
						/>
						<input
							ref={inputRef}
							value={query}
							onChange={(event) => {
								setActiveIndex(0)
								setQuery(event.target.value)
							}}
							onKeyDown={onKeyDown}
							placeholder="Service, tip, symptom, or city…"
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
							className="border-white/12 bg-white/[0.045] placeholder:text-white/35 focus:border-[color-mix(in_srgb,var(--primary-bright)_70%,transparent)] focus:bg-white/[0.06] font-display h-12 w-full rounded-lg border pr-4 pl-11 text-[1.05rem] font-bold tracking-[-0.02em] text-white caret-[var(--primary-bright)] outline-none transition-[border-color,background-color,box-shadow] duration-150 focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary-bright)_22%,transparent)] sm:h-[3.25rem] sm:text-[1.125rem]"
						/>
					</label>

					{suggestions.length > 0 ? (
						<div className="chip-rail mt-3">
							{suggestions.map((suggestion) => (
								<button
									key={suggestion}
									type="button"
									onClick={() => {
										setQuery(suggestion)
										setActiveIndex(0)
										inputRef.current?.focus()
									}}
									className="spec-tag text-on-dark-muted hover:border-white/20 hover:bg-white/[0.07] hover:text-primary-bright shrink-0 rounded-md border border-white/10 bg-white/[0.035] px-2.5 py-1 transition-colors duration-150"
								>
									{suggestion}
								</button>
							))}
						</div>
					) : null}
				</header>

				<div
					id="global-search-results"
					role="listbox"
					className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2 sm:px-2.5 sm:py-2.5"
				>
					{loading ? (
						<p className="text-on-dark-subtle px-3 py-12 text-center text-sm">
							Warming up search…
						</p>
					) : null}

					{error ? (
						<p className="text-on-dark-subtle px-3 py-12 text-center text-sm">
							{error}
						</p>
					) : null}

					{showEmpty ? (
						<div className="px-4 py-12 text-center">
							<p className="font-display text-xl font-extrabold tracking-[-0.03em] text-white">
								Nothing for “{query.trim()}”
							</p>
							<p className="text-on-dark-muted mx-auto mt-2 max-w-sm text-sm leading-relaxed">
								Try a symptom, city, or service name. Typos are OK.
							</p>
						</div>
					) : null}

					{!loading && !error && flatHits.length > 0 ? (
						<div className="space-y-4">
							<div className="flex items-center justify-between gap-3 px-3 pt-1">
								<p className="spec-tag text-on-dark-subtle">
									{showPopular
										? "Start here"
										: `${flatHits.length} match${flatHits.length === 1 ? "" : "es"}`}
								</p>
								<p className="text-on-dark-subtle hidden items-center gap-1.5 text-xs sm:flex">
									<Kbd>
										<CornerDownLeft className="size-2.5" aria-hidden />
									</Kbd>
									<span>to open</span>
								</p>
							</div>

							{GROUP_ORDER.map((key) => {
								const groupHits = grouped[key]
								if (!groupHits.length) return null
								const meta = GROUP_META[key]
								const Icon = meta.icon
								return (
									<section key={key} aria-label={meta.label} className="space-y-1">
										{!showPopular ? (
											<div className="flex items-center gap-2 px-3 pb-1">
												<Icon
													className="size-3.5 text-[var(--primary-bright)]"
													aria-hidden
												/>
												<h3 className="spec-tag text-on-dark-subtle">
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

				<footer className="text-on-dark-subtle relative shrink-0 border-t border-white/10 px-4 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] text-xs sm:px-5">
					<div className="flex items-center justify-between gap-3">
						<span>
							{flatHits.length
								? `${flatHits.length} result${flatHits.length === 1 ? "" : "s"}`
								: "Services · Tips · Areas · Actions"}
						</span>
						<span className="hidden items-center gap-2 sm:inline-flex">
							<span className="inline-flex items-center gap-1">
								<Kbd>esc</Kbd>
								<span>close</span>
							</span>
							<span className="inline-flex items-center gap-1">
								<Kbd>⌘</Kbd>
								<Kbd>K</Kbd>
								<span>toggle</span>
							</span>
						</span>
					</div>
				</footer>
			</DialogContent>
		</Dialog>
	)
}
