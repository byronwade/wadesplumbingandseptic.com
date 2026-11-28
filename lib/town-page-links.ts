import { coreServiceSlugs } from "@/lib/public-facts"
import {
	serviceAreaLocations,
	type ServiceAreaLocation,
} from "@/lib/service-areas"

export const townServiceCatalog: Record<
	(typeof coreServiceSlugs)[number],
	{ title: string; href: string }
> = {
	"drain-cleaning": {
		title: "Drain cleaning",
		href: "/service-offerings/drain-cleaning",
	},
	"leak-detection": {
		title: "Leak detection",
		href: "/service-offerings/leak-detection",
	},
	"pipe-repair-and-replacement": {
		title: "Pipe repair and repiping",
		href: "/service-offerings/pipe-repair-and-replacement",
	},
	"water-heater-installation": {
		title: "Water heater installation",
		href: "/service-offerings/water-heater-installation",
	},
	"hydro-jetting": {
		title: "Hydro jetting",
		href: "/service-offerings/hydro-jetting",
	},
	"engineered-septic-system-installation": {
		title: "Engineered septic installation",
		href: "/service-offerings/engineered-septic-system-installation",
	},
	"septic-tank-repair-and-replacement": {
		title: "Septic repair and replacement",
		href: "/service-offerings/septic-tank-repair-and-replacement",
	},
}

/**
 * Editorial nearby towns already used on each hub. Values must be slugs from
 * `serviceAreaLocations`; unknown slugs are dropped.
 */
const nearbyBySlug: Record<string, readonly string[]> = {
	amesti: ["watsonville", "freedom", "las-lomas", "interlaken"],
	aptos: ["rio-del-mar", "day-valley", "soquel", "aptos-hills-larkin-valley"],
	"aptos-hills-larkin-valley": ["aptos", "day-valley", "corralitos", "soquel"],
	"ben-lomond": ["felton", "boulder-creek", "brookdale"],
	"bonny-doon": ["davenport", "boulder-creek", "felton"],
	"boulder-creek": ["ben-lomond", "brookdale", "bonny-doon", "felton"],
	brookdale: ["boulder-creek", "ben-lomond"],
	capitola: ["soquel", "live-oak", "aptos"],
	corralitos: ["aptos", "watsonville", "freedom", "day-valley"],
	davenport: ["bonny-doon", "boulder-creek", "santa-cruz"],
	"day-valley": ["aptos", "aptos-hills-larkin-valley", "corralitos", "soquel"],
	felton: ["ben-lomond", "mount-hermon", "scotts-valley", "paradise-park"],
	freedom: ["watsonville", "amesti", "las-lomas", "corralitos"],
	interlaken: ["watsonville", "freedom", "la-selva-beach", "amesti"],
	"la-selva-beach": ["rio-del-mar", "aptos", "corralitos"],
	"las-lomas": ["watsonville", "freedom", "amesti", "interlaken"],
	"live-oak": ["santa-cruz", "capitola", "twin-lakes"],
	lompico: ["zayante", "boulder-creek"],
	"los-gatos": ["scotts-valley", "boulder-creek", "felton", "saratoga"],
	"mount-hermon": ["felton", "scotts-valley", "zayante"],
	"paradise-park": ["felton", "santa-cruz"],
	pasatiempo: ["scotts-valley", "santa-cruz", "bonny-doon", "felton"],
	"rio-del-mar": ["aptos", "la-selva-beach"],
	"santa-cruz": ["live-oak", "twin-lakes", "pasatiempo", "scotts-valley"],
	saratoga: ["los-gatos", "scotts-valley", "boulder-creek", "felton"],
	"scotts-valley": ["mount-hermon", "felton", "pasatiempo"],
	soquel: ["capitola", "aptos", "day-valley"],
	"twin-lakes": ["santa-cruz", "live-oak", "soquel"],
	watsonville: ["freedom", "amesti", "interlaken", "corralitos"],
	zayante: ["lompico", "felton", "mount-hermon"],
}

function toRad(value: number) {
	return (value * Math.PI) / 180
}

function kmBetween(
	a: ServiceAreaLocation["coordinates"],
	b: ServiceAreaLocation["coordinates"],
) {
	const [lng1, lat1] = a
	const [lng2, lat2] = b
	const dLat = toRad(lat2 - lat1)
	const dLng = toRad(lng2 - lng1)
	const haversine =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
	return 2 * 6371 * Math.asin(Math.sqrt(haversine))
}

export function locationFromPathname(pathname: string) {
	return serviceAreaLocations.find((location) => location.href === pathname)
}

export function townServiceLinks() {
	return coreServiceSlugs.map((slug) => townServiceCatalog[slug])
}

export function featuredTownLinks() {
	return serviceAreaLocations.filter((location) => location.featured)
}

function uniqueKnownTowns(slugs: readonly string[]) {
	const known = new Map(
		serviceAreaLocations.map((location) => [location.slug, location]),
	)
	const seen = new Set<string>()
	const towns: ServiceAreaLocation[] = []
	for (const slug of slugs) {
		if (seen.has(slug)) continue
		const location = known.get(slug)
		if (!location) continue
		seen.add(slug)
		towns.push(location)
	}
	return towns
}

function nearestTowns(location: ServiceAreaLocation, count: number) {
	return [...serviceAreaLocations]
		.filter((item) => item.slug !== location.slug)
		.sort(
			(left, right) =>
				kmBetween(location.coordinates, left.coordinates) -
				kmBetween(location.coordinates, right.coordinates),
		)
		.slice(0, count)
}

export function nearbyTownsFor(location: ServiceAreaLocation, count = 4) {
	const editorial = uniqueKnownTowns(nearbyBySlug[location.slug] ?? []).filter(
		(item) => item.slug !== location.slug,
	)
	if (editorial.length >= 2) return editorial.slice(0, count)
	return nearestTowns(location, count)
}

export const townGuideLinks = [
	{
		href: "/septic-solutions",
		title: "Septic solutions",
	},
	{
		href: "/compare/conventional-vs-engineered-septic",
		title: "Conventional vs engineered septic",
	},
	{
		href: "/maintenance-guide",
		title: "Plumbing and septic maintenance schedule",
	},
	{
		href: "/how-to-locate-trustworthy-plumbing-services-nearby",
		title: "How to choose a plumber",
	},
] as const
