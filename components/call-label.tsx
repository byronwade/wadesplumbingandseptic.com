import type { ReactNode } from "react"

import { contactInfo } from "@/lib/contact"
import { cn } from "@/lib/utils"

/**
 * Call-button label that keeps the phone number on one line. With enlarged
 * text on a phone the label wraps only before the number ("Call" above
 * "831.225.4344"), and the icon stays beside the first word.
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
				<span className="inline-flex items-center gap-2 align-top whitespace-nowrap">
					{icon}
					{before}
				</span>
			) : null}
			{before ? " " : null}
			<span className={cn("whitespace-nowrap", icon && !before && "ms-2")}>
				{phone}
			</span>
			{after}
		</span>
	)
}
