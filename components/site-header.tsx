import Image from "next/image"
import Link from "next/link"
import { Menu, Phone } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { primaryNavigation, siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

export function SiteHeader() {
	return (
		<header className="bg-ink/95 sticky top-0 z-50 border-b border-white/10 text-white backdrop-blur-md">
			<div className="hidden border-b border-white/10 bg-black/40 sm:block">
				<div className="container-shell flex items-center justify-between py-2 text-xs text-white/65">
					<span>{siteConfig.hours}</span>
					<Link
						className="font-semibold transition-colors hover:text-white"
						href="/service-areas"
					>
						{siteConfig.serviceArea}
					</Link>
				</div>
			</div>

			<div className="container-shell flex h-18 items-center justify-between">
				<Link
					className="flex items-center gap-3"
					href="/"
					aria-label="Wade's Plumbing & Septic home"
				>
					<span className="grid size-11 place-items-center rounded-md bg-white p-1">
						<Image
							alt=""
							height={40}
							priority
							src="/images/brand/wades-mark.webp"
							width={40}
						/>
					</span>
					<span className="leading-none">
						<span className="block text-base font-extrabold tracking-[-0.03em] sm:text-lg">
							Wade&apos;s Plumbing
						</span>
						<span className="text-primary-bright mt-1 block text-[0.68rem] font-extrabold tracking-[0.18em] uppercase">
							&amp; Septic
						</span>
					</span>
				</Link>

				<nav
					className="hidden items-center gap-7 lg:flex"
					aria-label="Primary navigation"
				>
					{primaryNavigation.map((item) => (
						<Link
							className="hover:text-primary-bright text-sm font-bold text-white/80 transition-colors"
							href={item.href}
							key={item.href}
							prefetch
						>
							{item.label}
						</Link>
					))}
				</nav>

				<div className="hidden items-center gap-3 sm:flex">
					<a
						className={cn(buttonVariants({ size: "lg" }), "gap-2")}
						href={siteConfig.phoneHref}
					>
						<Phone aria-hidden="true" />
						{siteConfig.phone}
					</a>
				</div>

				<details className="group relative sm:hidden">
					<summary className="grid size-11 cursor-pointer list-none place-items-center rounded-md border border-white/15 bg-white/5 [&::-webkit-details-marker]:hidden">
						<Menu aria-hidden="true" className="size-5" />
						<span className="sr-only">Open main menu</span>
					</summary>
					<nav
						className="bg-panel-elevated absolute top-14 right-0 w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-white/10 p-2"
						aria-label="Mobile navigation"
					>
						{primaryNavigation.map((item) => (
							<Link
								className="hover:text-primary-bright block rounded-md px-4 py-3 font-bold transition-colors hover:bg-white/5"
								href={item.href}
								key={item.href}
								prefetch
							>
								{item.label}
							</Link>
						))}
						<a
							className={cn(buttonVariants({ size: "lg" }), "mt-2 flex w-full")}
							href={siteConfig.phoneHref}
						>
							<Phone aria-hidden="true" />
							Call {siteConfig.phone}
						</a>
					</nav>
				</details>
			</div>
		</header>
	)
}
