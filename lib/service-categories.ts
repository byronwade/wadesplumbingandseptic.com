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
	commercial: {
		label: "Commercial",
		contentCategory: "Commercial",
		description:
			"Commercial repairs, maintenance, drains, grease traps, backflow devices, water heaters, and septic support.",
		image: "/images/services/commercial-plumbing.webp",
	},
	septic: {
		label: "Septic",
		contentCategory: "Septic",
		description:
			"Septic inspections, diagnostics, repairs, maintenance, permitting, installation, and engineered treatment systems.",
		image: "/images/work/engineered-septic-hero.webp",
	},
} as const

export type ServiceCategorySlug = keyof typeof serviceCategories

export const serviceCategorySlugs = Object.keys(
	serviceCategories,
) as ServiceCategorySlug[]
