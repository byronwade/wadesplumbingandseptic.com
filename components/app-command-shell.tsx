"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

import { OPEN_GLOBAL_SEARCH_EVENT } from "@/lib/search-events"
import { loadSearchIndex } from "@/lib/search-client"

/*
  The dialog (cmdk, Radix Dialog and the search UI) is only fetched the first
  time someone opens search. Shipping it statically cost every page up to
  80 KB of JavaScript (25 KB compressed) that most visitors never use.
*/
const CommandMenuDialog = dynamic(
	() =>
		import("@/components/command-menu").then((mod) => mod.CommandMenuDialog),
	{ ssr: false },
)

/**
 * Root-level search shell. The Cmd/Ctrl+K shortcut and the header search
 * buttons (via OPEN_GLOBAL_SEARCH_EVENT) are always wired from first
 * hydration; the dialog itself loads on demand.
 */
export function AppCommandShell() {
	const [open, setOpen] = useState(false)
	const [requested, setRequested] = useState(false)

	useEffect(() => {
		const openSearch = () => {
			setRequested(true)
			void loadSearchIndex()
			setOpen(true)
		}

		const onKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault()
				setRequested(true)
				void loadSearchIndex()
				setOpen((current) => !current)
			}
		}

		window.addEventListener("keydown", onKeyDown)
		window.addEventListener(OPEN_GLOBAL_SEARCH_EVENT, openSearch)
		return () => {
			window.removeEventListener("keydown", onKeyDown)
			window.removeEventListener(OPEN_GLOBAL_SEARCH_EVENT, openSearch)
		}
	}, [])

	if (!requested) return null

	return <CommandMenuDialog open={open} onOpenChange={setOpen} />
}
