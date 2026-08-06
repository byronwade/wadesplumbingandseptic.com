"use client"

import type { ReactNode } from "react"
import { Phone } from "@/components/icons"
import type { VariantProps } from "class-variance-authority"

import { ProtectedContactLink } from "@/components/protected-contact"
import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import { cn } from "@/lib/utils"

/**
 * Primary call CTA — always dials. Save-contact belongs on the contact page
 * card only (see VirtualBusinessCard), never as a header/hero/footer control.
 */
export function CallButton({
	className,
	size = "xl",
	variant = "default",
	showIcon = true,
	desktopLabel,
}: {
	className?: string
	size?: NonNullable<VariantProps<typeof buttonVariants>["size"]>
	variant?: NonNullable<VariantProps<typeof buttonVariants>["variant"]>
	showIcon?: boolean
	desktopLabel?: ReactNode
}) {
	const styles = cn(buttonVariants({ size, variant }), className)
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
				<span className="truncate">{dialLabel}</span>
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
				className,
				"inline-flex size-11 items-center justify-center",
			)}
			kind="phone"
		>
			<Phone aria-hidden="true" className="size-5" />
		</ProtectedContactLink>
	)
}
