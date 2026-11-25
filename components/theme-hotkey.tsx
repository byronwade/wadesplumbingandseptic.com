"use client"

import { useEffect } from "react"

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

function applyTheme(next: "light" | "dark") {
	document.documentElement.classList.toggle("dark", next === "dark")
	try {
		localStorage.setItem("theme", next)
	} catch {
		/* Private mode can block storage; the class still updates this view. */
	}
}

/** Toggles light/dark with `d`, ignoring typing targets. */
export function ThemeHotkey() {
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (isTypingTarget(event.target)) return
			if (event.metaKey || event.ctrlKey || event.altKey) return
			if (event.key.toLowerCase() !== "d") return
			event.preventDefault()
			const dark = document.documentElement.classList.contains("dark")
			applyTheme(dark ? "light" : "dark")
		}

		window.addEventListener("keydown", onKeyDown)
		return () => window.removeEventListener("keydown", onKeyDown)
	}, [])

	return null
}
