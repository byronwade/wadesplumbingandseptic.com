"use client"

import {
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	type ComponentPropsWithoutRef,
	type ReactNode,
} from "react"

import {
	contactEncoded,
	contactInfo,
	decodeContactValue,
} from "@/lib/contact"
import { cn } from "@/lib/utils"

const useIsomorphicLayoutEffect =
	typeof window !== "undefined" ? useLayoutEffect : useEffect

type ContactKind = "phone" | "email" | "vcard"

function payloadFor(kind: ContactKind) {
	switch (kind) {
		case "phone":
			return {
				href: contactEncoded.phoneHref,
				label: contactEncoded.phoneDisplay,
				fallbackHref: "#call-wades",
				fallbackLabel: contactInfo.phoneDisplay,
			}
		case "email":
			return {
				href: contactEncoded.emailHref,
				label: contactEncoded.email,
				fallbackHref: "#email-wades",
				fallbackLabel: contactInfo.email,
			}
		case "vcard":
			return {
				href: contactEncoded.vcardPath,
				label: contactEncoded.phoneDisplay,
				fallbackHref: contactInfo.vcardPath,
				fallbackLabel: "Save contact",
			}
	}
}

/**
 * Renders a visible phone/email/vCard link without putting a harvestable
 * tel: or mailto: href in the server HTML. The real href is applied on the
 * client before paint when possible.
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
	const ref = useRef<HTMLAnchorElement>(null)
	const [label, setLabel] = useState(payload.fallbackLabel)

	useIsomorphicLayoutEffect(() => {
		const href = decodeContactValue(payload.href)
		const text = decodeContactValue(payload.label)
		const node = ref.current
		if (node) node.href = href
		if (!children) setLabel(text)
	}, [payload.href, payload.label, children])

	return (
		<a
			ref={ref}
			aria-label={ariaLabel}
			className={cn(className)}
			href={payload.fallbackHref}
			suppressHydrationWarning
			{...rest}
		>
			{children ?? label}
		</a>
	)
}

/** Visible phone number text with a dial link applied after hydration. */
export function ProtectedPhoneText({
	className,
}: {
	className?: string
}) {
	return (
		<ProtectedContactLink
			ariaLabel={`Call ${contactInfo.phoneDisplay}`}
			className={className}
			kind="phone"
		/>
	)
}

/** Visible email with a mailto link applied after hydration. */
export function ProtectedEmailText({
	className,
}: {
	className?: string
}) {
	return (
		<ProtectedContactLink
			ariaLabel={`Email ${contactInfo.email}`}
			className={className}
			kind="email"
		/>
	)
}
