"use client"

import * as React from "react"
import { ThemeProvider, useTheme } from "next-themes"

import { AppCommandShell } from "@/components/app-command-shell"
import { Toaster } from "@/components/ui/sonner"

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

function ThemeHotkey() {
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

/** Root client providers for theme, toasts, and accessibility hotkeys. */
export function AppProviders({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
			{children}
			<ThemeHotkey />
			<AppCommandShell />
			<Toaster richColors closeButton position="top-center" />
		</ThemeProvider>
	)
}
