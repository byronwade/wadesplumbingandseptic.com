import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Wade's Plumbing & Septic",
		short_name: "Wade's",
		description:
			"Plumbing and septic service in Santa Cruz and Santa Clara counties.",
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
		],
	}
}
