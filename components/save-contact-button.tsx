"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { IdentificationCard, Phone } from "@/components/icons"

import { ProtectedContactLink } from "@/components/protected-contact"
import { buttonVariants } from "@/components/ui/button"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"
import { contactInfo } from "@/lib/contact"
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
	const awaitingReturn = useRef(false)
	const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

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

	function armPrompt() {
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

			<Sheet open={promptOpen} onOpenChange={setPromptOpen}>
				<SheetContent
					className="bg-card gap-0 rounded-t-2xl sm:mx-auto sm:max-w-md sm:rounded-t-2xl"
					side="bottom"
				>
					<SheetHeader className="pb-2">
						<SheetTitle>Ready to call?</SheetTitle>
						<SheetDescription>
							If you saved Wade&apos;s to your contacts, you can dial us next.
							We are here {contactInfo.hours.toLowerCase()}.
						</SheetDescription>
					</SheetHeader>
					<SheetFooter className="pb-[max(1.25rem,env(safe-area-inset-bottom))]">
						<ProtectedContactLink
							ariaLabel={`Call ${contactInfo.phoneDisplay}`}
							className={cn(buttonVariants({ size: "xl" }), "w-full")}
							kind="phone"
							onClick={() => setPromptOpen(false)}
						>
							<Phone aria-hidden="true" />
							Call {contactInfo.phoneDisplay}
						</ProtectedContactLink>
						<button
							className={cn(
								buttonVariants({ variant: "ghost", size: "lg" }),
								"w-full",
							)}
							onClick={() => setPromptOpen(false)}
							type="button"
						>
							Not now
						</button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</>
	)
}
