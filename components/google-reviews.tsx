import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"

export function GoogleReviewButton({ onDark = false }: { onDark?: boolean }) {
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
			<a href={siteConfig.googleReviewUrl}>Review us on Google</a>
		</Button>
	)
}

export function GoogleReviewInvite() {
	return (
		<section
			aria-label="Google reviews"
			className="container-shell section-y-tight"
		>
			<div className="flex flex-wrap items-center justify-between gap-4">
				<p className="type-lead">
					Share your experience with Wade&apos;s Plumbing &amp; Septic.
				</p>
				<div className="flex flex-wrap items-center gap-x-6 gap-y-2">
					<GoogleReviewButton />
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
