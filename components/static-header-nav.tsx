import Link from "next/link"

import { Phone } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import { cn } from "@/lib/utils"

/**
 * Server-only primary nav fallback. Phone number is the CTA — not save-contact.
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
				aria-label={`Call ${contactInfo.phoneDisplay}`}
				className={cn(
					buttonVariants({ size: "sm", variant: "default" }),
					"inline-flex max-w-[11.5rem] gap-1.5 truncate px-2.5 sm:max-w-none sm:gap-2 sm:px-3",
				)}
				href={contactInfo.phoneHref}
			>
				<Phone aria-hidden="true" className="size-4 shrink-0" />
				<span className="truncate">{contactInfo.phoneDisplay}</span>
			</a>
		</nav>
	)
}
