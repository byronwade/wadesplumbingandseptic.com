"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

import { OPEN_GLOBAL_SEARCH_EVENT } from "@/lib/search-events"
import { prefetchSearchIndex } from "@/lib/search-client"

const loadSearchDialog = () =>
	import("@/components/command-menu").then((mod) => mod.CommandMenuDialog)

const CommandMenuDialog = dynamic(loadSearchDialog, { ssr: false })

/**
 * Search stays cold until the user asks for it. Prefetching the dialog chunk
 * and ~search index on idle was costing every page hundreds of KB of JS/JSON
 * in the first couple seconds after load.
 */
export function CommandMenuLoader() {
	const [open, setOpen] = useState(false)
	const [ready, setReady] = useState(false)

	useEffect(() => {
		const openSearch = () => {
			setReady(true)
			void prefetchSearchIndex()
			setOpen(true)
		}

		const onKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault()
				setReady(true)
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

	if (!ready) return null

	return <CommandMenuDialog open={open} onOpenChange={setOpen} />
}
