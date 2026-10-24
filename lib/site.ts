/** CSLB license classifications; `siteConfig.licenses` is built from these. */
const licenseNumber = "1087260"
const licenseClassifications = [
	{ code: "C-36", name: "Plumbing" },
	{ code: "C-42", name: "Sanitation System" },
] as const

export const siteConfig = {
	name: "Wade's Plumbing & Septic",
	shortName: "Wade's",
	description:
		"Family-owned plumbing and septic specialists serving Santa Cruz County and nearby Santa Clara foothill communities.",
	/** Preferred host matches production redirects (apex → www). */
	url: "https://www.wadesplumbingandseptic.com",
	phone: "831.225.4344",
	/** E.164 form for schema, vCard and tel: links. Must match `phone`. */
	phoneE164: "+18312254344",
	phoneHref: "tel:+18312254344",
	email: "support@wadesinc.io",
	hours: "Monday to Friday, 9:00 AM to 5:00 PM. Closed Saturday and Sunday",
	/** Structured form of `hours` for schema.org openingHoursSpecification. */
	openingHours: {
		days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
		opens: "09:00",
		closes: "17:00",
	},
	pricing: "Flat-rate pricing, quoted on site before work begins.",
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
	licenses: `CA CSLB #${licenseNumber} (${licenseClassifications.map((item) => `${item.code} ${item.name}`).join(", ")})`,
	licenseNumber,
	licenseClassifications,
	googleMapsUrl:
		"https://maps.google.com/?q=7737+Highway+9,+Ben+Lomond,+CA+95005",
	/** Direct Google listing and review links confirmed by Byron, October 19, 2026. */
	googleBusinessUrl: "https://www.google.com/maps?cid=7910009961732981689",
	googleReviewUrl: "https://g.page/r/CblD5bImAMZtEAE/review",
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
