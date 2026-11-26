import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * Published hours in the first HTML. SiteHeader and MobileCallBar are server
 * components, so this span is not a hydrated island. The boot script only
 * updates the live text and `data-open`. The sr-only copy stays the weekly
 * schedule so screen readers keep Monday to Friday hours.
 */
export function OfficeHoursStatus({ className }: { className?: string }) {
	return (
		<span
			className={cn("inline-flex items-center gap-2", className)}
			data-office-hours={siteConfig.hours}
			suppressHydrationWarning
		>
			<span data-office-hours-live suppressHydrationWarning>
				{siteConfig.hours}
			</span>
			<span className="office-hours-published sr-only">
				. {siteConfig.hours}
			</span>
		</span>
	)
}
