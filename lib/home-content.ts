import { siteConfig } from "@/lib/site"

export const serviceGroups = [
	{
		title: "Residential Plumbing",
		href: "/service-category/plumbing",
		linkLabel: "Residential services",
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
		href: "/service-category/commercial",
		linkLabel: "Commercial services",
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
		href: "/contact",
		linkLabel: "Discuss your build",
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

/**
 * Hero shortcuts: the four jobs most visitors arrive with, so a phone visitor
 * reaches the right page in one tap instead of opening the menu.
 */
export const heroQuickLinks = [
	{
		label: "Drains & sewer",
		detail: "Clogs, backups, inspections",
		href: "/service-offerings/drain-cleaning",
		icon: "pipe",
	},
	{
		label: "Water heaters",
		detail: "Tank and tankless installs",
		href: "/service-offerings/water-heater-installation",
		icon: "fire",
	},
	{
		label: "Leaks & pipes",
		detail: "Detection, repair, repiping",
		href: "/service-offerings/leak-detection",
		icon: "wrench",
	},
	{
		label: "Septic systems",
		detail: "Install, repair, engineered",
		href: "/service-category/septic",
		icon: "hardhat",
	},
] as const

/**
 * Proof bar under the hero. Only facts the business has confirmed: the CSLB
 * license, the founding year, and how pricing works.
 */
export const proofPoints = [
	{
		title: "Licensed contractor",
		detail: `CSLB #${siteConfig.licenseNumber} (${siteConfig.licenseClassifications.map((item) => item.code).join(", ")})`,
		icon: "shield",
	},
	{
		title: "Family owned",
		detail: `Local crew since ${siteConfig.foundingYear}`,
		icon: "home",
	},
	{
		title: "Flat-rate pricing",
		detail: "Quoted on site before work begins",
		icon: "wallet",
	},
	{
		title: "Free quotes",
		detail: "Straight answers, no sales pressure",
		icon: "handshake",
	},
] as const

/**
 * How a job runs, start to finish. Each step restates a fact published
 * elsewhere on the site (free quotes, flat-rate pricing, licensed work), so
 * the section explains the process without adding new claims.
 */
export const processSteps = [
	{
		title: "Call or send a message",
		text: `Talk to a real person at ${siteConfig.phone} during office hours, or send a message any time.`,
	},
	{
		title: "On-site look and a flat-rate quote",
		text: "We see the problem in person, explain the options, and give you a flat-rate price before any work begins. Quotes are free.",
	},
	{
		title: "Licensed work, done to code",
		text: `Planned and permitted where the job needs it, under ${siteConfig.licenses}.`,
	},
	{
		title: "Clean finish and walkthrough",
		text: "We clean up, show you what was done, and answer questions before we leave.",
	},
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
