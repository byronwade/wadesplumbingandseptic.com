import { MetadataRoute } from "next";

import getTips from "./(data)/expert-tips/getTips";
import getServices from "./(data)/services/getServices";
import getJobs from "./(data)/about-us/jobs/getJobs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const tips = await getTips();
	const services = await getServices();
	const jobs = await getJobs();

	// Function to extract slugs from an array of objects
	const extractSlugs = (items) => items.map((item) => item.slug);

	// Extracting slugs
	const postSlugs = extractSlugs(tips.allPosts);
	const serviceSlugs = extractSlugs(services.allServices);
	const jobSlugs = extractSlugs(jobs.allJobs);

	// Build links
	const postLinks = postSlugs.map((slug) => ({
		url: `https://www.wadesplumbingandseptic.com/expert-tips/${slug}`,
		lastModified: new Date(),
		changeFrequency: "weekly",
		priority: 0.5,
	}));

	const serviceLinks = serviceSlugs.map((slug) => ({
		url: `https://www.wadesplumbingandseptic.com/services/${slug}`,
		lastModified: new Date(),
		changeFrequency: "weekly",
		priority: 0.5,
	}));

	const jobsLinks = jobSlugs.map((slug) => ({
		url: `https://www.wadesplumbingandseptic.com/services/${slug}`,
		lastModified: new Date(),
		changeFrequency: "monthly",
		priority: 0.3,
	}));

	function createSitemapEntries(baseUrl, slugs, changeFrequency, priority) {
		return slugs.map((slug) => ({
			url: `${baseUrl}/${slug}`,
			lastModified: new Date(),
			changeFrequency: changeFrequency,
			priority: priority,
		}));
	}

	// Santa Cruz
	const santaCruzSlugs = ["", "septic-pumping", "water-heater-replacment", "commercial-plumbing", "drain-clearing", "santa-cruz-plumbers-near-me"];
	const santaCruzSitemapEntries = createSitemapEntries("https://www.wadesplumbingandseptic.com/santa-cruz", santaCruzSlugs, "monthly", 0.5);

	// About Us
	const aboutusSlugs = ["", "financing", "franchise", "privacy-policy", "promotions", "rebates", "warranties"];
	const aboutusSitemapEntries = createSitemapEntries("https://www.wadesplumbingandseptic.com/about-us", aboutusSlugs, "monthly", 0.5);

	return [
		{
			url: "https://www.wadesplumbingandseptic.com",
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 1,
		},
		{
			url: "https://www.wadesplumbingandseptic.com/expert-tips",
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.5,
		},
		{
			url: "https://www.wadesplumbingandseptic.com/services",
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.5,
		},
		{
			url: "https://www.wadesplumbingandseptic.com/contact-us",
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.5,
		},
		...aboutusSitemapEntries,
		...santaCruzSitemapEntries,
		...postLinks,
		...serviceLinks,
		...jobsLinks,
	];
}
