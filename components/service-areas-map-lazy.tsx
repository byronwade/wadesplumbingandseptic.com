"use client"

import dynamic from "next/dynamic"

const ServiceAreasMap = dynamic(
	() =>
		import("@/components/service-areas-map").then(
			(mod) => mod.ServiceAreasMap,
		),
	{
		ssr: false,
		loading: () => (
			<div
				aria-hidden
				className="bg-muted mx-auto min-h-[min(70vh,36rem)] w-full max-w-6xl animate-pulse rounded-lg md:min-h-[28rem]"
			/>
		),
	},
)

/** Lazy MapLibre entry so the service-areas shell can paint without the map chunk. */
export function ServiceAreasMapLazy() {
	return <ServiceAreasMap />
}
