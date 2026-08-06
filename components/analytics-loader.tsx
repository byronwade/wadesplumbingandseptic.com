"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const Analytics = dynamic(
	() => import("@vercel/analytics/next").then((mod) => mod.Analytics),
	{ ssr: false },
)

/**
 * Defers Vercel Analytics until the browser is idle so it does not compete
 * with LCP / hydration on marketing pages.
 *
 * Only mount on Vercel: `/_vercel/insights/script.js` 404s elsewhere and
 * fails Lighthouse Best Practices (console errors / MIME refusals).
 */
export function AnalyticsLoader() {
	const [ready, setReady] = useState(false)
	const onVercel = Boolean(process.env.NEXT_PUBLIC_VERCEL_ENV)

	useEffect(() => {
		if (!onVercel) return

		const idleWindow = window as Window & {
			requestIdleCallback?: (
				callback: IdleRequestCallback,
				options?: IdleRequestOptions,
			) => number
			cancelIdleCallback?: (handle: number) => void
		}

		if (idleWindow.requestIdleCallback) {
			const id = idleWindow.requestIdleCallback(() => setReady(true), {
				timeout: 2500,
			})
			return () => idleWindow.cancelIdleCallback?.(id)
		}

		const timer = globalThis.setTimeout(() => setReady(true), 400)
		return () => globalThis.clearTimeout(timer)
	}, [onVercel])

	if (!(onVercel && ready)) return null
	return <Analytics />
}
