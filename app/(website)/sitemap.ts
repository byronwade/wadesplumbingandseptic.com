import { MetadataRoute } from "next";

import { getTips } from "@/actions/getTips";
import { getServices } from "@/actions/getServices";
import { getJobs } from "@/actions/getJobs";

const BASE_URL = "https://www.wadesplumbingandseptic.com";

type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

function createSitemapEntries(baseUrl: string, slugs: string[] = [], changeFreq: ChangeFrequency, priority: number, lastmod?: string) {
	return slugs.map((slug) => ({
		url: `${baseUrl}/${slug}`,
		lastModified: lastmod || new Date().toISOString(),
		changeFrequency: changeFreq,
		priority: priority,
	}));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [tipsData, servicesData, jobsData] = await Promise.all([getTips().catch(() => ({ tips: [] })), getServices().catch(() => ({ allServices: [] })), getJobs().catch(() => ({ allJobs: [] }))]);

	// Extract slugs and dates
	const extractSlugsAndDates = (items: any[] = []) =>
		items
			.map((item) => ({
				slug: item?.slug,
				lastmod: item?.updated_at || item?.created_at || new Date().toISOString(),
			}))
			.filter((item) => item.slug);

	const posts = extractSlugsAndDates(tipsData.tips ?? []);
	const services = extractSlugsAndDates("allServices" in servicesData ? servicesData.allServices : servicesData.services);
	const jobs = extractSlugsAndDates(jobsData.allJobs ?? []);

	// Build links with lastmod dates
	const postLinks = posts.map((post) => ({
		url: `${BASE_URL}/expert-tips/${post.slug}`,
		lastModified: post.lastmod,
		changeFrequency: "weekly" as ChangeFrequency,
		priority: 0.7,
	}));

	const serviceLinks = services.map((service) => ({
		url: `${BASE_URL}/services/${service.slug}`,
		lastModified: service.lastmod,
		changeFrequency: "weekly" as ChangeFrequency,
		priority: 0.8,
	}));

	const jobsLinks = jobs.map((job) => ({
		url: `${BASE_URL}/about-us/jobs/${job.slug}`,
		lastModified: job.lastmod,
		changeFrequency: "daily" as ChangeFrequency,
		priority: 0.6,
	}));

	// Location pages (high priority)
	const santaCruzSlugs = ["", "septic-pumping", "water-heater-replacment", "commercial-plumbing", "drain-clearing", "santa-cruz-plumbers-near-me"];
	const santaCruzSitemapEntries = createSitemapEntries(`${BASE_URL}/santa-cruz`, santaCruzSlugs, "weekly", 0.9);

	// About pages
	const aboutusSlugs = ["", "financing", "franchise", "privacy-policy", "promotions", "rebates", "warranties"];
	const aboutusSitemapEntries = createSitemapEntries(`${BASE_URL}/about-us`, aboutusSlugs, "monthly", 0.5);

	// Static pages
	const staticPages = [
		{ url: BASE_URL, lastModified: new Date().toISOString(), changeFrequency: "daily" as ChangeFrequency, priority: 1.0 },
		{ url: `${BASE_URL}/expert-tips`, lastModified: new Date().toISOString(), changeFrequency: "daily" as ChangeFrequency, priority: 0.8 },
		{ url: `${BASE_URL}/services`, lastModified: new Date().toISOString(), changeFrequency: "daily" as ChangeFrequency, priority: 0.9 },
		{ url: `${BASE_URL}/contact-us`, lastModified: new Date().toISOString(), changeFrequency: "weekly" as ChangeFrequency, priority: 0.8 },
	];

	return [...staticPages, ...aboutusSitemapEntries, ...santaCruzSitemapEntries, ...postLinks, ...serviceLinks, ...jobsLinks].filter(Boolean);
}
