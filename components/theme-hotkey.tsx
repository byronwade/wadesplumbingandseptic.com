"use client"

import * as React from "react"
import { useTheme } from "next-themes"

function isTypingTarget(target: EventTarget | null) {
	if (!(target instanceof HTMLElement)) return false
	if (target.isContentEditable) return true
	return (
		target instanceof HTMLInputElement ||
		target instanceof HTMLTextAreaElement ||
		target instanceof HTMLSelectElement ||
		Boolean(target.closest("input, textarea, select, [contenteditable='true']"))
	)
}

/** Toggles light/dark with `d`, ignoring typing targets. */
export function ThemeHotkey() {
	const { resolvedTheme, setTheme } = useTheme()

	React.useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (isTypingTarget(event.target)) return
			if (event.metaKey || event.ctrlKey || event.altKey) return
			if (event.key.toLowerCase() !== "d") return
			event.preventDefault()
			setTheme(resolvedTheme === "dark" ? "light" : "dark")
		}

		window.addEventListener("keydown", onKeyDown)
		return () => window.removeEventListener("keydown", onKeyDown)
	}, [resolvedTheme, setTheme])

	return null
}
