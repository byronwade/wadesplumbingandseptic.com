import type { ArchiveItem } from "@/lib/archive"
import {
	serviceAreaLocations,
	type ServiceAreaLocation,
} from "@/lib/service-areas"

function mentionCount(text: string, name: string) {
	const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
	if (name.toLowerCase() === "santa cruz") {
		return [...text.matchAll(/\bsanta cruz\b(?!\s+county)/gi)].length
	}
	return [...text.matchAll(new RegExp(`\\b${escaped}\\b`, "gi"))].length
}

export function townArchiveItem(location: ServiceAreaLocation): ArchiveItem {
	return {
		slug: location.slug,
		title: `${location.name} plumbing and septic`,
		description: `Plumbing and septic service in ${location.name}, ${location.county}. Quotes are free.`,
		category: location.county,
		href: location.href,
	}
}

/** Towns named in the copy, then featured hubs so every guide has 1 to 3 local links. */
export function relatedTownsFor(
	text: string,
	limit = 3,
): ServiceAreaLocation[] {
	const scored = serviceAreaLocations
		.map((location) => ({
			location,
			score: mentionCount(text, location.name) + (location.featured ? 0.1 : 0),
		}))
		.sort((left, right) => right.score - left.score)

	const mentioned = scored
		.filter((item) => item.score >= 1)
		.slice(0, limit)
		.map((item) => item.location)
	if (mentioned.length >= limit) return mentioned

	const used = new Set(mentioned.map((item) => item.slug))
	const featured = serviceAreaLocations.filter(
		(location) => location.featured && !used.has(location.slug),
	)
	return [...mentioned, ...featured].slice(0, limit)
}
