import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * Published hours in the first HTML. SiteHeader and MobileCallBar are server
 * components, so this span is not a hydrated island. A layout script updates
 * `data-open` and the text node after the visitor's clock is known. The
 * warning is a guard if a future client parent wraps this markup.
 */
export function OfficeHoursStatus({ className }: { className?: string }) {
	return (
		<span
			className={cn("inline-flex items-center gap-2", className)}
			data-office-hours={siteConfig.hours}
			suppressHydrationWarning
		>
			{siteConfig.hours}
		</span>
	)
}
