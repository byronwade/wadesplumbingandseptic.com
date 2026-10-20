import Image from "next/image"
import Link from "next/link"

import { SiteHeaderNav } from "@/components/site-header-nav"
import { siteConfig } from "@/lib/site"

export function SiteHeader() {
	return (
		<header className="bg-ink sticky top-0 z-50 text-white shadow-[0_1px_0_0_rgba(0,0,0,0.45)]">
			<div className="bg-ink-soft hidden sm:block">
				<div className="container-shell text-on-dark-muted flex items-center justify-between gap-4 py-2 text-xs font-bold">
					<span>{siteConfig.hours}</span>
					<Link prefetch={false}
						className="transition-colors hover:text-white"
						href="/service-areas"

					>
						{siteConfig.serviceArea}
					</Link>
				</div>
			</div>

			{/* Relative shell so mega-menu viewports span the full header width */}
			<div className="relative">
				<div className="container-shell flex h-16 items-center justify-between gap-3 sm:h-18">
					{/*
					  The brand gets whatever the controls leave. The query is in rem, so
					  with enlarged text the wordmark steps aside before it can run under
					  the search and call buttons; the mark and the link name stay.
					*/}
					<div className="@container min-w-0 flex-1 lg:@container-normal lg:flex-initial">
						<Link prefetch={false}
							className="flex max-w-full items-center gap-2.5 sm:gap-3"
							href="/"
							aria-label="Wade's Plumbing & Septic home"

						>
							<Image
								alt="Wade's Plumbing & Septic logo"
								className="size-10 shrink-0 rounded-md sm:size-11"
								height={44}
								priority
								src="/images/brand/wades-mark-sm.webp"
								width={44}
							/>
							<span className="min-w-0 leading-none @max-[7.5rem]:hidden">
								<span className="font-display block text-[0.9375rem] lg:whitespace-nowrap leading-tight font-extrabold tracking-[-0.03em] text-white sm:text-lg">
									Wade&apos;s Plumbing
								</span>
								<span className="text-primary-bright mt-1 block font-mono text-[0.625rem] leading-none font-semibold tracking-[0.2em] uppercase">
									&amp; Septic
								</span>
							</span>
						</Link>
					</div>

					<SiteHeaderNav />
				</div>
			</div>
		</header>
	)
}
