import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/admin/*", "/api/*", "/*.json$", "/private/*", "/temp/*", "/draft/*"],
			},
			{
				userAgent: "Googlebot",
				allow: "/",
				crawlDelay: 1,
			},
			{
				userAgent: "Bingbot",
				allow: "/",
				crawlDelay: 1,
			},
		],
		sitemap: "https://www.wadesplumbingandseptic.com/sitemap.xml",
		host: "https://www.wadesplumbingandseptic.com",
	};
}
