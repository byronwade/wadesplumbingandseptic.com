"use client"

import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type MouseEvent,
	type ReactNode,
} from "react"
import { IdentificationCard } from "@/components/icons"

import { ProtectedContactLink } from "@/components/protected-contact"
import type { SaveContactPrompt } from "@/components/save-contact-prompt"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Opens the vCard, then offers a Call action when the user comes back
 * (visibility/focus) or after a short delay if the OS never backgrounds the tab.
 * Browsers cannot detect a completed contact save, so this is a best-effort nudge.
 */
export function SaveContactButton({
	className,
	children = "Save to phone",
	variant = "default",
	size = "lg",
	showIcon = true,
}: {
	className?: string
	children?: ReactNode
	variant?: "default" | "secondary" | "inverse" | "outline" | "ghost"
	size?: "default" | "sm" | "lg" | "xl" | "icon"
	showIcon?: boolean
}) {
	const [promptOpen, setPromptOpen] = useState(false)
	const [Prompt, setPrompt] = useState<typeof SaveContactPrompt | null>(null)
	const returnFocusRef = useRef<HTMLAnchorElement | null>(null)
	const awaitingReturn = useRef(false)
	const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		if (!promptOpen || Prompt) return
		let active = true
		void import("@/components/save-contact-prompt")
			.then((module) => {
				if (active) setPrompt(() => module.SaveContactPrompt)
			})
			.catch(() => {
				// This optional nudge must never interrupt native contact links.
				if (active) setPromptOpen(false)
			})
		return () => {
			active = false
		}
	}, [promptOpen, Prompt])

	const restoreFocus = useCallback((event: Event) => {
		const target = returnFocusRef.current
		if (target?.isConnected) {
			event.preventDefault()
			target.focus()
		}
	}, [])

	useEffect(() => {
		function maybePrompt() {
			if (!awaitingReturn.current) return
			awaitingReturn.current = false
			if (fallbackTimer.current) {
				clearTimeout(fallbackTimer.current)
				fallbackTimer.current = null
			}
			setPromptOpen(true)
		}

		function onVisibility() {
			if (document.visibilityState === "visible") maybePrompt()
		}

		window.addEventListener("focus", maybePrompt)
		document.addEventListener("visibilitychange", onVisibility)
		return () => {
			window.removeEventListener("focus", maybePrompt)
			document.removeEventListener("visibilitychange", onVisibility)
			if (fallbackTimer.current) clearTimeout(fallbackTimer.current)
		}
	}, [])

	function armPrompt(event: MouseEvent<HTMLAnchorElement>) {
		returnFocusRef.current = event.currentTarget
		awaitingReturn.current = true
		if (fallbackTimer.current) clearTimeout(fallbackTimer.current)
		// Some devices download/open the vCard without leaving the page.
		fallbackTimer.current = setTimeout(() => {
			if (!awaitingReturn.current) return
			awaitingReturn.current = false
			setPromptOpen(true)
		}, 2200)
	}

	const visibleLabel = typeof children === "string" ? children : "Save contact"
	const ariaLabel = `${visibleLabel} for Wade's Plumbing & Septic`

	return (
		<>
			<ProtectedContactLink
				ariaLabel={ariaLabel}
				className={cn(buttonVariants({ size, variant }), className)}
				kind="vcard"
				onClick={armPrompt}
			>
				{showIcon ? <IdentificationCard aria-hidden="true" /> : null}
				{children}
			</ProtectedContactLink>

			{Prompt ? (
				<Prompt
					open={promptOpen}
					onOpenChange={setPromptOpen}
					onCloseAutoFocus={restoreFocus}
				/>
			) : null}
		</>
	)
}
