export const siteConfig = {
	name: "Wade's Plumbing & Septic",
	shortName: "Wade's",
	description:
		"Family-owned plumbing and septic specialists serving Santa Cruz County and nearby Santa Clara foothill communities.",
	/** Preferred host matches production redirects (apex → www). */
	url: "https://www.wadesplumbingandseptic.com",
	phone: "831.225.4344",
	phoneHref: "tel:+18312254344",
	email: "support@wadesinc.io",
	hours: "Mon to Fri 9:00am to 5:00pm",
	address: {
		street: "7737 Highway 9",
		city: "Ben Lomond",
		region: "CA",
		postalCode: "95005",
		display: "7737 Highway 9, Ben Lomond, CA 95005",
	},
	/** WGS84 for LocalBusiness geo / map links. */
	geo: {
		latitude: 37.0891,
		longitude: -122.0864,
	},
	licenses: "CA CSLB #1087260 (C-36 Plumbing, C-42 Sanitation System)",
	licenseNumber: "1087260",
	googleMapsUrl:
		"https://maps.google.com/?q=7737+Highway+9,+Ben+Lomond,+CA+95005",
	serviceArea: "Santa Cruz County & selected Santa Clara County, CA",
	social: {
		facebook: "https://www.facebook.com/wadesplumbingandseptic/",
		instagram: "https://www.instagram.com/wadesplumbing/",
		linkedin: "https://www.linkedin.com/company/wades-plumbing-septic",
	},
} as const

export const primaryNavigation = [
	{ href: "/", label: "Home" },
	{ href: "/services", label: "Services" },
	{ href: "/service-areas", label: "Service Area" },
	{ href: "/expert-tips", label: "Expert Tips" },
	{ href: "/about-us", label: "Company" },
] as const

export const companyNavigation = [
	{ href: "/about-us", label: "About Us" },
	{ href: "/testimonials", label: "Customer Reviews" },
	{ href: "/faq", label: "FAQ" },
	{ href: "/financing", label: "Financing" },
	{ href: "/warranties", label: "Warranties" },
	{ href: "/careers", label: "Careers" },
	{ href: "/contact", label: "Contact Us" },
] as const

export const resourceNavigation = [
	{ href: "/expert-tips", label: "Expert Tips & Blog" },
	{ href: "/maintenance-guide", label: "Maintenance Guide" },
	{ href: "/glossary", label: "Plumbing & Septic Glossary" },
	{ href: "/glossary/plumbing", label: "Plumbing Glossary" },
	{ href: "/glossary/septic", label: "Septic Glossary" },
	{
		href: "/compare/conventional-vs-engineered-septic",
		label: "Septic System Comparison",
	},
	{ href: "/septic-solutions", label: "Septic Solutions" },
] as const
