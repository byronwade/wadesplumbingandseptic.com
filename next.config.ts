import type { NextConfig } from "next"

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

const nextConfig: NextConfig = {
	cacheComponents: true,
	typedRoutes: true,
	poweredByHeader: false,
	compress: true,
	experimental: {
		optimizePackageImports: [
			"@phosphor-icons/react",
			"@radix-ui/react-accordion",
			"@radix-ui/react-dialog",
			"@radix-ui/react-navigation-menu",
			"@radix-ui/react-separator",
			"@radix-ui/react-slot",
			"@radix-ui/react-tooltip",
		],
	},
	async redirects() {
		return [
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
				destination: "/videos",
				permanent: true,
			},
			{
				source: "/field-shorts",
				destination: "/shorts",
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
				destination: "/promotions",
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
				source: "/santa-cruz/water-heater-replacement",
				destination: "/santa-cruz/water-heater-replacment",
				permanent: true,
			},
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
			{
				source: "/service-offerings/septic-pumping",
				destination: "/service-offerings/septic-tank-cleaning-and-pumping",
				permanent: true,
			},
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
				destination:
					"/service-offerings/engineered-septic-system-installation",
				permanent: true,
			},
			{
				source: "/engineered-septic-systems-santa-cruz-county",
				destination:
					"/service-offerings/engineered-septic-system-installation",
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
				source: "/expert-tips/:slug",
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
	},
	images: {
		formats: ["image/avif", "image/webp"],
		qualities: [55, 60, 65, 70, 75, 80, 85],
		minimumCacheTTL: 31_536_000,
	},
	async headers() {
		return [
			{
				source: "/images/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/maplibre-gl/:path*",
				headers: [
					{
						key: "Content-Type",
						value: "text/javascript; charset=utf-8",
					},
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/:path*",
				headers: [
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
				],
			},
		]
	},
}

export default nextConfig
