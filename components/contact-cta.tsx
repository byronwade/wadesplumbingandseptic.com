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
	 * Two shapes, one component. The banner is a grid rather than a
	 * justify-between flex row: as a flex row the copy column absorbed all the
	 * shrinkage against the shrink-0 button group and collapsed to its longest
	 * word. The compact shape stays stacked at every width - it lives in a
	 * 20.5rem sidebar, where side-by-side xl buttons overflowed the card.
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
				compact ? "surface-float" : "surface-hero tex-grid tex-glow",
				compact ? "rounded-lg p-[var(--space-card)] sm:p-7" : "section-y-tight",
			)}
		>
			<div
				className={cn(
					"relative",
					!compact &&
						"container-shell grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-12",
				)}
			>
				<div className={cn("section-head min-w-0", !compact && "max-w-2xl")}>
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
							className="text-primary-bright inline-flex items-center gap-2 text-sm font-bold transition-colors hover:text-white"
							kind="phone"
						>
							<Phone aria-hidden="true" className="size-4 shrink-0" />
							{contactInfo.phoneDisplay}
						</ProtectedContactLink>
					) : (
						<div className="text-on-dark-muted flex flex-wrap gap-x-6 gap-y-2 text-sm">
							<span className="inline-flex items-center gap-2">
								<Clock className="text-primary-bright size-4 shrink-0" />
								{contactInfo.hours}
							</span>
							<span className="inline-flex items-center gap-2">
								<Mail className="text-primary-bright size-4 shrink-0" />
								<ProtectedEmailText className="transition-colors hover:text-white" />
							</span>
						</div>
					)}
				</div>

				<div
					className={cn(
						"flex flex-col items-stretch gap-3",
						compact ? "mt-5" : "sm:flex-row sm:items-center md:shrink-0",
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
					<Link prefetch={false}
						className={cn(
							buttonVariants({
								variant: includeCall ? "inverse" : "default",
								size: compact ? "lg" : "xl",
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
