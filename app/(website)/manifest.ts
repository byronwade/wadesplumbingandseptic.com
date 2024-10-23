import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
		name: "Wade's Plumbing and Septic",
		short_name: "Wade's Inc.",
		description: "Expert plumbing and septic services in Santa Cruz, California. Fast, reliable, and tech-forward solutions.",
		start_url: "/",
		display: "standalone",
		background_color: "#000",
		theme_color: "#bc6f30", // You can change this to match your brand color
		icons: [
			{
				src: "assets/icons/icon-48x48.png",
				sizes: "48x48",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "assets/icons/icon-72x72.png",
				sizes: "72x72",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "assets/icons/icon-96x96.png",
				sizes: "96x96",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "assets/icons/icon-128x128.png",
				sizes: "128x128",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "assets/icons/icon-144x144.png",
				sizes: "144x144",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "assets/icons/icon-152x152.png",
				sizes: "152x152",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "assets/icons/icon-192x192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "assets/icons/icon-384x384.png",
				sizes: "384x384",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "assets/icons/icon-512x512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable",
			},
		],
		// Optionally, you can include orientation, scope, and other properties
		orientation: "portrait",
		scope: "/",
		lang: "en-US",
	};
}
