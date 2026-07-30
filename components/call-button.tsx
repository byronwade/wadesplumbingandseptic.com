"use client"

import type { ReactNode } from "react"
import { Phone } from "@/components/icons"

import { ProtectedContactLink } from "@/components/protected-contact"
import { SaveContactButton } from "@/components/save-contact-button"
import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import { cn } from "@/lib/utils"

type ButtonSize = "default" | "sm" | "lg" | "xl" | "icon"

/**
 * Call CTA. By default phones see "Save contact" (vCard, then call prompt)
 * and desktop sees dial.
 */
export function CallButton({
	className,
	size = "xl",
	variant = "default",
	showIcon = true,
	prefer = "auto",
	desktopLabel,
	mobileLabel = "Save contact",
}: {
	className?: string
	size?: ButtonSize
	variant?: "default" | "secondary" | "inverse" | "outline" | "ghost"
	showIcon?: boolean
	/** auto: vCard on small viewports, dial from sm up. */
	prefer?: "auto" | "dial" | "vcard"
	desktopLabel?: ReactNode
	mobileLabel?: ReactNode
}) {
	const styles = cn(buttonVariants({ size, variant }), className)
	const dialLabel = desktopLabel ?? `Call ${contactInfo.phoneDisplay}`

	if (prefer === "dial") {
		return (
			<ProtectedContactLink
				ariaLabel={`Call ${contactInfo.phoneDisplay}`}
				className={styles}
				kind="phone"
			>
				{showIcon ? <Phone aria-hidden="true" /> : null}
				{dialLabel}
			</ProtectedContactLink>
		)
	}

	if (prefer === "vcard") {
		return (
			<SaveContactButton className={className} size={size} variant={variant}>
				{mobileLabel}
			</SaveContactButton>
		)
	}

	return (
		<>
			<span className="sm:hidden">
				<SaveContactButton className={className} size={size} variant={variant}>
					{mobileLabel}
				</SaveContactButton>
			</span>
			<ProtectedContactLink
				ariaLabel={`Call ${contactInfo.phoneDisplay}`}
				className={cn(styles, "hidden sm:inline-flex")}
				kind="phone"
			>
				{showIcon ? <Phone aria-hidden="true" /> : null}
				{dialLabel}
			</ProtectedContactLink>
		</>
	)
}

/** Icon-only header call control with the same mobile vCard + call-prompt behavior. */
export function CallIconButton({ className }: { className?: string }) {
	return (
		<>
			<span className="sm:hidden">
				<SaveContactButton
					className={cn(
						className,
						"inline-flex size-11 items-center justify-center p-0",
					)}
					showIcon={false}
					size="icon"
					variant="ghost"
				>
					<span className="sr-only">Save contact</span>
					<Phone aria-hidden="true" className="size-5" />
				</SaveContactButton>
			</span>
			<ProtectedContactLink
				ariaLabel={`Call ${contactInfo.phoneDisplay}`}
				className={cn(className, "hidden sm:inline-flex")}
				kind="phone"
			>
				<Phone aria-hidden="true" className="size-5" />
			</ProtectedContactLink>
		</>
	)
}
