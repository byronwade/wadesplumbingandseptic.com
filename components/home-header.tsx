import Link from "next/link"

import { Menu, Phone } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

const mobileNavLinks = [
	{ href: "/services", label: "Services" },
	{ href: "/service-areas", label: "Service areas" },
	{ href: "/expert-tips", label: "Expert tips" },
	{ href: "/contact", label: "Contact" },
] as const

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
				<div className="container-shell flex h-16 items-center justify-between gap-2 sm:h-18 sm:gap-3">
					<Link
						className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3"
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
						<span className="min-w-0 leading-none">
							<span className="font-display block truncate text-[0.875rem] leading-tight font-extrabold tracking-[-0.03em] text-white sm:text-lg">
								Wade&apos;s Plumbing
							</span>
							<span className="text-primary-bright mt-1 block font-mono text-[0.625rem] leading-none font-semibold tracking-[0.2em] uppercase">
								&amp; Septic
							</span>
						</span>
					</Link>

					<nav
						aria-label="Primary"
						className="flex shrink-0 items-center gap-1.5 sm:gap-3"
					>
						<div className="hidden items-center gap-1 lg:flex">
							{mobileNavLinks.map((item) => (
								<Link
									key={item.href}
									className="rounded-md px-3 py-2 text-sm font-bold text-white/90 transition-colors hover:text-white"
									href={item.href}
									prefetch
								>
									{item.label === "Service areas"
										? "Areas"
										: item.label === "Expert tips"
											? "Tips"
											: item.label}
								</Link>
							))}
						</div>
						<a
							aria-label={`Call ${contactInfo.phoneDisplay}`}
							className={cn(
								buttonVariants({ size: "sm", variant: "default" }),
								"inline-flex max-w-[10.75rem] gap-1.5 truncate px-2.5 text-xs sm:max-w-none sm:gap-2 sm:px-3 sm:text-sm",
							)}
							href={contactInfo.phoneHref}
						>
							<Phone aria-hidden="true" className="size-4 shrink-0" />
							<span className="truncate">{contactInfo.phoneDisplay}</span>
						</a>
						<details className="group relative lg:hidden">
							<summary
								aria-label="Open site menu"
								className="hover:text-primary-bright flex size-11 cursor-pointer list-none items-center justify-center text-white marker:content-none [&::-webkit-details-marker]:hidden"
							>
								<Menu aria-hidden="true" className="size-5" />
							</summary>
							<div className="border-border bg-card text-foreground absolute top-[calc(100%+0.35rem)] right-0 z-50 w-[min(16.5rem,calc(100vw-1.5rem))] overflow-hidden rounded-lg border shadow-[var(--shadow-panel)]">
								<ul className="py-1.5">
									{mobileNavLinks.map((item) => (
										<li key={item.href}>
											<Link
												className="hover:bg-muted block px-4 py-3 text-sm font-bold"
												href={item.href}
												prefetch
											>
												{item.label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</details>
					</nav>
				</div>
			</div>
		</header>
	)
}
