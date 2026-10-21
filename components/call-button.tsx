"use client"

import type { ReactNode } from "react"
import { Phone } from "@/components/icons"

import { ProtectedContactLink } from "@/components/protected-contact"
import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import { cn } from "@/lib/utils"

type ButtonSize = "default" | "sm" | "lg" | "xl" | "icon"

/**
 * Primary call CTA — always dials. Save-contact belongs on the contact page
 * card only (see VirtualBusinessCard), never as a header/hero/footer control.
 */
export function CallButton({
	className,
	size = "xl",
	variant = "default",
	showIcon = true,
	wrap = true,
	desktopLabel,
}: {
	className?: string
	size?: ButtonSize
	variant?: "default" | "secondary" | "inverse" | "outline" | "ghost"
	showIcon?: boolean
	/**
	 * Let a long label wrap onto two lines instead of being cut off. Header
	 * controls that show only the number turn this off to keep their size.
	 */
	wrap?: boolean
	/** @deprecated Ignored — CallButton always dials. */
	prefer?: "auto" | "dial" | "vcard"
	desktopLabel?: ReactNode
	/** @deprecated Ignored — CallButton always dials. */
	mobileLabel?: ReactNode
}) {
	const styles = cn(buttonVariants({ size, variant, wrap }), className)
	const dialLabel = desktopLabel ?? `Call ${contactInfo.phoneDisplay}`
	const dialAria =
		typeof dialLabel === "string"
			? dialLabel.includes(contactInfo.phoneDisplay)
				? dialLabel
				: `${dialLabel} ${contactInfo.phoneDisplay}`
			: `Call ${contactInfo.phoneDisplay}`

	return (
		<ProtectedContactLink ariaLabel={dialAria} className={styles} kind="phone">
			{showIcon ? <Phone aria-hidden="true" className="shrink-0" /> : null}
			{typeof dialLabel === "string" ? (
				<span className="min-w-0">{dialLabel}</span>
			) : (
				dialLabel
			)}
		</ProtectedContactLink>
	)
}

/** Icon-only header call control — always dials. */
export function CallIconButton({ className }: { className?: string }) {
	return (
		<ProtectedContactLink
			ariaLabel={`Call ${contactInfo.phoneDisplay}`}
			className={cn(
				"inline-flex size-11 items-center justify-center",
				className,
			)}
			kind="phone"
		>
			<Phone aria-hidden="true" className="size-5" />
		</ProtectedContactLink>
	)
}
