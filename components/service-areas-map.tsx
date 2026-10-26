"use client"

import { useEffect, useState } from "react"
import type {
	FillLayerSpecification,
	LineLayerSpecification,
} from "maplibre-gl"

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

/** Brand tokens from globals.css - MapLibre paint needs concrete colors. */
const BRAND = {
	primary: "#8f4a1a",
	primaryBright: "#e0a15d",
	ink: "#101214",
} as const

/** OpenFreeMap - reliable free vector basemap (Carto tiles often leave a blank white canvas). */
const mapStyles = {
	light: "https://tiles.openfreemap.org/styles/positron",
	dark: "https://tiles.openfreemap.org/styles/dark",
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
		0.45,
		"secondary",
		0.32,
		0.4,
	],
} satisfies FillLayerSpecification["paint"]

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
	"line-opacity": 0.95,
} satisfies LineLayerSpecification["paint"]

const fillHoverPaint = {
	"fill-opacity": 0.62,
} satisfies FillLayerSpecification["paint"]

function FitServiceAreaBounds() {
	const { map, isLoaded } = useMap()

	useEffect(() => {
		if (!map || !isLoaded) return

		const fit = () => {
			const narrow =
				typeof window !== "undefined" &&
				window.matchMedia("(max-width: 767px)").matches

			map.resize()
			map.fitBounds(serviceAreaMapBounds, {
				padding: narrow
					? { top: 36, bottom: 36, left: 20, right: 20 }
					: { top: 56, bottom: 56, left: 48, right: 48 },
				duration: 0,
				maxZoom: narrow ? 10.5 : 11,
			})
		}

		const frame = requestAnimationFrame(fit)
		const media = window.matchMedia("(max-width: 767px)")
		const onChange = () => fit()
		media.addEventListener("change", onChange)

		return () => {
			cancelAnimationFrame(frame)
			media.removeEventListener("change", onChange)
		}
	}, [map, isLoaded])

	return null
}

/**
 * Insert coverage fill/line under basemap label layers so city names stay
 * crisp (not copper-tinted through a translucent fill sitting on top).
 */
function useBasemapLabelLayerId() {
	const { map, isLoaded } = useMap()
	const [beforeId, setBeforeId] = useState<string | undefined>()
	const [ready, setReady] = useState(false)

	useEffect(() => {
		if (!map || !isLoaded) return

		const resolve = (forceReady = false) => {
			const layers = map.getStyle()?.layers
			if (!layers?.length) return
			const firstSymbol = layers.find((layer) => layer.type === "symbol")
			if (firstSymbol) {
				setBeforeId(firstSymbol.id)
				setReady(true)
				return
			}
			// Style loaded but no labels yet - wait unless idle already fired.
			if (forceReady) {
				setBeforeId(undefined)
				setReady(true)
			}
		}

		const onStyleData = () => resolve()
		const onIdle = () => resolve(true)

		resolve()
		map.on("styledata", onStyleData)
		map.once("idle", onIdle)

		return () => {
			map.off("styledata", onStyleData)
			map.off("idle", onIdle)
		}
	}, [map, isLoaded])

	return { beforeId, ready }
}

function CoverageLayers({
	onSelect,
}: {
	onSelect: (event: {
		longitude: number
		latitude: number
		properties: ServiceAreaFeatureProperties
	}) => void
}) {
	const { beforeId, ready } = useBasemapLabelLayerId()

	if (!ready) return null

	return (
		<MapGeoJSON<ServiceAreaFeatureProperties>
			data={serviceAreasGeoJSON}
			promoteId="id"
			interactive
			beforeId={beforeId}
			fillPaint={fillPaint}
			linePaint={linePaint}
			fillHoverPaint={fillHoverPaint}
			onClick={(event) => {
				onSelect({
					longitude: event.longitude,
					latitude: event.latitude,
					properties: event.feature.properties,
				})
			}}
		/>
	)
}

export function ServiceAreasMap() {
	const [selected, setSelected] = useState<{
		longitude: number
		latitude: number
		properties: ServiceAreaFeatureProperties
	} | null>(null)

	return (
		<div className="space-y-4">
			{/*
			  Mobile: full-bleed edge-to-edge plane.
			  Desktop: contained surface with radius inside the page shell.
			*/}
			<div
				className={cn(
					"bg-muted/40 relative w-full overflow-hidden",
					"h-[min(62vh,30rem)] min-h-[20rem] sm:h-[min(70vh,36rem)] sm:min-h-[22rem]",
					"border-border border-y",
					"md:mx-auto md:w-[min(100%-calc(var(--space-page-x)*2),var(--content-max))] md:rounded-lg md:border md:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]",
				)}
			>
				<Map
					center={serviceAreaMapCenter}
					className="h-full w-full font-sans antialiased"
					theme="light"
					styles={mapStyles}
					zoom={serviceAreaMapZoom}
					fadeDuration={0}
					cooperativeGestures
				>
					<FitServiceAreaBounds />
					<MapControls position="bottom-right" showZoom showFullscreen />
					<CoverageLayers onSelect={setSelected} />
					{selected ? (
						<MapPopup
							longitude={selected.longitude}
							latitude={selected.latitude}
							onClose={() => setSelected(null)}
							closeOnClick={false}
							focusAfterOpen={false}
							closeButton
							className="w-[min(22rem,calc(100vw-2.5rem))] max-w-none"
						>
							<div className="space-y-2.5 pr-6 font-sans antialiased">
								<p className="text-foreground font-display text-lg leading-snug font-extrabold tracking-tight">
									{selected.properties.name}
								</p>
								<p className="text-primary text-sm font-bold tracking-normal">
									{selected.properties.tier === "primary"
										? "Primary coverage"
										: "Selected coverage: confirm address"}
								</p>
								<p className="text-muted-foreground text-[0.95rem] leading-relaxed font-normal tracking-normal">
									{selected.properties.description}
								</p>
							</div>
						</MapPopup>
					) : null}
				</Map>
			</div>

			<ul className="text-muted-foreground flex flex-col items-center gap-2 px-[var(--space-page-x)] text-center text-sm sm:gap-2.5">
				<li className="flex items-center justify-center gap-2.5 font-bold">
					<span
						aria-hidden="true"
						className={cn("size-3.5 shrink-0 rounded-sm")}
						style={{ backgroundColor: BRAND.primary }}
					/>
					Service coverage: Santa Cruz County &amp; west foothills
				</li>
				<li className="max-w-xl text-sm leading-relaxed font-normal">
					Approximate area including Los Gatos &amp; Saratoga; generally west of
					Highway 101. Call to confirm your address.
				</li>
			</ul>
		</div>
	)
}
