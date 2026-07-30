/**
 * Service category archives. Shared by the route and the sitemap so the
 * inventory cannot drift.
 */
export const serviceCategories = {
	plumbing: {
		label: "Plumbing",
		contentCategory: "Plumbing",
		description:
			"Residential plumbing repairs, drains, water heaters, fixtures, piping, sewers, and specialty diagnostics.",
		image: "/images/work/precision-valve-installation.webp",
	},
	"residential-plumbing": {
		label: "Residential Plumbing",
		contentCategory: "Plumbing",
		description:
			"Complete plumbing service for homes, including repairs, replacements, maintenance, and urgent repairs.",
		image: "/images/services/drain-clearing.webp",
	},
	commercial: {
		label: "Commercial",
		contentCategory: "Commercial",
		description:
			"Commercial repairs, maintenance, drains, grease traps, backflow devices, water heaters, and septic support.",
		image: "/images/services/commercial-plumbing.webp",
	},
	"commercial-plumbing": {
		label: "Commercial Plumbing",
		contentCategory: "Commercial",
		description:
			"Professional plumbing service that helps businesses minimize downtime and maintain safe, code-compliant systems.",
		image: "/images/work/commercial-plumbing-installation.webp",
	},
	septic: {
		label: "Septic",
		contentCategory: "Septic",
		description:
			"Septic inspections, diagnostics, repairs, maintenance, permitting, installation, and engineered treatment systems.",
		image: "/images/work/engineered-septic-hero.webp",
	},
	"septic-services": {
		label: "Septic Services",
		contentCategory: "Septic",
		description:
			"Complete conventional and advanced septic support for tanks, pumps, controls, treatment, and drain fields.",
		image: "/images/work/completed-multi-tank.webp",
	},
	"emergency-services": {
		label: "Urgent Repairs",
		contentCategory: "Plumbing",
		description:
			"Call-first support during business hours for active leaks, burst pipes, sewer backups, failed water heaters, and other time-sensitive plumbing problems.",
		image: "/images/work/drain-cleaning-equipment.webp",
	},
	"specialty-services": {
		label: "Specialty Services",
		contentCategory: "Plumbing",
		description:
			"Advanced inspection, hydro jetting, trenchless work, smoke testing, water treatment, and difficult plumbing diagnostics.",
		image: "/images/work/new-construction-rough-in.webp",
	},
} as const

export type ServiceCategorySlug = keyof typeof serviceCategories

export const serviceCategorySlugs = Object.keys(
	serviceCategories,
) as ServiceCategorySlug[]
