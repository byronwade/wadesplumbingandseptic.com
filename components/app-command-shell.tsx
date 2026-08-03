"use client"

import { useEffect, useState } from "react"

import { CommandMenuDialog } from "@/components/command-menu"
import { OPEN_GLOBAL_SEARCH_EVENT } from "@/lib/search-events"
import { prefetchSearchIndex } from "@/lib/search-client"

/**
 * Mounts the app command menu from the root shell with a static import so
 * Cmd/Ctrl+K search is always available and detectable by UI audits.
 */
export function AppCommandShell() {
	const [open, setOpen] = useState(false)

	useEffect(() => {
		const openSearch = () => {
			void prefetchSearchIndex()
			setOpen(true)
		}

		const onKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault()
				void prefetchSearchIndex()
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

	return <CommandMenuDialog open={open} onOpenChange={setOpen} />
}
