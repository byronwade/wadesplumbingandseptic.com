import Image from "next/image"
import Link from "next/link"

import { SiteHeaderNav } from "@/components/site-header-nav"
import { siteConfig } from "@/lib/site"

export function SiteHeader() {
	return (
		<header className="bg-ink sticky top-0 z-50 text-white shadow-[0_1px_0_0_rgba(0,0,0,0.45)]">
			<div className="bg-ink-soft hidden sm:block">
				<div className="container-shell header-muted flex items-center justify-between py-2 text-xs font-semibold">
					<span>{siteConfig.hours}</span>
					<Link
						className="header-muted transition-colors hover:text-white"
						href="/service-areas"
						prefetch
					>
						{siteConfig.serviceArea}
					</Link>
				</div>
			</div>

			<div className="container-shell flex h-16 items-center justify-between gap-3 sm:h-18">
				<Link
					className="flex min-w-0 items-center gap-2.5 sm:gap-3"
					href="/"
					aria-label="Wade's Plumbing & Septic home"
					prefetch
				>
					<Image
						alt=""
						className="size-10 rounded-md sm:size-11"
						height={44}
						priority
						src="/images/brand/wades-mark.webp"
						width={44}
					/>
					<span className="leading-none">
						<span className="block text-[0.95rem] font-extrabold tracking-[-0.03em] text-white sm:text-lg">
							Wade&apos;s Plumbing
						</span>
						<span className="text-primary-bright mt-1 block text-[0.65rem] font-extrabold tracking-[0.18em] uppercase">
							&amp; Septic
						</span>
					</span>
				</Link>

				<SiteHeaderNav />
			</div>
		</header>
	)
}
