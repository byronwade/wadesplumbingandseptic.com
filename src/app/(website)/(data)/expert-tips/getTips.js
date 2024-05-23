import { supabase } from "../../../../utils/supabase";

/**
 * Fetch all posts, optionally filtered by a search term.
 * @param {string} searchTerm - The term to search for.
 * @returns {Promise<Object[]>} The fetched posts.
 */
async function fetchAllPosts(searchTerm) {
	let query = supabase
		.from("tips")
		.select(
			`
id,
title,
excerpt,
slug,
created_at,
content,
readingtime,
categories,
author: authors (id, username),
featuredImage: images (alttext, sourceurl, sizes)
`,
			{ count: "exact" }
		)
		.order("created_at", { ascending: true });

	if (searchTerm && searchTerm.trim() !== "") {
		query = query.ilike("title", `%${searchTerm}%`);
	}

	const { data, error } = await query;

	if (error) {
		console.error("Error fetching data:", error);
		return null;
	}
	return data;
}

/**
 * Fetch details for a specific post by slug.
 * @param {string} slug - The slug of the post.
 * @returns {Promise<Object|null>} The post details.
 */
async function fetchPostDetails(slug) {
	if (!slug) return null;

	const { data, error } = await supabase
		.from("tips")
		.select(
			`
		id,
		title,
		excerpt,
		slug,
		created_at,
		content,
		readingtime,
		categories,
		author: authors (id, username),
		featuredImage: images (alttext, sourceurl, sizes)
	  `
		)
		.eq("slug", slug)
		.single();

	if (error) {
		console.error("Error fetching post details:", error);
		return null;
	}
	return data;
}

/**
 * Filter and sort posts based on categories.
 * @param {Object[]} allPosts - The list of all posts.
 * @param {string[]} postCategories - The categories to filter by.
 * @returns {Object[]} The filtered and sorted posts.
 */
function filterAndSortPosts(allPosts = [], postCategories = []) {
	return allPosts.filter((post) => post.categories && post.categories.some((category) => postCategories.includes(category))).sort((a, b) => (b.categories ? b.categories.filter((category) => postCategories.includes(category)).length : 0) - (a.categories ? a.categories.filter((category) => postCategories.includes(category)).length : 0));
}

/**
 * Get posts with pagination and related data.
 * @param {Object} options - The options for fetching posts.
 * @param {string} options.searchTerm - The term to search for.
 * @param {string} options.slug - The slug of a specific post.
 * @param {number} options.page - The current page number.
 * @param {number} options.itemsPerPage - The number of items per page.
 * @returns {Promise<Object>} The fetched posts and related data.
 */
export default async function getTips({ searchTerm = "", slug = "", page = 1, itemsPerPage = 10 } = {}) {
	const allPosts = await fetchAllPosts(searchTerm);
	const postDetails = await fetchPostDetails(slug);
	const relatedPosts = filterAndSortPosts(allPosts, postDetails?.categories);
	const total = allPosts?.length || 0;

	const startAt = (page - 1) * itemsPerPage;
	const endAt = startAt + itemsPerPage;
	const pagedData = allPosts?.slice(startAt, endAt);

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Service",
		name: postDetails?.title,
		serviceType: postDetails?.categories.join(", "),
		provider: {
			"@type": "Organization",
			name: "Wade's Plumbing & Septic",
			telephone: "+1-831-225-4344",
			url: "https://www.wadesplumbingandseptic.com",
			address: {
				"@type": "PostalAddress",
				streetAddress: "7737 hwy 9",
				addressLocality: "Ben Lomond",
				addressRegion: "CA",
				postalCode: "95005",
				addressCountry: "US",
			},
		},
		image: postDetails?.featuredImage?.sourceurl || "https://www.wadesplumbingandseptic.com/placeholder.webp",
		areaServed: ["Santa Cruz County", "Monterey County", "Santa Clara County"],
		description: postDetails?.content,
		url: `https://www.wadesplumbingandseptic.com/services/${postDetails?.slug}`,
	};

	return {
		allPosts,
		postDetails,
		relatedPosts,
		pagedData,
		jsonLd,
		total,
	};
}
