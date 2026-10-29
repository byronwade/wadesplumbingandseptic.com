import type { NextConfig } from "next"

import { siteRedirects } from "./config/redirects"

const nextConfig: NextConfig = {
	cacheComponents: true,
	typedRoutes: true,
	poweredByHeader: false,
	compress: true,
	experimental: {
		turbopackFileSystemCacheForBuild: true,
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
	/*
	  Next always ships next-polyfill-module (Array.at, Object.hasOwn, …) even
	  though the supported browserslist already has those APIs. Alias it out so
	  Lighthouse "legacy JavaScript" / unused-JS audits clear for modern clients.
	*/
	turbopack: {
		resolveAlias: {
			"next/dist/build/polyfills/polyfill-module": "./lib/empty-module.js",
			"next/dist/build/polyfills/polyfill-module.js": "./lib/empty-module.js",
			"next/dist/esm/build/polyfills/polyfill-module": "./lib/empty-module.js",
			"next/dist/esm/build/polyfills/polyfill-module.js":
				"./lib/empty-module.js",
		},
	},
	webpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			"next/dist/build/polyfills/polyfill-module": false,
			"next/dist/build/polyfills/polyfill-module.js": false,
			"next/dist/esm/build/polyfills/polyfill-module": false,
			"next/dist/esm/build/polyfills/polyfill-module.js": false,
		}
		return config
	},
	async redirects() {
		return siteRedirects
	},
	images: {
		/*
		 * Vercel Services currently serves the site assets but not Next's
		 * built-in /_next/image optimizer. All local assets are already
		 * optimized WebP files, so serve them directly instead of emitting
		 * optimizer URLs that return 404.
		 */
		unoptimized: true,
		formats: ["image/avif", "image/webp"],
		qualities: [48, 52, 55, 58, 60, 65, 70, 75, 80, 85],
		/* Cap retina candidates; 100vw heroes do not need 3840px sources. */
		deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920],
		imageSizes: [32, 48, 64, 96, 128, 256, 384],
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
