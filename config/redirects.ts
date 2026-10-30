import type { NextConfig } from "next"

type SiteRedirect = Awaited<
	ReturnType<NonNullable<NextConfig["redirects"]>>
>[number]

/** Short city URLs from WordPress content → canonical service-area pages. */
const SERVICE_AREA_CITIES = [
	"amesti",
	"aptos",
	"aptos-hills-larkin-valley",
	"ben-lomond",
	"bonny-doon",
	"boulder-creek",
	"brookdale",
	"capitola",
	"corralitos",
	"davenport",
	"day-valley",
	"felton",
	"freedom",
	"interlaken",
	"la-selva-beach",
	"las-lomas",
	"live-oak",
	"lompico",
	"los-gatos",
	"mount-hermon",
	"paradise-park",
	"pasatiempo",
	"rio-del-mar",
	"santa-cruz",
	"saratoga",
	"scotts-valley",
	"soquel",
	"twin-lakes",
	"watsonville",
	"zayante",
] as const

/** Routing configuration shared by Next and the server-side search inventory. */
export const siteRedirects: SiteRedirect[] = [
	// Retired availability pages resolve directly to a schedulable service.
	{
		source: "/emergency-plumber-santa-cruz-county",
		destination: "/contact",
		permanent: true,
	},
	{
		source: "/service-category/emergency-services",
		destination: "/services",
		permanent: true,
	},
	...[
		[
			"emergency-septic-solutions-santa-cruz",
			"/service-offerings/septic-tank-repair-and-replacement",
		],
		[
			"from-clogs-to-catastrophes-a-plumbers-guide-to-home-emergencies",
			"/contact",
		],
		[
			"how-to-handle-a-clogged-drain-or-sewer-line",
			"/service-offerings/drain-cleaning",
		],
		// Wade's installs septic systems and does not offer tank pumping.
		[
			"septic-pumping-essentials-santa-cruz",
			"/the-complete-guide-to-septic-system-maintenance",
		],
		[
			"understanding-the-cost-of-septic-pumping-in-santa-cruz-county",
			"/the-complete-guide-to-septic-system-maintenance",
		],
	].flatMap(([slug, destination]) => [
		{ source: `/${slug}`, destination, permanent: true },
		{ source: `/expert-tips/${slug}`, destination, permanent: true },
	]),
	{ source: "/about", destination: "/about-us", permanent: true },
	{ source: "/blog", destination: "/expert-tips", permanent: true },
	{ source: "/contact-us", destination: "/contact", permanent: true },
	{
		source: "/service-area",
		destination: "/service-areas",
		permanent: true,
	},
	...SERVICE_AREA_CITIES.flatMap((city) => [
		{
			source: `/service-area/${city}`,
			destination: `/service-area/${city}-ca-plumbing-septic-services`,
			permanent: true,
		},
		{
			source: `/service-area/${city}-ca`,
			destination: `/service-area/${city}-ca-plumbing-septic-services`,
			permanent: true,
		},
	]),
	{
		source: "/video-tutorials",
		destination: "/expert-tips",
		permanent: true,
	},
	{
		source: "/videos",
		destination: "/expert-tips",
		permanent: true,
	},
	{
		source: "/field-shorts",
		destination: "/expert-tips",
		permanent: true,
	},
	{
		source: "/shorts",
		destination: "/expert-tips",
		permanent: true,
	},
	{
		source: "/downloads",
		destination: "/expert-tips",
		permanent: true,
	},
	{
		source: "/about-us/financing",
		destination: "/financing",
		permanent: true,
	},
	{
		source: "/about-us/privacy-policy",
		destination: "/privacy-policy",
		permanent: true,
	},
	{
		source: "/about-us/jobs",
		destination: "/careers",
		permanent: true,
	},
	{
		source: "/about-us/warranties",
		destination: "/warranties",
		permanent: true,
	},
	{
		source: "/about-us/promotions",
		destination: "/financing",
		permanent: true,
	},
	{
		source: "/about-us/rebates",
		destination: "/rebates",
		permanent: true,
	},
	{
		source: "/about-us/franchise",
		destination: "/franchise",
		permanent: true,
	},
	{
		source: "/santa-cruz/water-heater-replacment",
		destination: "/service-area/santa-cruz/water-heater-installation",
		permanent: true,
	},
	// Category aliases that listed the same services as a main category.
	...[
		["residential-plumbing", "plumbing"],
		["specialty-services", "plumbing"],
		["commercial-plumbing", "commercial"],
		["septic-services", "septic"],
	].map(([alias, category]) => ({
		source: `/service-category/${alias}`,
		destination: `/service-category/${category}`,
		permanent: true,
	})),
	// Expert tip archives that repeated the Plumbing Tips archive.
	...["plumbing-maintenance", "santa-cruz-plumbing"].map((slug) => ({
		source: `/category/${slug}`,
		destination: "/category/plumbing-tips",
		permanent: true,
	})),
	// WordPress-era landing pages, each replaced by a fuller page.
	...[
		["/santa-cruz", "/service-area/santa-cruz-ca-plumbing-septic-services"],
		[
			"/santa-cruz/santa-cruz-plumbers-near-me",
			"/service-area/santa-cruz-ca-plumbing-septic-services",
		],
		["/santa-cruz/drain-clearing", "/service-area/santa-cruz/drain-cleaning"],
		[
			"/santa-cruz/water-heater-replacement",
			"/service-area/santa-cruz/water-heater-installation",
		],
		[
			"/santa-cruz/commercial-plumbing",
			"/service-offerings/commercial-plumbing-maintenance",
		],
		["/san-jose", "/service-areas"],
		["/monterey", "/service-areas"],
		["/promotions", "/financing"],
	].map(([source, destination]) => ({ source, destination, permanent: true })),
	{
		source: "/services/categories/:slug",
		destination: "/service-category/:slug",
		permanent: true,
	},
	{
		source: "/services/plumbing",
		destination: "/service-category/plumbing",
		permanent: true,
	},
	{
		source: "/services/septic",
		destination: "/service-category/septic",
		permanent: true,
	},
	{
		source: "/services/commercial",
		destination: "/service-category/commercial",
		permanent: true,
	},
	{
		source: "/service-category",
		destination: "/services",
		permanent: true,
	},
	{
		source: "/service-offerings",
		destination: "/services",
		permanent: true,
	},
	{
		source: "/homeowner-portal",
		destination: "/maintenance-guide",
		permanent: true,
	},
	{
		source: "/wp-sitemap.xml",
		destination: "/sitemap.xml",
		permanent: true,
	},
	{
		source: "/service-offerings/hydro-jetting-for-drain-clearing",
		destination: "/service-offerings/hydro-jetting",
		permanent: true,
	},
	{
		source: "/service-offerings/storm-drain-clearing",
		destination: "/service-offerings/storm-drain-cleaning",
		permanent: true,
	},
	{
		source: "/service-offerings/shower-head-replacement",
		destination: "/service-offerings/shower-installation-and-repair",
		permanent: true,
	},
	...[
		"/service-offerings/septic-pumping",
		"/service-offerings/septic-tank-cleaning-and-pumping",
		"/santa-cruz/septic-pumping",
	].map((source) => ({
		source,
		destination: "/service-offerings/septic-tank-maintenance-and-care",
		permanent: true,
	})),
	...["felton", "boulder-creek", "mount-hermon", "la-selva-beach"].map(
		(city) => ({
			source: `/service-area/${city}/septic-tank-cleaning-and-pumping`,
			destination: `/service-area/${city}-ca-plumbing-septic-services`,
			permanent: true,
		}),
	),
	{
		source: "/service-offerings/septic-installation",
		destination: "/service-offerings/septic-system-installation",
		permanent: true,
	},
	{
		source: "/service-offerings/commercial-repairs",
		destination: "/service-offerings/commercial-plumbing-maintenance",
		permanent: true,
	},
	{
		source: "/service-offerings/alternative-septic-system-installation",
		destination: "/service-offerings/engineered-septic-system-installation",
		permanent: true,
	},
	{
		source: "/engineered-septic-systems-santa-cruz-county",
		destination: "/service-offerings/engineered-septic-system-installation",
		permanent: true,
	},
	{
		source: "/seasonal-septic-maintenance-santa-cruz",
		destination: "/septic-system-seasonal-maintenance-santa-cruz",
		permanent: true,
	},
	{
		source: "/expert-tips/seasonal-septic-maintenance-santa-cruz",
		destination: "/septic-system-seasonal-maintenance-santa-cruz",
		permanent: true,
	},
	{
		source: "/septic-system-components-santa-cruz-2",
		destination: "/septic-system-components-santa-cruz",
		permanent: true,
	},
	{
		source: "/expert-tips/septic-system-components-santa-cruz-2",
		destination: "/septic-system-components-santa-cruz",
		permanent: true,
	},
	{
		source: "/urgent-septic-failure-signs-santa-cruz",
		destination: "/septic-trouble-signs-santa-cruz",
		permanent: true,
	},
	{
		source: "/expert-tips/urgent-septic-failure-signs-santa-cruz",
		destination: "/septic-trouble-signs-santa-cruz",
		permanent: true,
	},
	{
		source: "/lp/:slug",
		destination: "/:slug",
		permanent: true,
	},
	{
		source: "/marketing/service-areas",
		destination: "/service-areas",
		permanent: true,
	},
	{
		source: "/pickens-county-ga",
		destination: "/service-areas",
		permanent: true,
	},
	{
		source: "/pickens-county-ga/:path*",
		destination: "/service-areas",
		permanent: true,
	},
	{
		// Ranked archives are real pages, not legacy article slugs.
		source: "/expert-tips/:slug((?!(?:popular|trending)(?:/|$))[^/]+)",
		destination: "/:slug",
		permanent: true,
	},
	{
		source:
			"/navigating-the-maze-how-to-locate-trustworthy-plumbing-services-nearby",
		destination: "/how-to-locate-trustworthy-plumbing-services-nearby",
		permanent: true,
	},
]

/** Literal, unconditional redirects. Legacy parameter routes are not search URLs. */
export const redirectSourcePaths = new Set(
	siteRedirects
		.filter(
			({ source, has, missing }) =>
				!source.includes(":") && !has?.length && !missing?.length,
		)
		.map(({ source }) => source),
)
