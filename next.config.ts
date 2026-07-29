import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	cacheComponents: true,
	typedRoutes: true,
	poweredByHeader: false,
	compress: true,
	images: {
		formats: ["image/avif", "image/webp"],
		qualities: [60, 70, 75, 80, 85],
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
