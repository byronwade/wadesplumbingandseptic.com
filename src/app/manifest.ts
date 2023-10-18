import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Wade&apos;s Plumbing and Septic",
		short_name: "Wade&apos;s",
		description: "Plumbing and septic company",
		start_url: "/",
		display: "standalone",
		background_color: "#fff",
		theme_color: "#fff",
		icons: [
			{
				src: "/favicon.ico",
				sizes: "any",
				type: "image/x-icon",
			},
		],
	};
}
