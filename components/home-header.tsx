import Link from "next/link"

import { Phone } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * Homepage header: server-only chrome (no mega-menu hydration).
 * Primary CTA is always the phone number — save-contact lives in the footer card.
 */
export function HomeHeader() {
	return (
		<header className="bg-ink sticky top-0 z-50 text-white shadow-[0_1px_0_0_rgba(0,0,0,0.45)]">
			<div className="bg-ink-soft hidden sm:block">
				<div className="container-shell text-on-dark-muted flex items-center justify-between gap-4 py-2 text-xs font-bold">
					<span>{siteConfig.hours}</span>
					<Link
						className="transition-colors hover:text-white"
						href="/service-areas"
						prefetch
					>
						{siteConfig.serviceArea}
					</Link>
				</div>
			</div>

			<div className="relative">
				<div className="container-shell flex h-16 items-center justify-between gap-3 sm:h-18">
					<Link
						className="flex min-w-0 items-center gap-2.5 sm:gap-3"
						href="/"
						aria-label="Wade's Plumbing & Septic home"
						prefetch
					>
						<img
							alt="Wade's Plumbing & Septic logo"
							className="size-10 shrink-0 rounded-md sm:size-11"
							height={44}
							width={44}
							decoding="async"
							fetchPriority="low"
							src="/images/brand/wades-mark-sm.webp"
						/>
						<span className="leading-none">
							<span className="font-display block truncate text-[0.9375rem] leading-tight font-extrabold tracking-[-0.03em] text-white sm:text-lg">
								Wade&apos;s Plumbing
							</span>
							<span className="text-primary-bright mt-1 block font-mono text-[0.625rem] leading-none font-semibold tracking-[0.2em] uppercase">
								&amp; Septic
							</span>
						</span>
					</Link>

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
				</div>
			</div>
		</header>
	)
}
