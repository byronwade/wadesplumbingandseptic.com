import { Fragment, type ComponentPropsWithoutRef, type ReactNode } from "react"

import { contactInfo } from "@/lib/contact"
import { cn } from "@/lib/utils"

type ContactKind = "phone" | "email" | "vcard"

/**
 * The business email with wrap points only after "@" and before each dot. In a
 * column narrower than the address (a phone with enlarged text) it reads
 * "support@" above "wadesinc.io" instead of splitting a word. `<wbr>` adds no
 * characters, so copied text and the accessible name stay the plain address.
 */
export function EmailAddress() {
	return contactInfo.email.split(/(?<=@)|(?=\.)/).map((part, index) => (
		<Fragment key={index}>
			{index > 0 ? <wbr /> : null}
			{part}
		</Fragment>
	))
}

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
				label: <EmailAddress />,
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
