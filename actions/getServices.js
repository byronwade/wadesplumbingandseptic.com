"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function getServices({ searchTerm = "", page = 1, itemsPerPage = 6 }) {
	const supabase = createServerActionClient({ cookies });

	try {
		let query = supabase.from("services").select("id, title, excerpt, slug, categories, featuredImage:images(alttext, sourceurl, sizes)", { count: "exact" }).order("created_at", { ascending: false });

		if (searchTerm) {
			query = query.ilike("title", `%${searchTerm}%`);
		}

		const { data, count, error } = await query.range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

		if (error) throw error;

		return { services: data, total: count };
	} catch (error) {
		console.error("Error fetching services:", error);
		return { services: [], total: 0, error: error.message };
	}
}

export async function getServiceDetails(slug) {
	try {
		const { data, error } = await createServerActionClient({ cookies }).from("services").select("*").eq("slug", slug).single();

		if (error) throw error;

		return { service: data };
	} catch (error) {
		console.error("Error fetching service details:", error);
		return { service: null, error: error.message };
	}
}

export async function getRelatedServices(currentSlug, limit = 3) {
	try {
		const { data, error } = await createServerActionClient({ cookies })
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

		if (error) throw error;

		return { relatedServices: data };
	} catch (error) {
		console.error("Error fetching related services:", error);
		return { relatedServices: [], error: error.message };
	}
}
