import { siteConfig } from "@/lib/site"

export const serviceGroups = [
	{
		title: "Residential Plumbing",
		image: "/images/work/precision-valve-installation.webp",
		description:
			"Repairs and installations completed cleanly, honestly, and to code.",
		items: [
			"Leak detection & repair",
			"Fixture installation & repair",
			"Pipe replacement & repiping",
			"Drain cleaning & unclogging",
		],
	},
	{
		title: "Commercial Plumbing",
		image: "/images/work/commercial-plumbing-installation.webp",
		description:
			"Dependable commercial service that keeps your property operating.",
		items: [
			"Commercial water heaters",
			"Backflow prevention",
			"Code compliance updates",
			"Restaurant & kitchen plumbing",
		],
	},
	{
		title: "New Construction",
		image: "/images/work/new-construction-rough-in.webp",
		description:
			"Code-compliant plumbing planned from rough-in through final testing.",
		items: [
			"Plumbing system design",
			"Rough-in plumbing",
			"Fixture installation",
			"Final inspections & testing",
		],
	},
]

export const workGallery = [
	{
		src: "/images/work/engineered-retaining-wall.webp",
		alt: "Engineered septic retaining wall and control panel in Santa Cruz County",
		caption: "Engineered retaining wall and control panel",
	},
	{
		src: "/images/work/multi-tank-excavation.webp",
		alt: "Multi-tank septic excavation underway on a hillside property",
		caption: "Multi-tank excavation in progress",
	},
	{
		src: "/images/work/completed-multi-tank.webp",
		alt: "Completed multi-tank engineered septic installation",
		caption: "Completed multi-tank installation",
	},
	{
		src: "/images/work/advanced-septic-control-panel.webp",
		alt: "Advanced septic control panel and system access points",
		caption: "Advanced septic control system",
	},
] as const

export const trustedBrands = [
	{ src: "/images/partners/bradfordwhite.webp", alt: "Bradford White" },
	{ src: "/images/partners/navien.webp", alt: "Navien" },
	{ src: "/images/partners/kohler.webp", alt: "Kohler" },
	{ src: "/images/partners/grohe.webp", alt: "Grohe" },
	{ src: "/images/partners/grundfos.webp", alt: "Grundfos" },
] as const

export const heroStats = [
	{ label: "Licensed", value: "CA CSLB #1087260" },
	{ label: "Pricing", value: "Flat-rate, quoted on site" },
	{ label: "Office hours", value: siteConfig.hours },
] as const

export const trustPoints = [
	"Family owned & operated",
	"Licensed & insured",
	"Satisfaction guaranteed",
	"Flat-rate pricing, quoted on site before work begins.",
] as const

export const reasons = [
	["No-pressure advice", "Only the work your property needs."],
	["Flat-rate pricing", siteConfig.pricing],
	["Clean workmanship", "Respectful service and a clean finish."],
	["Long-term reliability", "Repairs and systems designed to last."],
] as const

export const testimonials = [
	[
		"As a real estate professional, I love working with Wade’s Plumbing. They are courteous, professional, and always make sure my clients are taken care of.",
		"Bailey Cotrona",
	],
	[
		"They know their stuff, do great work, and are a pleasure to work with. They made me feel comfortable with a terrible situation that shut down my house.",
		"Aaron Berger",
	],
] as const

/**
 * Homepage FAQ, also published as FAQPage schema. The first four answer what
 * Wade's does, in words an AI assistant can quote on their own; facts come
 * from siteConfig so they cannot drift from the rest of the site.
 */
export const faqs = [
	{
		question: "What does Wade's Plumbing & Septic do?",
		answer: `Wade's Plumbing & Septic is a family-owned plumbing and septic company in ${siteConfig.address.city}, California, serving Santa Cruz County and licensed under ${siteConfig.licenses}. We handle residential and commercial plumbing, drain, sewer and water heater work, and install new and engineered septic systems alongside engineers.`,
	},
	{
		question: "Does Wade's pump septic tanks?",
		answer:
			"No. Wade's Plumbing & Septic does not offer septic tank pumping. We install, repair and replace septic systems, including engineered systems built alongside engineers. For routine pumping, contact a septic pumping company.",
	},
	{
		question: "Are quotes free, and how is pricing set?",
		answer: `Yes, quotes are free. ${siteConfig.pricing}`,
	},
	{
		question: "What are your hours?",
		answer: `Wade's office hours are ${siteConfig.hours}. Call ${siteConfig.phone} during those hours or request a free quote online.`,
	},
	{
		question: "What are the signs of a failing septic system?",
		answer:
			"Warning signs include slow drains, gurgling sounds, sewage backups, soggy areas around the drain field, unusually lush grass, strong odors, and contaminated well water.",
	},
	{
		question: "How long does a water heater typically last?",
		answer:
			"Conventional tank water heaters commonly last 8 to 12 years, while tankless models can last 15 to 20 years or longer with proper maintenance.",
	},
	{
		question: "What areas do you serve?",
		answer:
			"We serve Santa Cruz County and selected Santa Clara County communities in California. Call us if you are unsure whether a specific address is inside the current service area.",
	},
]
