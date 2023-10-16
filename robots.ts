// app/sitemap.ts
import { MetadataRoute } from "next";
const ROOTURL = "https:www.wadesplumbingandseptic.com";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: "/private/",
		},
		sitemap: `${ROOTURL}/sitemap.xml`,
	};
}
