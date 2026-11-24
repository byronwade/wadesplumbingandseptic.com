import type { Route } from "next"
import Link from "next/link"

import { type AnswerFirstInput } from "@/lib/answer-first"
import { freeQuoteHref, weekdayHoursPhrase } from "@/lib/public-facts"
import { siteConfig } from "@/lib/site"

const linkClass =
	"text-primary underline decoration-current/40 underline-offset-4 hover:decoration-current"

/**
 * First-body paragraph assistants can quote: what Wade's does, where, how to
 * get a free quote, and weekday hours. Phone and quote stay real links.
 */
export function AnswerFirst({
	work,
	place,
	includeSepticNote = false,
	confirmAddress = false,
}: AnswerFirstInput) {
	const septic = includeSepticNote
		? " Septic work is system installation with engineers, not tank pumping."
		: ""
	const opening = confirmAddress
		? `${siteConfig.name} provides ${work} for selected addresses in ${place}, near the Santa Cruz County line, not full-town coverage. Call with the property address to confirm.`
		: `${siteConfig.name} provides ${work} in ${place}.`
	const lead = `${opening}${septic}`

	return (
		<section
			aria-label="Quick answer"
			className="border-border bg-card border-b"
		>
			<div className="container-shell py-5 sm:py-6">
				<p className="spec-label">Quick answer</p>
				<p className="mt-3 max-w-3xl text-sm leading-relaxed font-semibold sm:text-base">
					{lead} Quotes are free. Call{" "}
					<a className={linkClass} href={siteConfig.phoneHref}>
						{siteConfig.phone}
					</a>{" "}
					{weekdayHoursPhrase()} (closed Saturday and Sunday), or{" "}
					<Link
						className={linkClass}
						href={freeQuoteHref as Route}
						prefetch={false}
					>
						request a free quote
					</Link>
					.
				</p>
			</div>
		</section>
	)
}
