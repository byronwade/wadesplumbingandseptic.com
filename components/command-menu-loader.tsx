"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { OPEN_GLOBAL_SEARCH_EVENT } from "@/lib/search-events"
import { prefetchSearchIndex } from "@/lib/search-client"

const CommandMenuDialog = dynamic(
	() =>
		import("@/components/command-menu").then((mod) => mod.CommandMenuDialog),
	{ ssr: false },
)

export function CommandMenuLoader() {
	const [open, setOpen] = useState(false)
	const [mounted, setMounted] = useState(false)
	const { resolvedTheme, setTheme } = useTheme()

	useEffect(() => {
		const openSearch = () => {
			setMounted(true)
			setOpen(true)
			void prefetchSearchIndex()
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
				setMounted(true)
				setOpen((current) => !current)
				void prefetchSearchIndex()
				return
			}

			if (typing || event.metaKey || event.ctrlKey || event.altKey) {
				return
			}

			if (event.key.toLowerCase() === "d") {
				setTheme(resolvedTheme === "dark" ? "light" : "dark")
			}
		}

		const warmIndex = () => {
			void prefetchSearchIndex()
		}

		window.addEventListener("keydown", onKeyDown)
		window.addEventListener(OPEN_GLOBAL_SEARCH_EVENT, openSearch)

		// Prefetch on idle so ⌘K / search opens instantly with full-content index
		let idleId: number | undefined
		let timeoutId: number | undefined
		if (typeof window.requestIdleCallback === "function") {
			idleId = window.requestIdleCallback(warmIndex, { timeout: 2500 })
		} else {
			timeoutId = window.setTimeout(warmIndex, 1200)
		}

		return () => {
			window.removeEventListener("keydown", onKeyDown)
			window.removeEventListener(OPEN_GLOBAL_SEARCH_EVENT, openSearch)
			if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
				window.cancelIdleCallback(idleId)
			}
			if (timeoutId !== undefined) window.clearTimeout(timeoutId)
		}
	}, [resolvedTheme, setTheme])

	if (!mounted) return null

	return <CommandMenuDialog open={open} onOpenChange={setOpen} />
}
