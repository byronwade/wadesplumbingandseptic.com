"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

export function ThemeHotkeys() {
	const { resolvedTheme, setTheme } = useTheme()

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			const target = event.target
			if (
				target instanceof HTMLElement &&
				(target.tagName === "INPUT" ||
					target.tagName === "TEXTAREA" ||
					target.tagName === "SELECT" ||
					target.isContentEditable)
			) {
				return
			}

			if (event.metaKey || event.ctrlKey || event.altKey) {
				return
			}

			if (event.key.toLowerCase() === "d") {
				setTheme(resolvedTheme === "dark" ? "light" : "dark")
			}
		}

		window.addEventListener("keydown", onKeyDown)
		return () => window.removeEventListener("keydown", onKeyDown)
	}, [resolvedTheme, setTheme])

	return null
}
