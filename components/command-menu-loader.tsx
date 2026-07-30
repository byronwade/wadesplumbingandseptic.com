"use client"

import { useEffect, useState } from "react"

import { GlobalSearch as CommandMenuDialog } from "@/components/global-search"
import { OPEN_GLOBAL_SEARCH_EVENT } from "@/lib/search-events"
import { prefetchSearchIndex } from "@/lib/search-client"

/**
 * Site command menu (global search). Mounted from the app shell with Cmd/Ctrl+K
 * and the header search control. Light-only product: no theme hotkey.
 *
 * The dialog is imported statically so the shadcn Command composition stays in
 * the mounted component graph; the search index still loads on demand.
 */
export function CommandMenuLoader() {
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
