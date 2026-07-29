"use client"

import Link from "next/link"
import { MapPin } from "lucide-react"

import {
	Map,
	MapControls,
	MapMarker,
	MarkerContent,
	MarkerPopup,
	MarkerTooltip,
} from "@/components/ui/map"
import {
	serviceAreaLocations,
	serviceAreaMapCenter,
	serviceAreaMapZoom,
	type ServiceAreaLocation,
} from "@/lib/service-areas"
import { cn } from "@/lib/utils"

function MarkerPin({ featured }: { featured?: boolean }) {
	return (
		<span
			className={cn(
				"grid size-8 place-items-center rounded-full border-2 border-white shadow-md",
				featured ? "bg-primary text-primary-foreground" : "bg-ink text-white",
			)}
		>
			<MapPin className="size-4" aria-hidden="true" />
		</span>
	)
}

function LocationPopup({ location }: { location: ServiceAreaLocation }) {
	return (
		<div className="min-w-44 space-y-1.5 p-1">
			<p className="text-sm font-extrabold tracking-[-0.02em]">
				{location.name}
			</p>
			<p className="text-muted-foreground text-xs font-bold">
				{location.county}
			</p>
			<Link
				className="text-primary text-xs font-extrabold underline-offset-2 hover:underline"
				href={location.href}
			>
				View local services
			</Link>
		</div>
	)
}

export function ServiceAreasMap() {
	return (
		<div className="border-border bg-card h-[min(70vh,36rem)] overflow-hidden rounded-lg border shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]">
			<Map
				center={serviceAreaMapCenter}
				className="size-full"
				theme="light"
				zoom={serviceAreaMapZoom}
			>
				<MapControls position="bottom-right" showZoom />
				{serviceAreaLocations.map((location) => (
					<MapMarker
						key={location.slug}
						longitude={location.coordinates[0]}
						latitude={location.coordinates[1]}
					>
						<MarkerContent>
							<MarkerPin featured={location.featured} />
						</MarkerContent>
						{location.featured ? (
							<MarkerTooltip>
								<span className="text-xs font-bold">{location.name}</span>
							</MarkerTooltip>
						) : null}
						<MarkerPopup>
							<LocationPopup location={location} />
						</MarkerPopup>
					</MapMarker>
				))}
			</Map>
		</div>
	)
}
