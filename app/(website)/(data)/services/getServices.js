"use server";

import { supabase } from "@/lib/supabase";

const ITEMS_PER_PAGE = 6;

export async function getServices({ searchTerm = "", page = 1, limit = ITEMS_PER_PAGE }) {
	let query = supabase.from("services").select("*", { count: "exact" });

	if (searchTerm) {
		query = query.ilike("title", `%${searchTerm}%`);
	}

	const { data: services, count, error } = await query.range((page - 1) * limit, page * limit - 1).order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching services:", error);
		return { services: [], total: 0 };
	}

	return { services, total: count };
}

export async function getServiceDetails(slug) {
	const { data, error } = await supabase.from("services").select("*").eq("slug", slug).single();

	if (error) {
		console.error("Error fetching service details:", error);
		return null;
	}

	return data;
}

export async function getRelatedServices(currentSlug, limit = 3) {
	const { data, error } = await supabase
		.from("services")
		.select(
			`
			id,
			title,
			excerpt,
			slug,
			created_at,
			categories,
			featuredImage: images (alttext, sourceurl, sizes)
		`
		)
		.neq("slug", currentSlug)
		.limit(limit);

	if (error) {
		console.error("Error fetching related services:", error);
		return [];
	}

	return data;
}
