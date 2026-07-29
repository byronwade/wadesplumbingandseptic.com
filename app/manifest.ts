import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Wade's Plumbing & Septic",
		short_name: "Wade's",
		description:
			"Plumbing and septic service in Santa Cruz County, selected Santa Clara County communities, and Pickens County, Georgia.",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#111111",
		icons: [
			{
				src: "/icon.svg",
				sizes: "any",
				type: "image/svg+xml",
			},
			{
				src: "/images/brand/wades-mark.webp",
				sizes: "956x1024",
				type: "image/webp",
			},
		],
	}
}
