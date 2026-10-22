import type { ComponentPropsWithoutRef, ReactNode } from "react"

import { contactInfo } from "@/lib/contact"
import { cn } from "@/lib/utils"

type ContactKind = "phone" | "email" | "vcard"

function payloadFor(kind: ContactKind) {
	switch (kind) {
		case "phone":
			return {
				href: contactInfo.phoneHref,
				label: contactInfo.phoneDisplay,
			}
		case "email":
			return {
				href: contactInfo.emailHref,
				label: contactInfo.email,
			}
		case "vcard":
			return {
				href: contactInfo.vcardPath,
				label: "Save contact",
			}
	}
}

/**
 * Native contact destinations must be usable in the initial HTML, including
 * when scripts are still loading or unavailable. The export name is retained
 * for existing callers; no client-side decoding is needed.
 */
export function ProtectedContactLink({
	kind,
	className,
	children,
	ariaLabel,
	...rest
}: {
	kind: ContactKind
	className?: string
	children?: ReactNode
	ariaLabel?: string
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children" | "className">) {
	const payload = payloadFor(kind)

	return (
		<a
			aria-label={ariaLabel}
			className={cn(className) || undefined}
			href={payload.href}
			{...rest}
		>
			{children ?? payload.label}
		</a>
	)
}

/** Visible phone number with a native dial link. */
export function ProtectedPhoneText({ className }: { className?: string }) {
	return (
		<ProtectedContactLink
			ariaLabel={`Call ${contactInfo.phoneDisplay}`}
			className={className}
			kind="phone"
		/>
	)
}

/** Visible email with a native mailto link. */
export function ProtectedEmailText({ className }: { className?: string }) {
	return (
		<ProtectedContactLink
			ariaLabel={`Email ${contactInfo.email}`}
			className={className}
			kind="email"
		/>
	)
}
