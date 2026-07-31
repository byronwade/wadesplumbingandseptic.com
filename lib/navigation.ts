export type NavLink = {
	href: string
	label: string
	description?: string
}

export type MegaNavItem = NavLink & {
	icon:
		| "wrench"
		| "droplets"
		| "building"
		| "siren"
		| "users"
		| "star"
		| "briefcase"
		| "phone"
		| "badge"
		| "wallet"
		| "shield"
		| "help"
}

export const serviceNavLinks: MegaNavItem[] = [
	{
		href: "/services",
		label: "All Services",
		description:
			"Browse plumbing, septic, and commercial work across Santa Cruz County.",
		icon: "wrench",
	},
	{
		href: "/service-category/plumbing",
		label: "Residential Plumbing",
		description:
			"Leaks, drains, fixtures, water heaters, and whole-home repairs.",
		icon: "droplets",
	},
	{
		href: "/service-category/septic",
		label: "Septic Systems",
		description: "Inspections, pumping, repairs, and engineered installs.",
		icon: "badge",
	},
	{
		href: "/service-category/commercial",
		label: "Commercial Plumbing",
		description: "Business, restaurant, and multi-unit service.",
		icon: "building",
	},
	{
		href: "/service-category/emergency-services",
		label: "Urgent Repairs",
		description:
			"Priority help for leaks, backups, and time-sensitive repairs.",
		icon: "siren",
	},
]

export const serviceMegaHighlights = [
	{
		href: "/service-offerings/engineered-septic-system-installation",
		label: "Engineered Septic Systems",
		description: "ATUs, mounds, and advanced installs for hard sites.",
	},
	{
		href: "/service-offerings/septic-tank-cleaning-and-pumping",
		label: "Septic Pumping",
		description: "Keep your system healthy before problems start.",
	},
	{
		href: "/service-offerings/hydro-jetting",
		label: "Hydro Jetting",
		description: "High-pressure clearing for stubborn drain buildup.",
	},
] as const

export const companyNavLinks: MegaNavItem[] = [
	{
		href: "/about-us",
		label: "About Us",
		description: "Family-owned local plumbing and septic team.",
		icon: "users",
	},
	{
		href: "/testimonials",
		label: "Customer Reviews",
		description: "What homeowners and partners say about Wade’s.",
		icon: "star",
	},
	{
		href: "/careers",
		label: "Careers",
		description: "Join the Wade’s field and office team.",
		icon: "briefcase",
	},
	{
		href: "/contact",
		label: "Contact",
		description: "Call, message, or request a free quote.",
		icon: "phone",
	},
	{
		href: "/faq",
		label: "FAQ",
		description: "Straight answers about service, timing, and next steps.",
		icon: "help",
	},
	{
		href: "/financing",
		label: "Financing",
		description: "Options that make larger projects more manageable.",
		icon: "wallet",
	},
	{
		href: "/warranties",
		label: "Warranties",
		description: "Coverage details for workmanship and materials.",
		icon: "shield",
	},
]

/** Top-level links shown after Services and before Company. */
export const midNavLinks: NavLink[] = [
	{ href: "/service-areas", label: "Service Area" },
	{ href: "/expert-tips", label: "Expert Tips" },
]

export const primaryNavLinks: NavLink[] = [
	{ href: "/", label: "Home" },
	...midNavLinks,
]
