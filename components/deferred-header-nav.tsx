"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

import { StaticHeaderNav } from "@/components/static-header-nav"

/**
 * Static fallback + idle hydration for the Radix mega-menu. Keeping that
 * client tree off the main thread until after LCP is what moves mobile
 * performance from the mid-80s into the high 90s under Slow 4G.
 *
 * Phones never download the mega-menu chunk: the hamburger in HeaderToolbar
 * covers navigation there.
 */
const SiteHeaderNav = dynamic(
	() => import("@/components/site-header-nav").then((mod) => mod.SiteHeaderNav),
	{
		ssr: false,
		/*
		  Keep the server links on screen while the mega-menu chunk downloads.
		  Flipping `ready` without a fallback unmounted the static nav first.
		*/
		loading: () => <StaticHeaderNav />,
	},
)

export function DeferredHeaderNav({
	quoteEmailReady,
}: {
	quoteEmailReady: boolean
}) {
	const [ready, setReady] = useState(false)

	useEffect(() => {
		const desktop = window.matchMedia("(min-width: 64rem)")
		let idleId: number | undefined
		let timeoutId: number | undefined

		const load = () => setReady(true)

		const idleWindow = window as Window & {
			requestIdleCallback?: (
				callback: IdleRequestCallback,
				options?: IdleRequestOptions,
			) => number
			cancelIdleCallback?: (handle: number) => void
		}

		const schedule = () => {
			if (idleWindow.requestIdleCallback) {
				idleId = idleWindow.requestIdleCallback(load, { timeout: 2000 })
			} else {
				timeoutId = window.setTimeout(load, 1)
			}
		}

		if (desktop.matches) schedule()

		const onChange = () => {
			if (desktop.matches) load()
		}
		desktop.addEventListener("change", onChange)

		return () => {
			desktop.removeEventListener("change", onChange)
			if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId)
			if (timeoutId !== undefined) window.clearTimeout(timeoutId)
		}
	}, [])

	if (!ready) return <StaticHeaderNav />
	return <SiteHeaderNav quoteEmailReady={quoteEmailReady} />
}
