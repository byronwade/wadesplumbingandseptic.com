import { Phone } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

/** Sticky in document flow so its full height also clears the footer. */
export function MobileCallBar() {
	return (
		<nav
			aria-label="Call Wade's Plumbing & Septic"
			className="mobile-call-bar bg-card border-border sticky bottom-0 z-40 border-t pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden print:hidden"
		>
			<div className="container-shell flex flex-col gap-2">
				<a
					className={cn(
						buttonVariants({ size: "lg" }),
						"dark:bg-primary-bright dark:text-ink dark:hover:bg-primary-bright/90 h-auto min-h-12 flex-wrap px-4 py-3 whitespace-normal",
					)}
					href={siteConfig.phoneHref}
				>
					<Phone aria-hidden="true" />
					<span className="min-w-0 [overflow-wrap:anywhere]">
						Call {siteConfig.phone}
					</span>
				</a>
				<p className="text-muted-foreground text-center text-xs leading-4">
					{siteConfig.hours}
				</p>
			</div>
		</nav>
	)
}
