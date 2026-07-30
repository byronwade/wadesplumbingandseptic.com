import Image from "next/image"
import Link from "next/link"

import { SiteHeaderNav } from "@/components/site-header-nav"
import { siteConfig } from "@/lib/site"

/**
 * Interior-page header with full mega-menu, search, and mobile sheet.
 * The homepage uses {@link HomeHeader} instead to keep its LCP path script-light.
 */
export function SiteHeader() {
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

			{/* Relative shell so mega-menu viewports span the full header width */}
			<div className="relative">
				<div className="container-shell flex h-16 items-center justify-between gap-2 sm:h-18 sm:gap-3">
					<Link
						className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3"
						href="/"
						aria-label="Wade's Plumbing & Septic home"
						prefetch
					>
						<Image
							alt="Wade's Plumbing & Septic logo"
							className="size-10 shrink-0 rounded-md sm:size-11"
							height={44}
							priority
							src="/images/brand/wades-mark-sm.webp"
							width={44}
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

					<SiteHeaderNav />
				</div>
			</div>
		</header>
	)
}
