import Image from "next/image"
import Link from "next/link"

import { SiteHeaderNav } from "@/components/site-header-nav"
import { siteConfig } from "@/lib/site"

export function SiteHeader() {
	return (
		<header className="bg-ink sticky top-0 z-50 border-b border-white/15 text-white">
			<div className="bg-ink-soft hidden border-b border-white/15 sm:block">
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

			<div className="container-shell flex h-18 items-center justify-between gap-4">
				<Link
					className="flex min-w-0 items-center gap-3"
					href="/"
					aria-label="Wade's Plumbing & Septic home"
					prefetch
				>
					<span className="grid size-11 shrink-0 place-items-center rounded-md bg-white p-1">
						<Image
							alt=""
							height={40}
							priority
							src="/images/brand/wades-mark.webp"
							width={40}
						/>
					</span>
					<span className="leading-none">
						<span className="block text-base font-extrabold tracking-[-0.03em] text-white sm:text-lg">
							Wade&apos;s Plumbing
						</span>
						<span className="text-primary-bright mt-1 block text-[0.68rem] font-extrabold tracking-[0.18em] uppercase">
							&amp; Septic
						</span>
					</span>
				</Link>

				<SiteHeaderNav />
			</div>
		</header>
	)
}
