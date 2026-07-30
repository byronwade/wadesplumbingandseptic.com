export type ServiceAreaCounty = "Santa Cruz County" | "Santa Clara County"

export type ServiceAreaLocation = {
	name: string
	slug: string
	href: string
	county: ServiceAreaCounty
	/** MapLibre position: [longitude, latitude] */
	coordinates: [number, number]
	/** Show as a labeled map marker (keep density readable). */
	featured?: boolean
}

export const serviceAreaLocations: ServiceAreaLocation[] = [
	{
		name: "Santa Cruz",
		slug: "santa-cruz",
		href: "/service-area/santa-cruz-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-122.0308, 36.9741],
		featured: true,
	},
	{
		name: "Watsonville",
		slug: "watsonville",
		href: "/service-area/watsonville-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-121.7569, 36.9102],
		featured: true,
	},
	{
		name: "Scotts Valley",
		slug: "scotts-valley",
		href: "/service-area/scotts-valley-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-122.0147, 37.0511],
		featured: true,
	},
	{
		name: "Capitola",
		slug: "capitola",
		href: "/service-area/capitola-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-121.9533, 36.9752],
		featured: true,
	},
	{
		name: "Aptos",
		slug: "aptos",
		href: "/service-area/aptos-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-121.8994, 36.9772],
		featured: true,
	},
	{
		name: "Live Oak",
		slug: "live-oak",
		href: "/service-area/live-oak-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-121.9805, 36.9816],
		featured: true,
	},
	{
		name: "Soquel",
		slug: "soquel",
		href: "/service-area/soquel-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-121.9566, 36.988],
	},
	{
		name: "Felton",
		slug: "felton",
		href: "/service-area/felton-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-122.0733, 37.0513],
		featured: true,
	},
	{
		name: "Ben Lomond",
		slug: "ben-lomond",
		href: "/service-area/ben-lomond-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-122.0863, 37.0891],
	},
	{
		name: "Boulder Creek",
		slug: "boulder-creek",
		href: "/service-area/boulder-creek-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-122.1227, 37.1261],
		featured: true,
	},
	{
		name: "Brookdale",
		slug: "brookdale",
		href: "/service-area/brookdale-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-122.1061, 37.1058],
	},
	{
		name: "Davenport",
		slug: "davenport",
		href: "/service-area/davenport-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-122.1916, 37.0116],
	},
	{
		name: "Freedom",
		slug: "freedom",
		href: "/service-area/freedom-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-121.7733, 36.9405],
	},
	{
		name: "Corralitos",
		slug: "corralitos",
		href: "/service-area/corralitos-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-121.8044, 36.9894],
	},
	{
		name: "La Selva Beach",
		slug: "la-selva-beach",
		href: "/service-area/la-selva-beach-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-121.8447, 36.9352],
	},
	{
		name: "Rio Del Mar",
		slug: "rio-del-mar",
		href: "/service-area/rio-del-mar-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-121.885, 36.9683],
	},
	{
		name: "Pasatiempo",
		slug: "pasatiempo",
		href: "/service-area/pasatiempo-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-122.0269, 37.0055],
	},
	{
		name: "Mount Hermon",
		slug: "mount-hermon",
		href: "/service-area/mount-hermon-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-122.0591, 37.0511],
	},
	{
		name: "Bonny Doon",
		slug: "bonny-doon",
		href: "/service-area/bonny-doon-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-122.14, 37.0419],
	},
	{
		name: "Zayante",
		slug: "zayante",
		href: "/service-area/zayante-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-122.0416, 37.0836],
	},
	{
		name: "Lompico",
		slug: "lompico",
		href: "/service-area/lompico-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-122.0527, 37.1113],
	},
	{
		name: "Amesti",
		slug: "amesti",
		href: "/service-area/amesti-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-121.778, 36.9636],
	},
	{
		name: "Interlaken",
		slug: "interlaken",
		href: "/service-area/interlaken-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-121.7344, 36.9455],
	},
	{
		name: "Las Lomas",
		slug: "las-lomas",
		href: "/service-area/las-lomas-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-121.7352, 36.8652],
	},
	{
		name: "Twin Lakes",
		slug: "twin-lakes",
		href: "/service-area/twin-lakes-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-121.995, 36.9608],
	},
	{
		name: "Paradise Park",
		slug: "paradise-park",
		href: "/service-area/paradise-park-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-122.048, 37.01],
	},
	{
		name: "Day Valley",
		slug: "day-valley",
		href: "/service-area/day-valley-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-121.855, 37.008],
	},
	{
		name: "Aptos Hills-Larkin Valley",
		slug: "aptos-hills-larkin-valley",
		href: "/service-area/aptos-hills-larkin-valley-ca-plumbing-septic-services",
		county: "Santa Cruz County",
		coordinates: [-121.85, 36.99],
	},
	{
		name: "Los Gatos",
		slug: "los-gatos",
		href: "/service-area/los-gatos-ca-plumbing-septic-services",
		county: "Santa Clara County",
		coordinates: [-121.9827, 37.2266],
		featured: true,
	},
	{
		name: "Saratoga",
		slug: "saratoga",
		href: "/service-area/saratoga-ca-plumbing-septic-services",
		county: "Santa Clara County",
		coordinates: [-122.0263, 37.2638],
		featured: true,
	},
]

export const serviceAreaMapCenter: [number, number] = [-121.95, 37.08]
export const serviceAreaMapZoom = 9.4

/** Southwest → northeast bounds covering Santa Cruz County + Los Gatos & Saratoga. */
export const serviceAreaMapBounds: [[number, number], [number, number]] = [
	[-122.35, 36.84],
	[-121.55, 37.32],
]

export function locationsByCounty(county: ServiceAreaCounty) {
	return serviceAreaLocations.filter((location) => location.county === county)
}
