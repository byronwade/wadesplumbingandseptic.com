import { MetadataRoute } from "next";

import { getTips } from "@/actions/getTips";
import { getServices } from "@/actions/getServices";
import { getJobs } from "@/actions/getJobs";

const BASE_URL = "https://www.wadesplumbingandseptic.com";

function createSitemapEntries(baseUrl: string, slugs: string[], changeFrequency: "yearly" | "weekly" | "monthly" | "always" | "hourly" | "daily" | "never", priority: number) {
	return slugs
		.map((slug) => ({
			url: `${baseUrl}/${slug}`,
			lastModified: new Date(),
			changeFrequency,
			priority,
		}))
		.filter((entry) => entry.url.includes("undefined") === false);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [tipsData, servicesData, jobsData] = await Promise.all([getTips().catch(() => ({ tips: [] })), getServices().catch(() => ({ allServices: [] })), getJobs().catch(() => ({ allJobs: [] }))]);

	// Function to extract slugs from an array of objects
	const extractSlugs = (items: any[] = []) => items.map((item) => item?.slug).filter(Boolean);
	// Extracting slugs
	const postSlugs = extractSlugs(tipsData.tips ?? []);
	const serviceSlugs = extractSlugs("allServices" in servicesData ? servicesData.allServices : servicesData.services);
	const jobSlugs = extractSlugs(jobsData.allJobs ?? []);

	// Build links
	const postLinks = createSitemapEntries(`${BASE_URL}/expert-tips`, postSlugs, "weekly", 0.5);
	const serviceLinks = createSitemapEntries(`${BASE_URL}/services`, serviceSlugs, "weekly", 0.5);
	const jobsLinks = createSitemapEntries(`${BASE_URL}/services`, jobSlugs, "monthly", 0.3);

	// Santa Cruz
	const santaCruzSlugs = ["", "septic-pumping", "water-heater-replacment", "commercial-plumbing", "drain-clearing", "santa-cruz-plumbers-near-me"];
	const santaCruzSitemapEntries = createSitemapEntries(`${BASE_URL}/santa-cruz`, santaCruzSlugs, "monthly", 0.5);

	// About Us
	const aboutusSlugs = ["", "financing", "franchise", "privacy-policy", "promotions", "rebates", "warranties"];
	const aboutusSitemapEntries = createSitemapEntries(`${BASE_URL}/about-us`, aboutusSlugs, "monthly", 0.5);

	const staticPages = [
		{ url: BASE_URL, changeFrequency: "yearly" as const, priority: 1 },
		{ url: `${BASE_URL}/expert-tips`, changeFrequency: "weekly" as const, priority: 0.5 },
		{ url: `${BASE_URL}/services`, changeFrequency: "weekly" as const, priority: 0.5 },
		{ url: `${BASE_URL}/contact-us`, changeFrequency: "monthly" as const, priority: 0.5 },
	];

	return [...(staticPages || []), ...(aboutusSitemapEntries || []), ...(santaCruzSitemapEntries || []), ...(postLinks || []), ...(serviceLinks || []), ...(jobsLinks || [])].filter(Boolean);
}
