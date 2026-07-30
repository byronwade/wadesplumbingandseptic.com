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
 * Primary call CTA. Defaults to dialing the phone number on every viewport.
 * Use prefer="vcard" only where save-contact is an intentional secondary action
 * (e.g. the footer business card), not as the main header/hero control.
 */
export function CallButton({
	className,
	size = "xl",
	variant = "default",
	showIcon = true,
	prefer = "dial",
	desktopLabel,
	mobileLabel,
}: {
	className?: string
	size?: ButtonSize
	variant?: "default" | "secondary" | "inverse" | "outline" | "ghost"
	showIcon?: boolean
	/** dial: phone link everywhere. vcard: save-contact sheet. auto: legacy split. */
	prefer?: "auto" | "dial" | "vcard"
	desktopLabel?: ReactNode
	mobileLabel?: ReactNode
}) {
	const styles = cn(buttonVariants({ size, variant }), className)
	const dialLabel = desktopLabel ?? `Call ${contactInfo.phoneDisplay}`
	const vcardLabel = mobileLabel ?? "Save contact"
	/*
	  Accessible name must include visible label text (axe label-content-name-
	  mismatch). Keep the phone number when the visible label is a short CTA.
	*/
	const dialAria =
		typeof dialLabel === "string"
			? dialLabel.includes(contactInfo.phoneDisplay)
				? dialLabel
				: `${dialLabel} ${contactInfo.phoneDisplay}`
			: `Call ${contactInfo.phoneDisplay}`

	if (prefer === "vcard") {
		return (
			<SaveContactButton className={className} size={size} variant={variant}>
				{vcardLabel}
			</SaveContactButton>
		)
	}

	if (prefer === "auto") {
		return (
			<>
				<span className="sm:hidden">
					<ProtectedContactLink
						ariaLabel={dialAria}
						className={styles}
						kind="phone"
					>
						{showIcon ? <Phone aria-hidden="true" /> : null}
						{typeof mobileLabel === "string" && mobileLabel !== "Save contact"
							? mobileLabel
							: dialLabel}
					</ProtectedContactLink>
				</span>
				<ProtectedContactLink
					ariaLabel={dialAria}
					className={cn(styles, "hidden sm:inline-flex")}
					kind="phone"
				>
					{showIcon ? <Phone aria-hidden="true" /> : null}
					{dialLabel}
				</ProtectedContactLink>
			</>
		)
	}

	return (
		<ProtectedContactLink
			ariaLabel={dialAria}
			className={styles}
			kind="phone"
		>
			{showIcon ? <Phone aria-hidden="true" className="shrink-0" /> : null}
			{typeof dialLabel === "string" ? (
				<span className="truncate">{dialLabel}</span>
			) : (
				dialLabel
			)}
		</ProtectedContactLink>
	)
}

/** Icon-only header call control — always dials, never opens save-contact. */
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
