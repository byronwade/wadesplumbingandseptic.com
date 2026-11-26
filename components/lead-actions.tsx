import type { Route } from "next"
import Link from "next/link"
import { ArrowRight } from "@/components/icons"

import { CallButton } from "@/components/call-button"
import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import {
	callForFreeQuoteLabel,
	freeQuoteCtaLabel,
	freeQuoteHref,
} from "@/lib/public-facts"
import { cn } from "@/lib/utils"

type ButtonSize = "lg" | "xl"
type CallVariant = "inverse" | "outline"

/**
 * Quote-first pair from the lead-page refresh, or Call-first when quote email
 * cannot be delivered. The boolean must come from the server so a production
 * Resend key is never read in the client bundle.
 */
export function LeadActions({
	quoteEmailReady,
	size = "xl",
	actionClassName = "w-full sm:w-auto",
	quoteArrow = false,
	callVariantWhenQuotePrimary = "inverse",
	includeCallWhenQuotePrimary = true,
	fallbackTextClassName = "text-on-dark-muted text-sm",
}: {
	quoteEmailReady: boolean
	size?: ButtonSize
	actionClassName?: string
	quoteArrow?: boolean
	callVariantWhenQuotePrimary?: CallVariant
	includeCallWhenQuotePrimary?: boolean
	fallbackTextClassName?: string
}) {
	const quoteLink = (
		<Link
			prefetch={false}
			className={cn(
				buttonVariants({ variant: "default", size, wrap: true }),
				actionClassName,
			)}
			href={freeQuoteHref as Route}
		>
			{freeQuoteCtaLabel}
			{quoteArrow ? <ArrowRight aria-hidden="true" /> : null}
		</Link>
	)

	if (!quoteEmailReady) {
		return (
			<>
				<CallButton
					className={actionClassName}
					desktopLabel={`Call ${contactInfo.phoneDisplay}`}
					size={size}
				/>
				<p className={fallbackTextClassName}>{callForFreeQuoteLabel}</p>
			</>
		)
	}

	return (
		<>
			{quoteLink}
			{includeCallWhenQuotePrimary ? (
				<CallButton
					className={actionClassName}
					desktopLabel={`Call ${contactInfo.phoneDisplay}`}
					prefer="dial"
					size={size}
					variant={callVariantWhenQuotePrimary}
				/>
			) : null}
		</>
	)
}
