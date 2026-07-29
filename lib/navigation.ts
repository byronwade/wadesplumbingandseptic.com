export type NavLink = {
	href: string
	label: string
	description?: string
}

export const serviceNavLinks: NavLink[] = [
	{
		href: "/services",
		label: "All Services",
		description: "Browse plumbing, septic, and commercial work.",
	},
	{
		href: "/service-category/plumbing",
		label: "Residential Plumbing",
		description: "Leaks, drains, fixtures, water heaters, and more.",
	},
	{
		href: "/service-category/septic",
		label: "Septic Systems",
		description: "Inspections, pumping, repairs, and engineered installs.",
	},
	{
		href: "/service-category/commercial",
		label: "Commercial Plumbing",
		description: "Business, restaurant, and multi-unit service.",
	},
	{
		href: "/service-category/emergency-services",
		label: "Emergency Service",
		description: "Urgent leaks, backups, and after-hours response.",
	},
]

export const companyNavLinks: NavLink[] = [
	{
		href: "/about-us",
		label: "About Us",
		description: "Family-owned local plumbing and septic team.",
	},
	{
		href: "/testimonials",
		label: "Customer Reviews",
		description: "What homeowners and partners say.",
	},
	{
		href: "/careers",
		label: "Careers",
		description: "Join the Wade's field and office team.",
	},
	{
		href: "/contact",
		label: "Contact",
		description: "Call, message, or request a free quote.",
	},
]

export const primaryNavLinks: NavLink[] = [
	{ href: "/", label: "Home" },
	{ href: "/expert-tips", label: "Expert Tips" },
	{ href: "/service-areas", label: "Service Areas" },
]
