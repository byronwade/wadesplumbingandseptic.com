"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useState } from "react"

import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import { cn } from "@/lib/utils"

/**
 * Static fallback + idle hydration for the Radix mega-menu. Keeping that
 * client tree off the main thread until after LCP is what moves mobile
 * performance from the mid-80s into the high 90s under Slow 4G.
 */
const SiteHeaderNav = dynamic(
	() =>
		import("@/components/site-header-nav").then((mod) => mod.SiteHeaderNav),
	{ ssr: false },
)

function HeaderNavFallback() {
	return (
		<nav
			aria-label="Primary"
			className="flex items-center gap-2 sm:gap-3"
		>
			<div className="hidden items-center gap-1 lg:flex">
				<Link
					className="rounded-md px-3 py-2 text-sm font-bold text-white/90 transition-colors hover:text-white"
					href="/services"
					prefetch={false}
				>
					Services
				</Link>
				<Link
					className="rounded-md px-3 py-2 text-sm font-bold text-white/90 transition-colors hover:text-white"
					href="/service-areas"
					prefetch={false}
				>
					Areas
				</Link>
				<Link
					className="rounded-md px-3 py-2 text-sm font-bold text-white/90 transition-colors hover:text-white"
					href="/expert-tips"
					prefetch={false}
				>
					Tips
				</Link>
				<Link
					className="rounded-md px-3 py-2 text-sm font-bold text-white/90 transition-colors hover:text-white"
					href="/contact"
					prefetch={false}
				>
					Contact
				</Link>
			</div>
			<a
				className={cn(
					buttonVariants({ size: "sm", variant: "default" }),
					"inline-flex gap-2",
				)}
				href={contactInfo.phoneHref}
			>
				Call {contactInfo.phoneDisplay}
			</a>
		</nav>
	)
}

export function DeferredHeaderNav() {
	const [ready, setReady] = useState(false)

	useEffect(() => {
		const idleWindow = window as Window & {
			requestIdleCallback?: (
				callback: IdleRequestCallback,
				options?: IdleRequestOptions,
			) => number
			cancelIdleCallback?: (handle: number) => void
		}

		if (idleWindow.requestIdleCallback) {
			const id = idleWindow.requestIdleCallback(() => setReady(true), {
				timeout: 2000,
			})
			return () => idleWindow.cancelIdleCallback?.(id)
		}

		const timer = globalThis.setTimeout(() => setReady(true), 1)
		return () => globalThis.clearTimeout(timer)
	}, [])

	if (!ready) return <HeaderNavFallback />
	return <SiteHeaderNav />
}
