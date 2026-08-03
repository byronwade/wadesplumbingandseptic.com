"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import { getCachedSearchIndex, loadSearchIndex } from "@/lib/search-client"
import {
	groupSearchHits,
	searchDocuments,
	type SearchHit,
	type SearchResultType,
} from "@/lib/search"

const GROUP_ORDER: SearchResultType[] = ["service", "tip", "page", "action"]

const GROUP_LABEL: Record<SearchResultType, string> = {
	service: "Services",
	tip: "Expert Tips",
	page: "Pages",
	action: "Quick actions",
}

type CommandMenuDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
}

/**
 * App-level command menu (Cmd/Ctrl+K) built on shadcn CommandDialog.
 * Reuses the site search index for services, tips, pages, and actions.
 */
export function CommandMenuDialog({
	open,
	onOpenChange,
}: CommandMenuDialogProps) {
	const router = useRouter()
	const [query, setQuery] = React.useState("")
	const [index, setIndex] = React.useState(() => getCachedSearchIndex())

	React.useEffect(() => {
		if (!open || index) return
		let cancelled = false
		void loadSearchIndex().then((data) => {
			if (!cancelled && data) setIndex(data)
		})
		return () => {
			cancelled = true
		}
	}, [open, index])

	const hits = React.useMemo(() => {
		if (!index) return [] as SearchHit[]
		return searchDocuments(index, query, query.trim() ? 28 : 12)
	}, [index, query])

	const grouped = React.useMemo(() => groupSearchHits(hits), [hits])

	const handleOpenChange = React.useCallback(
		(nextOpen: boolean) => {
			if (!nextOpen) setQuery("")
			onOpenChange(nextOpen)
		},
		[onOpenChange],
	)

	const go = React.useCallback(
		(href: string) => {
			handleOpenChange(false)
			if (href.startsWith("tel:")) {
				window.location.href = href
				return
			}
			router.push(href as never)
		},
		[handleOpenChange, router],
	)

	return (
		<CommandDialog open={open} onOpenChange={handleOpenChange}>
			<CommandInput
				placeholder="Search services, tips, cities…"
				value={query}
				onValueChange={setQuery}
			/>
			<CommandList>
				<CommandEmpty>
					{index ? "No matching pages found." : "Loading search index…"}
				</CommandEmpty>
				{GROUP_ORDER.map((type) => {
					const groupHits = grouped[type] ?? []
					if (groupHits.length === 0) return null
					return (
						<CommandGroup key={type} heading={GROUP_LABEL[type]}>
							{groupHits.map((hit) => (
								<CommandItem
									key={hit.id}
									value={`${hit.title} ${hit.href} ${type}`}
									onSelect={() => go(hit.href)}
								>
									<span className="truncate font-medium">{hit.title}</span>
									<span className="text-muted-foreground ml-auto truncate text-xs">
										{TYPE_BADGE[type]}
									</span>
								</CommandItem>
							))}
						</CommandGroup>
					)
				})}
				{/* Always-present actions so the shell menu is complete before the index loads. */}
				{hits.length === 0 ? (
					<CommandGroup heading="Quick actions">
						<CommandItem
							value="services plumbing septic"
							onSelect={() => go("/services")}
						>
							Services
						</CommandItem>
						<CommandItem
							value="contact schedule"
							onSelect={() => go("/contact")}
						>
							Contact
						</CommandItem>
						<CommandItem
							value="expert tips blog"
							onSelect={() => go("/expert-tips")}
						>
							Expert Tips
						</CommandItem>
					</CommandGroup>
				) : null}
			</CommandList>
		</CommandDialog>
	)
}

const TYPE_BADGE: Record<SearchResultType, string> = {
	service: "Service",
	tip: "Tip",
	page: "Page",
	action: "Action",
}
