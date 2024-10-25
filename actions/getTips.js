"use server";

import { supabase } from "@/lib/supabase";

const ITEMS_PER_PAGE = 10;

export async function getTips({ searchTerm = "", page = 1 }) {
	try {
		let query = supabase
			.from("tips")
			.select(
				`
        id,
        title,
        excerpt,
        slug,
        created_at,
        readingtime,
        categories,
        author: authors (id, username),
        featuredImage: images (alttext, sourceurl, sizes)
        `,
				{ count: "exact" }
			)
			.order("created_at", { ascending: false })
			.range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

		if (searchTerm && searchTerm.trim() !== "") {
			query = query.ilike("title", `%${searchTerm}%`);
		}

		const { data: tips, count, error } = await query;

		if (error) throw error;

		return { tips, total: count };
	} catch (error) {
		console.error("Error fetching tips:", error);
		return { tips: [], total: 0, error: error.message };
	}
}

export async function getTipDetails(slug) {
	try {
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

		if (error) throw error;

		return { tip: data };
	} catch (error) {
		console.error("Error fetching tip details:", error);
		return { tip: null, error: error.message, ...runtimeEdge };
	}
}