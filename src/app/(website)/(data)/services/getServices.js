import { supabase } from "../../../../utils/supabase";

async function fetchAllServices(searchTerm) {
	let query = supabase
		.from("services")
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
		.from("services")
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

function filterAndSortServices(allServices = [], postCategories = []) {
	return allServices.filter((post) => post.categories && post.categories.some((category) => postCategories.includes(category))).sort((a, b) => (b.categories ? b.categories.filter((category) => postCategories.includes(category)).length : 0) - (a.categories ? a.categories.filter((category) => postCategories.includes(category)).length : 0));
}

export default async function fetchData({ searchTerm = "", slug = "", page = 1, itemsPerPage = 10 } = {}) {
	const allServices = await fetchAllServices(searchTerm);
	const postDetails = await fetchPostDetails(slug);
	const relatedServices = filterAndSortServices(allServices, postDetails?.categories);
	const total = allServices?.length || 0;

	const startAt = (page - 1) * itemsPerPage;
	const endAt = startAt + itemsPerPage;
	let pagedData = allServices?.slice(startAt, endAt);

	return {
		allServices,
		postDetails,
		pagedData,
		relatedServices,
		total,
	};
}
