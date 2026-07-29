"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

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
		return () => window.removeEventListener("keydown", onKeyDown)
	}, [resolvedTheme, setTheme])

	if (!mounted) return null

	return <CommandMenuDialog open={open} onOpenChange={setOpen} />
}
