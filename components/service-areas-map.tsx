"use client"

import { useEffect, useState } from "react"
import type { FillLayerSpecification, LineLayerSpecification } from "maplibre-gl"

import {
	Map,
	MapControls,
	MapGeoJSON,
	MapPopup,
	useMap,
} from "@/components/ui/map"
import {
	serviceAreasGeoJSON,
	type ServiceAreaFeatureProperties,
} from "@/lib/service-areas-geojson"
import {
	serviceAreaMapBounds,
	serviceAreaMapCenter,
	serviceAreaMapZoom,
} from "@/lib/service-areas"
import { cn } from "@/lib/utils"

/** Brand tokens from globals.css — MapLibre paint needs concrete colors. */
const BRAND = {
	primary: "#8f4a1a",
	primaryBright: "#e0a15d",
	ink: "#101214",
} as const

const fillPaint = {
	"fill-color": [
		"match",
		["get", "tier"],
		"primary",
		BRAND.primary,
		"secondary",
		BRAND.primaryBright,
		BRAND.primary,
	],
	"fill-opacity": [
		"match",
		["get", "tier"],
		"primary",
		0.42,
		"secondary",
		0.28,
		0.35,
	],
} as FillLayerSpecification["paint"]

const linePaint = {
	"line-color": [
		"match",
		["get", "tier"],
		"primary",
		BRAND.primary,
		"secondary",
		BRAND.ink,
		BRAND.primary,
	],
	"line-width": 2.25,
	"line-opacity": 0.92,
} as LineLayerSpecification["paint"]

const fillHoverPaint = {
	"fill-opacity": 0.58,
} as FillLayerSpecification["paint"]

function FitServiceAreaBounds() {
	const { map, isLoaded } = useMap()

	useEffect(() => {
		if (!map || !isLoaded) return
		map.fitBounds(serviceAreaMapBounds, {
			padding: { top: 56, bottom: 56, left: 48, right: 48 },
			duration: 0,
			maxZoom: 10,
		})
	}, [map, isLoaded])

	return null
}

export function ServiceAreasMap() {
	const [selected, setSelected] = useState<{
		longitude: number
		latitude: number
		properties: ServiceAreaFeatureProperties
	} | null>(null)

	return (
		<div className="space-y-3">
			<div className="border-border bg-card relative h-[min(70vh,36rem)] min-h-[22rem] overflow-hidden rounded-lg border shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]">
				<Map
					center={serviceAreaMapCenter}
					className="absolute inset-0 size-full"
					theme="light"
					zoom={serviceAreaMapZoom}
					fadeDuration={0}
				>
					<FitServiceAreaBounds />
					<MapControls position="bottom-right" showZoom showFullscreen />
					<MapGeoJSON<ServiceAreaFeatureProperties>
						data={serviceAreasGeoJSON}
						promoteId="id"
						interactive
						fillPaint={fillPaint}
						linePaint={linePaint}
						fillHoverPaint={fillHoverPaint}
						onClick={(event) => {
							setSelected({
								longitude: event.longitude,
								latitude: event.latitude,
								properties: event.feature.properties,
							})
						}}
					/>
					{selected ? (
						<MapPopup
							longitude={selected.longitude}
							latitude={selected.latitude}
							onClose={() => setSelected(null)}
							closeOnClick={false}
							focusAfterOpen={false}
							closeButton
							className="min-w-52"
						>
							<div className="space-y-1.5 p-1">
								<p className="text-sm font-extrabold tracking-[-0.02em]">
									{selected.properties.name}
								</p>
								<p className="text-muted-foreground text-xs font-bold">
									{selected.properties.tier === "primary"
										? "Primary coverage"
										: "Selected communities"}
								</p>
								<p className="text-muted-foreground text-xs leading-relaxed">
									{selected.properties.description}
								</p>
							</div>
						</MapPopup>
					) : null}
				</Map>
			</div>

			<ul className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-bold">
				<li className="flex items-center gap-2">
					<span
						aria-hidden="true"
						className={cn("size-3 rounded-sm")}
						style={{ backgroundColor: BRAND.primary }}
					/>
					Santa Cruz County (primary)
				</li>
				<li className="flex items-center gap-2">
					<span
						aria-hidden="true"
						className={cn("size-3 rounded-sm")}
						style={{ backgroundColor: BRAND.primaryBright }}
					/>
					Selected Santa Clara communities
				</li>
			</ul>
		</div>
	)
}
