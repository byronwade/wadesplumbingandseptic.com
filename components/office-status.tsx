import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * Published hours in the first HTML. A small layout script (OfficeHoursScript)
 * upgrades the text to "open now" / "opens Monday" once the visitor's clock
 * is known, so this file stays a server component.
 */
export function OfficeHoursStatus({ className }: { className?: string }) {
	return (
		<span
			className={cn("inline-flex items-center gap-2", className)}
			data-office-hours={siteConfig.hours}
		>
			{siteConfig.hours}
		</span>
	)
}
