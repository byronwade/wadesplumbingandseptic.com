import { cityServicePages } from "@/lib/city-service-pages"
import { serviceAreaLocations } from "@/lib/service-areas"

export type FinderService = { slug: string; label: string }

export type FinderProblem = {
	id: string
	label: string
	/** First entry is the best fit; the rest are worth a look. */
	services: [FinderService, ...FinderService[]]
}

const service = (slug: string, label: string): FinderService => ({
	slug,
	label,
})

/**
 * Everyday symptoms mapped to the service pages that cover them. Labels are
 * the visitor's words, not trade terms. CI checks every slug is a real page.
 */
export const finderProblems: FinderProblem[] = [
	{
		id: "slow-drain",
		label: "Slow or clogged drain",
		services: [
			service("drain-cleaning", "Drain Cleaning"),
			service("hydro-jetting", "Hydro Jetting"),
		],
	},
	{
		id: "sewer-backup",
		label: "Sewage backing up or sewer smell",
		services: [
			service("sewer-camera-inspection", "Sewer Camera Inspection"),
			service("drain-cleaning", "Drain Cleaning"),
			service(
				"trenchless-sewer-line-replacement",
				"Trenchless Sewer Line Replacement",
			),
		],
	},
	{
		id: "no-hot-water",
		label: "No hot water or a leaking water heater",
		services: [
			service("water-heater-installation", "Water Heater Installation"),
			service("tankless-water-heater-installation", "Tankless Water Heaters"),
		],
	},
	{
		id: "leak",
		label: "Leak, wet spot or a high water bill",
		services: [
			service("leak-detection", "Leak Detection"),
			service("pipe-repair-and-replacement", "Pipe Repair and Replacement"),
		],
	},
	{
		id: "low-pressure",
		label: "Low water pressure or a broken water line",
		services: [
			service("water-line-repair-and-installation", "Water Line Repair"),
			service("pipe-repair-and-replacement", "Pipe Repair and Replacement"),
		],
	},
	{
		id: "toilet",
		label: "Toilet keeps running or won't flush",
		services: [
			service("toilet-repair", "Toilet Repair"),
			service("drain-cleaning", "Drain Cleaning"),
		],
	},
	{
		id: "septic-alarm",
		label: "Septic alarm is going off",
		services: [
			service(
				"septic-tank-troubleshooting-and-diagnostic-services",
				"Septic Troubleshooting",
			),
			service("septic-tank-alarm-installation", "Septic Tank Alarms"),
		],
	},
	{
		id: "soggy-yard",
		label: "Soggy yard or smell near the septic field",
		services: [
			service(
				"septic-tank-leach-field-repair-and-replacement",
				"Leach Field Repair",
			),
			service(
				"septic-tank-inspection-and-assessment",
				"Septic Tank Inspection",
			),
			service(
				"engineered-septic-system-installation",
				"Engineered Septic Systems",
			),
		],
	},
	{
		id: "home-sale",
		label: "Buying or selling a home on septic",
		services: [
			service(
				"septic-tank-inspection-and-assessment",
				"Septic Tank Inspection",
			),
			service("septic-system-certification", "Septic System Certification"),
		],
	},
]

export type FinderTown = { slug: string; name: string; href: string }

export const finderTowns: FinderTown[] = serviceAreaLocations
	.map(({ slug, name, href }) => ({ slug, name, href }))
	.sort((a, b) => a.name.localeCompare(b.name))

/** "citySlug/serviceSlug" for every local service page that exists. */
export const finderSpokes: string[] = cityServicePages.map(
	(page) => `${page.citySlug}/${page.serviceSlug}`,
)
