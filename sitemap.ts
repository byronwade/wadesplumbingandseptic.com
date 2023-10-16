// app/sitemap.ts
import { MetadataRoute } from "next";
const ROOTURL = "https:www.wadesplumbingandseptic.com";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: `${ROOTURL}/`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 1,
		},
		{
			url: `${ROOTURL}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${ROOTURL}/contact`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.5,
		},
		// ... other pages
	];
}
