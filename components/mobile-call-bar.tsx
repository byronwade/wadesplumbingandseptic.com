import { CallLabel } from "@/components/call-label"
import { Phone } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * Sticky in document flow so its full height also clears the footer.
 *
 * The `@max-[20rem]` rules only apply when the bar is narrow for its text size
 * (enlarged text on a phone). The bar then drops to the call button alone, so it
 * cannot cover most of the screen; the hours stay readable to screen readers
 * here and visible in the footer.
 */
export function MobileCallBar() {
	return (
		<nav
			aria-label="Call Wade's Plumbing & Septic"
			className="mobile-call-bar bg-card border-border @container sticky bottom-0 z-40 border-t pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden print:hidden"
		>
			<div className="container-shell flex flex-col gap-2">
				<a
					className={cn(
						buttonVariants({ size: "lg" }),
						"dark:bg-primary-bright dark:text-ink dark:hover:bg-primary-bright/90 h-auto min-h-12 px-4 py-3 whitespace-normal @max-[20rem]:px-2 @max-[20rem]:py-2",
					)}
					href={siteConfig.phoneHref}
				>
					<CallLabel
						className="[overflow-wrap:anywhere]"
						icon={<Phone aria-hidden="true" className="@max-[20rem]:hidden" />}
					/>
				</a>
				<p className="text-muted-foreground text-center text-xs leading-4 @max-[20rem]:sr-only">
					{siteConfig.hours}
				</p>
			</div>
		</nav>
	)
}
