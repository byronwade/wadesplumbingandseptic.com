import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import { cn } from "@/lib/utils"

/**
 * Server-only primary nav. The Radix mega-menu client island is deferred to
 * interior pages so the homepage can ship without that hydration cost on LCP.
 */
export function StaticHeaderNav() {
	return (
		<nav
			aria-label="Primary"
			className="flex items-center gap-2 sm:gap-3"
		>
			<div className="hidden items-center gap-1 lg:flex">
				<Link
					className="rounded-md px-3 py-2 text-sm font-bold text-white/90 transition-colors hover:text-white"
					href="/services"
					prefetch
				>
					Services
				</Link>
				<Link
					className="rounded-md px-3 py-2 text-sm font-bold text-white/90 transition-colors hover:text-white"
					href="/service-areas"
					prefetch
				>
					Areas
				</Link>
				<Link
					className="rounded-md px-3 py-2 text-sm font-bold text-white/90 transition-colors hover:text-white"
					href="/expert-tips"
					prefetch
				>
					Tips
				</Link>
				<Link
					className="rounded-md px-3 py-2 text-sm font-bold text-white/90 transition-colors hover:text-white"
					href="/contact"
					prefetch
				>
					Contact
				</Link>
			</div>
			<a
				className={cn(
					buttonVariants({ size: "sm", variant: "default" }),
					"hidden sm:inline-flex",
				)}
				href={contactInfo.phoneHref}
			>
				Call {contactInfo.phoneDisplay}
			</a>
			<a
				className={cn(
					buttonVariants({ size: "sm", variant: "default" }),
					"sm:hidden",
				)}
				href={contactInfo.vcardPath}
			>
				Save contact
			</a>
		</nav>
	)
}
