import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"

export function GoogleReviewButton({
	onDark = false,
	children = "Review us on Google",
}: {
	onDark?: boolean
	children?: ReactNode
}) {
	return (
		<Button
			asChild
			className={
				onDark
					? "focus-visible:ring-offset-ink text-on-dark border-white/30 bg-transparent hover:border-white/50 hover:bg-white/10 focus-visible:ring-white"
					: undefined
			}
			variant="outline"
			wrap
		>
			<a href={siteConfig.googleReviewUrl}>{children}</a>
		</Button>
	)
}

export function GoogleReviewInvite({
	message = "Share your experience with Wade's Plumbing & Septic.",
	buttonLabel = "Review us on Google",
}: {
	message?: string
	buttonLabel?: string
}) {
	return (
		<section
			aria-label="Google reviews"
			className="container-shell section-y-tight"
		>
			<div className="flex flex-wrap items-center justify-between gap-4">
				<p className="type-lead">{message}</p>
				<div className="flex flex-wrap items-center gap-x-6 gap-y-2">
					<GoogleReviewButton>{buttonLabel}</GoogleReviewButton>
					<a
						className="text-foreground focus-visible:ring-ring inline-flex min-h-11 items-center rounded-sm text-sm font-semibold underline underline-offset-4 outline-none focus-visible:ring-2"
						href={siteConfig.googleBusinessUrl}
					>
						Read reviews on Google
					</a>
				</div>
			</div>
		</section>
	)
}
