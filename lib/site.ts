export const siteConfig = {
	name: "Wade's Plumbing & Septic",
	shortName: "Wade's",
	description:
		"Family-owned plumbing and septic specialists serving Santa Cruz County and selected Santa Clara County communities in California.",
	url: "https://wadesplumbingandseptic.com",
	phone: "831.225.4344",
	phoneHref: "tel:+18312254344",
	email: "support@wadesinc.io",
	hours: "Mon - Fri 9:00am - 5:00pm",
	licenses: "CA: CSLB #1087260",
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
	{ href: "/about-us", label: "About Us" },
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
	{ href: "/glossary", label: "Plumbing Glossary" },
	{ href: "/videos", label: "Video Tutorials" },
	{ href: "/shorts", label: "Field Shorts" },
	{ href: "/downloads", label: "Downloads" },
	{ href: "/septic-solutions", label: "Septic Solutions" },
] as const
