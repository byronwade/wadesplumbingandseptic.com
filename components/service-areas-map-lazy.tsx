"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"

const ServiceAreasMap = dynamic(
	() =>
		import("@/components/service-areas-map").then((mod) => mod.ServiceAreasMap),
	{
		ssr: false,
		loading: () => (
			<div
				aria-hidden="true"
				className="bg-muted/50 border-border h-[min(62vh,30rem)] w-full animate-pulse rounded-lg border"
			/>
		),
	},
)

/**
 * MapLibre is ~550KB. Keep it out of the initial service-areas graph and only
 * mount once the map shell is near the viewport.
 */
export function ServiceAreasMapLazy() {
	const shellRef = useRef<HTMLDivElement>(null)
	const [shouldLoad, setShouldLoad] = useState(false)

	useEffect(() => {
		const node = shellRef.current
		if (!node || shouldLoad) return

		if (typeof IntersectionObserver === "undefined") {
			setShouldLoad(true)
			return
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					setShouldLoad(true)
					observer.disconnect()
				}
			},
			{ rootMargin: "240px 0px" },
		)

		observer.observe(node)
		return () => observer.disconnect()
	}, [shouldLoad])

	return (
		<div ref={shellRef}>
			{shouldLoad ? (
				<ServiceAreasMap />
			) : (
				<div
					aria-hidden="true"
					className="bg-muted/50 border-border h-[min(62vh,30rem)] w-full rounded-lg border"
				/>
			)}
		</div>
	)
}
