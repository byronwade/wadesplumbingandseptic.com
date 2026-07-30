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
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import { DialogClose } from "@/components/ui/dialog"
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

function ResultItem({
	hit,
	query,
	onSelect,
}: {
	hit: SearchHit
	query: string
	onSelect: () => void
}) {
	return (
		<CommandItem
			value={`${hit.id} ${hit.title} ${hit.description} ${hit.keywords.join(" ")}`}
			onSelect={onSelect}
			className={cn(
				"group grid w-full cursor-pointer grid-cols-[5.5rem_minmax(0,1fr)] items-stretch gap-0 overflow-hidden rounded-md p-0 text-left transition-[background-color,transform] duration-75 sm:grid-cols-[7.5rem_minmax(0,1fr)]",
				"bg-white/[0.04] data-[selected=true]:bg-white/[0.09] data-[selected=true]:text-white",
				"data-[selected=true]:ring-1 data-[selected=true]:ring-[color-mix(in_srgb,var(--primary-bright)_55%,transparent)]",
				"hover:bg-white/[0.07]",
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
						alt=""
						fill
						className="object-cover transition-transform duration-150 group-data-[selected=true]:scale-[1.03] group-hover:scale-[1.03]"
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
				<p className="text-on-dark-subtle mt-1 line-clamp-2 text-sm font-normal leading-snug">
					{hit.description}
				</p>
				<div className="text-on-dark-subtle mt-2 flex items-center gap-1 text-xs font-bold transition-colors group-data-[selected=true]:text-[var(--primary-bright)] group-hover:text-[var(--primary-bright)]">
					Open
					<ArrowUpRight className="size-3.5" aria-hidden />
				</div>
			</div>
		</CommandItem>
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
	const loading = open && index === null && error === null

	const handleOpenChange = (next: boolean) => {
		if (!next) {
			setQuery("")
			setError(null)
		}
		onOpenChange(next)
	}

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

	const runHit = React.useCallback(
		(hit: SearchHit) => {
			setQuery("")
			setError(null)
			onOpenChange(false)
			if (hit.href.startsWith("tel:")) {
				window.location.href = hit.href
				return
			}
			router.push(hit.href as never)
		},
		[onOpenChange, router],
	)

	const showPopular = !query.trim() && flatHits.length > 0

	return (
		<CommandDialog
			open={open}
			onOpenChange={handleOpenChange}
			shouldFilter={false}
			showCloseButton={false}
			title="Looking for something?"
			description="Search services, expert tips, pages, and quick actions."
			className={cn(
				"bg-ink fixed inset-0 top-0 left-0 z-50 flex h-[100dvh] max-h-[100dvh] w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 p-0 text-white shadow-none duration-0 sm:max-w-none",
				"!animate-none data-[state=closed]:!animate-none data-[state=open]:!animate-none",
				"focus:outline-none",
			)}
			overlayClassName="!animate-none bg-ink/90 duration-0 backdrop-blur-[2px] data-[state=closed]:!animate-none data-[state=open]:!animate-none"
			commandClassName="flex h-full min-h-0 flex-col overflow-hidden rounded-none bg-transparent text-white **:data-[slot=command-input-wrapper]:h-auto **:data-[slot=command-input-wrapper]:border-0 **:data-[slot=command-input-wrapper]:px-0 **:data-[slot=command-input-wrapper]>svg:hidden"
			onOpenAutoFocus={(event) => {
				event.preventDefault()
				inputRef.current?.focus({ preventScroll: true })
			}}
		>
			<div
				aria-hidden
				className="tex-glow pointer-events-none absolute inset-0 bg-ink"
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
							<p className="type-headline mt-2 text-white">
								Looking for something?
							</p>
						</div>

						<DialogClose className="text-on-dark-muted flex size-11 shrink-0 items-center justify-center rounded-md transition-colors duration-75 hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-[var(--primary-bright)] focus-visible:outline-none">
							<X className="size-5" />
							<span className="sr-only">Close search</span>
						</DialogClose>
					</div>
				</header>

				<div className="shrink-0">
					<div className={SEARCH_SHELL}>
						<div className="relative">
							<Search
								className="pointer-events-none absolute top-1/2 left-0 z-10 size-6 -translate-y-1/2 text-[var(--primary-bright)] sm:size-7"
								aria-hidden
							/>
							<CommandInput
								ref={inputRef}
								value={query}
								onValueChange={setQuery}
								placeholder="Service, tip, symptom, or city…"
								autoComplete="off"
								autoCorrect="off"
								spellCheck={false}
								enterKeyHint="search"
								className="font-display h-16 w-full border-0 border-b border-white/15 bg-transparent pr-4 pl-10 text-[1.35rem] font-extrabold tracking-[-0.03em] text-white caret-[var(--primary-bright)] outline-none placeholder:font-bold placeholder:text-white/30 focus-visible:border-[var(--primary-bright)] focus-visible:ring-0 sm:h-[4.5rem] sm:pl-12 sm:text-[2rem]"
							/>
						</div>

						<div className="mt-3 flex items-center justify-between gap-3">
							<div className="chip-rail min-w-0 flex-1">
								{suggestions.map((suggestion) => (
									<button
										key={suggestion}
										type="button"
										onClick={() => {
											setQuery(suggestion)
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

				<CommandList className="mt-5 max-h-none min-h-0 flex-1 overflow-y-auto overscroll-contain px-0 pb-4 sm:mt-7 sm:pb-6">
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

						{!loading && !error ? (
							<>
								{Boolean(query.trim()) ? (
									<CommandEmpty className="section-head mx-auto max-w-lg py-14 text-center">
										<p className="type-title text-white">
											Nothing for “{query.trim()}”
										</p>
										<p className="type-lead text-on-dark-muted mt-2 font-normal">
											Try a symptom, city, or service name. Typos are OK; we
											surface the closest matches when we can.
										</p>
									</CommandEmpty>
								) : null}

								{flatHits.length > 0 ? (
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
												<CommandGroup
													key={key}
													heading={showPopular ? undefined : meta.label}
													className={cn(
														"overflow-visible p-0",
														"[&_[cmdk-group-heading]]:mb-2.5 [&_[cmdk-group-heading]]:flex [&_[cmdk-group-heading]]:items-center [&_[cmdk-group-heading]]:gap-2",
														"[&_[cmdk-group-heading]]:px-0 [&_[cmdk-group-heading]]:py-0",
														"[&_[cmdk-group-heading]]:text-[length:inherit] [&_[cmdk-group-heading]]:font-[inherit] [&_[cmdk-group-heading]]:tracking-[inherit]",
														"[&_[cmdk-group-heading]]:text-on-dark-subtle",
													)}
												>
													{!showPopular ? (
														<span className="sr-only">
															<Icon className="size-3.5" aria-hidden />
														</span>
													) : null}
													<div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3">
														{groupHits.map((hit) => (
															<ResultItem
																key={hit.id}
																hit={hit}
																query={query}
																onSelect={() => runHit(hit)}
															/>
														))}
													</div>
												</CommandGroup>
											)
										})}
									</div>
								) : null}
							</>
						) : null}
					</div>
				</CommandList>

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
		</CommandDialog>
	)
}
