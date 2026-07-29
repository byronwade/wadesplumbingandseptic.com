import Image from "next/image"
import Link from "next/link"
import { Menu, Phone } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { primaryNavigation, siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

export function SiteHeader() {
	return (
		<header className="sticky top-0 z-50 border-b border-white/10 bg-[#111]/95 text-white shadow-lg backdrop-blur">
			<div className="hidden border-b border-white/10 bg-black/50 sm:block">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-neutral-300 md:px-8">
					<span>{siteConfig.hours}</span>
					<Link
						className="font-semibold hover:text-white"
						href="/service-areas"
					>
						{siteConfig.serviceArea}
					</Link>
				</div>
			</div>

			<div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 md:px-8">
				<Link
					className="flex items-center gap-3"
					href="/"
					aria-label="Wade's Plumbing & Septic home"
				>
					<span className="grid size-12 place-items-center rounded-xl bg-white p-1 shadow-sm">
						<Image
							alt=""
							height={44}
							priority
							src="/images/brand/wades-mark.webp"
							width={44}
						/>
					</span>
					<span className="leading-tight">
						<span className="block text-base font-black sm:text-lg">
							Wade&apos;s Plumbing
						</span>
						<span className="text-primary-bright block text-xs font-bold tracking-[0.18em] uppercase">
							&amp; Septic
						</span>
					</span>
				</Link>

				<nav
					className="hidden items-center gap-6 lg:flex"
					aria-label="Primary navigation"
				>
					{primaryNavigation.map((item) => (
						<Link
							className="hover:text-primary-bright text-sm font-bold text-neutral-200 transition-colors"
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
					<summary className="grid size-11 cursor-pointer list-none place-items-center rounded-lg border border-white/15 bg-white/5 [&::-webkit-details-marker]:hidden">
						<Menu aria-hidden="true" className="size-5" />
						<span className="sr-only">Open main menu</span>
					</summary>
					<nav
						className="absolute top-14 right-0 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#171717] p-3 shadow-2xl"
						aria-label="Mobile navigation"
					>
						{primaryNavigation.map((item) => (
							<Link
								className="hover:text-primary-bright block rounded-lg px-4 py-3 font-bold hover:bg-white/5"
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
