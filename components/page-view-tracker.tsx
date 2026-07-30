"use client"

import { useEffect } from "react"

import type { PageViewKind } from "@/lib/page-views/types"

/**
 * Fires once per mount after the page is interactive. Unique counting is
 * enforced server-side via an httpOnly cookie — this beacon only reports the
 * page identity.
 */
export function PageViewTracker({
	kind,
	slug,
}: {
	kind: PageViewKind
	slug: string
}) {
	useEffect(() => {
		const controller = new AbortController()

		const send = () => {
			void fetch("/api/page-view", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ kind, slug }),
				keepalive: true,
				signal: controller.signal,
			}).catch(() => {
				/* Beacon failures must never affect the page. */
			})
		}

		if (typeof window.requestIdleCallback === "function") {
			const id = window.requestIdleCallback(send, { timeout: 2000 })
			return () => {
				controller.abort()
				window.cancelIdleCallback?.(id)
			}
		}

		const timer = window.setTimeout(send, 400)
		return () => {
			controller.abort()
			window.clearTimeout(timer)
		}
	}, [kind, slug])

	return null
}
