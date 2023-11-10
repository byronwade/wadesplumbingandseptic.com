import { supabase } from "../../../../utils/supabase";

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

	const { data, count, error } = await query;

	if (error) {
		console.error("Error fetching data:", error);
		return null;
	}
	return data;
}

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

function filterAndSortPosts(allPosts = [], postCategories = []) {
	return allPosts.filter((post) => post.categories && post.categories.some((category) => postCategories.includes(category))).sort((a, b) => (b.categories ? b.categories.filter((category) => postCategories.includes(category)).length : 0) - (a.categories ? a.categories.filter((category) => postCategories.includes(category)).length : 0));
}

export default async function getTips({ searchTerm = "", slug = "", page = 1, itemsPerPage = 10 } = {}) {
	const allPosts = await fetchAllPosts(searchTerm);
	const postDetails = await fetchPostDetails(slug);
	const relatedPosts = filterAndSortPosts(allPosts, postDetails?.categories);
	const total = allPosts?.length || 0;

	const startAt = (page - 1) * itemsPerPage;
	const endAt = startAt + itemsPerPage;
	let pagedData = allPosts?.slice(startAt, endAt);

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
