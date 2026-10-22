import type { ReactNode } from "react"

import { contactInfo } from "@/lib/contact"
import { cn } from "@/lib/utils"

/**
 * Call-button label that wraps before the phone number instead of inside it.
 * The icon rides inline with the first word rather than as a flex sibling, so
 * the number gets the button's full width: with enlarged text on a phone the
 * label reads "Call" above "831.225.4344". The number is not `nowrap`; in a
 * box narrower than the number itself it still wraps rather than being cut off.
 */
export function CallLabel({
	label = `Call ${contactInfo.phoneDisplay}`,
	icon,
	className,
}: {
	label?: string
	icon?: ReactNode
	className?: string
}) {
	const phone = contactInfo.phoneDisplay
	const at = label.indexOf(phone)

	if (at === -1) {
		return (
			<>
				{icon}
				<span className={cn("min-w-0", className)}>{label}</span>
			</>
		)
	}

	const before = label.slice(0, at).trimEnd()
	const after = label.slice(at + phone.length)

	return (
		<span className={cn("min-w-0", className)}>
			{icon || before ? (
				<span
					className={cn(
						"inline-flex h-[1lh] items-center gap-2 align-top whitespace-nowrap",
						!before && "me-2",
					)}
				>
					{icon}
					{before}
				</span>
			) : null}
			{before ? " " : <wbr />}
			<span>{phone}</span>
			{after}
		</span>
	)
}
