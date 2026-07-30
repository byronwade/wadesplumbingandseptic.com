"use client"

import type { ReactNode } from "react"
import { IdentificationCard, Phone } from "@/components/icons"

import { ProtectedContactLink } from "@/components/protected-contact"
import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import { cn } from "@/lib/utils"

type ButtonSize = "default" | "sm" | "lg" | "xl" | "icon"

/**
 * Call CTA. By default phones see "Save contact" (vCard / Add Contact) and
 * desktop sees dial. Prefer is implemented with CSS dual links so there is no
 * matchMedia effect or hydration mismatch.
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
			<ProtectedContactLink
				ariaLabel="Save Wade's Plumbing & Septic to your contacts"
				className={styles}
				kind="vcard"
			>
				{showIcon ? <IdentificationCard aria-hidden="true" /> : null}
				{mobileLabel}
			</ProtectedContactLink>
		)
	}

	return (
		<>
			<ProtectedContactLink
				ariaLabel="Save Wade's Plumbing & Septic to your contacts"
				className={cn(styles, "sm:hidden")}
				kind="vcard"
			>
				{showIcon ? <IdentificationCard aria-hidden="true" /> : null}
				{mobileLabel}
			</ProtectedContactLink>
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

/** Icon-only header call control with the same mobile vCard behavior. */
export function CallIconButton({ className }: { className?: string }) {
	return (
		<>
			<ProtectedContactLink
				ariaLabel="Save Wade's Plumbing & Septic to your contacts"
				className={cn(className, "sm:hidden")}
				kind="vcard"
			>
				<Phone aria-hidden="true" className="size-5" />
			</ProtectedContactLink>
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
