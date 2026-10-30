import Link from "next/link"
import { ArrowRight, Clock, Mail, Phone } from "@/components/icons"

import { CallButton } from "@/components/call-button"
import {
	ProtectedContactLink,
	ProtectedEmailText,
} from "@/components/protected-contact"
import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import { cn } from "@/lib/utils"

export function ContactCta({
	title = "Ready to get started?",
	description = "Talk to a local licensed professional and get clear options with no pressure.",
	compact = false,
	/** Big Call button. Off by default in compact sidebars so pages do not stack Call on Call. */
	showCall,
}: {
	title?: string
	description?: string
	compact?: boolean
	showCall?: boolean
}) {
	/*
	 * Give banner copy a text-sized basis and wrap whole columns before they
	 * compete for space. Actions also wrap within their available width.
	 * Compact sidebars stay stacked at every width because they have less
	 * room than a page-wide banner.
	 *
	 * Compact sidebars omit the Call button by default: content/service pages
	 * already offer Call in the hero and again in the end conversion band, and
	 * on mobile the sidebar stacks right above that band.
	 */
	const includeCall = showCall ?? !compact
	const actionWidth = compact ? "w-full" : "w-full sm:w-auto"

	return (
		<section
			className={cn(
				"relative overflow-hidden",
				compact ? "surface-float" : "surface-hero",
				compact ? "rounded-lg p-[var(--space-card)] sm:p-7" : "section-y-tight",
			)}
		>
			<div
				className={cn(
					"relative min-w-0",
					!compact &&
						"container-shell flex flex-wrap items-center justify-between gap-8 md:gap-12",
				)}
			>
				<div
					className={cn(
						"section-head min-w-0 [overflow-wrap:anywhere]",
						!compact && "max-w-2xl flex-1 basis-96",
					)}
				>
					<p className="spec-label">Wade&apos;s Plumbing &amp; Septic</p>
					<h2 className={compact ? "type-subtitle" : "type-title"}>{title}</h2>
					<p
						className={cn(
							"text-on-dark-muted text-pretty",
							compact ? "text-sm leading-relaxed" : "type-lead",
						)}
					>
						{description}
					</p>
					{compact ? (
						<ProtectedContactLink
							className="text-primary-bright hover:text-on-dark inline-flex items-center gap-2 text-sm font-semibold transition-colors"
							kind="phone"
						>
							<Phone aria-hidden="true" className="size-4 shrink-0" />
							{contactInfo.phoneDisplay}
						</ProtectedContactLink>
					) : (
						<div className="text-on-dark-muted flex flex-wrap gap-x-6 gap-y-2 text-sm">
							<span className="inline-flex min-w-0 items-center gap-2">
								<Clock className="text-primary-bright size-4 shrink-0" />
								{contactInfo.hours}
							</span>
							<span className="inline-flex min-w-0 items-center gap-2">
								<Mail className="text-primary-bright size-4 shrink-0" />
								<ProtectedEmailText className="hover:text-on-dark [overflow-wrap:anywhere] transition-colors" />
							</span>
						</div>
					)}
				</div>

				<div
					className={cn(
						"flex w-full max-w-full min-w-0 flex-col flex-wrap items-stretch gap-3",
						compact ? "mt-5" : "sm:w-auto sm:flex-row sm:items-center",
					)}
				>
					{includeCall ? (
						<CallButton
							className={actionWidth}
							desktopLabel={`Call ${contactInfo.phoneDisplay}`}
							prefer="dial"
							size={compact ? "lg" : "xl"}
						/>
					) : null}
					<Link
						prefetch={false}
						className={cn(
							buttonVariants({
								variant: includeCall ? "inverse" : "default",
								size: compact ? "lg" : "xl",
								wrap: true,
							}),
							actionWidth,
						)}
						href="/contact"
					>
						{compact ? "Request service" : "Send a Message"}
						<ArrowRight aria-hidden="true" />
					</Link>
				</div>
			</div>
		</section>
	)
}
