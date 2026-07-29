"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { OPEN_GLOBAL_SEARCH_EVENT } from "@/lib/search-events"
import { prefetchSearchIndex } from "@/lib/search-client"

const loadSearchDialog = () =>
	import("@/components/command-menu").then((mod) => mod.CommandMenuDialog)

const CommandMenuDialog = dynamic(loadSearchDialog, { ssr: false })

export function CommandMenuLoader() {
	const [open, setOpen] = useState(false)
	const [ready, setReady] = useState(false)
	const { resolvedTheme, setTheme } = useTheme()

	useEffect(() => {
		const warm = () => {
			void loadSearchDialog()
			void prefetchSearchIndex()
			setReady(true)
		}

		const idleWindow = window as Window & {
			requestIdleCallback?: (
				callback: IdleRequestCallback,
				options?: IdleRequestOptions,
			) => number
			cancelIdleCallback?: (handle: number) => void
		}

		if (idleWindow.requestIdleCallback) {
			const id = idleWindow.requestIdleCallback(warm, { timeout: 1200 })
			return () => idleWindow.cancelIdleCallback?.(id)
		}

		const timer = globalThis.setTimeout(warm, 200)
		return () => globalThis.clearTimeout(timer)
	}, [])

	useEffect(() => {
		const openSearch = () => {
			setReady(true)
			void prefetchSearchIndex()
			setOpen(true)
		}

		const onKeyDown = (event: KeyboardEvent) => {
			const target = event.target
			const typing =
				target instanceof HTMLElement &&
				(target.tagName === "INPUT" ||
					target.tagName === "TEXTAREA" ||
					target.tagName === "SELECT" ||
					target.isContentEditable)

			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault()
				setReady(true)
				void prefetchSearchIndex()
				setOpen((current) => !current)
				return
			}

			if (typing || event.metaKey || event.ctrlKey || event.altKey) {
				return
			}

			if (event.key.toLowerCase() === "d") {
				setTheme(resolvedTheme === "dark" ? "light" : "dark")
			}
		}

		window.addEventListener("keydown", onKeyDown)
		window.addEventListener(OPEN_GLOBAL_SEARCH_EVENT, openSearch)
		return () => {
			window.removeEventListener("keydown", onKeyDown)
			window.removeEventListener(OPEN_GLOBAL_SEARCH_EVENT, openSearch)
		}
	}, [resolvedTheme, setTheme])

	if (!ready) return null

	return <CommandMenuDialog open={open} onOpenChange={setOpen} />
}
