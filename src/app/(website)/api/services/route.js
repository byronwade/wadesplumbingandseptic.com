import { supabase } from "../../../../utils/supabase";

export async function GET(request) {
	// Extract the search term from the query parameters
	const searchTerm = request.nextUrl.searchParams.get("q");

	// Extract the slug from the query parameters
	const slug = request.nextUrl.searchParams.get("slug");

	// Pagination
	const page = Number(request.nextUrl.searchParams.get("page")) || 1;
	const limit = 10; // 10 rows per page
	const rangeStart = (page - 1) * limit;
	const rangeEnd = rangeStart + limit - 1;

	let query;

	// Check if a slug is provided in the query parameters
	if (slug) {
		// If a slug is provided, search for the exact item by its URI
		query = supabase
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
			.eq("slug", slug); // Use eq to find the exact item by its URI
	} else {
		// If no slug is provided, perform a regular search
		query = supabase.from("services").select(`
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
    `);

		// If there's a search term, filter the data by it
		if (searchTerm) {
			query = query.ilike("title", `%${searchTerm}%`);
		}

		// Apply range after filtering (if there is any)
		query = query.range(rangeStart, rangeEnd);
	}

	const { data, error } = await query.limit(100);

	if (error) {
		console.error("Error fetching services:", error);
		return new Response(JSON.stringify({ error }), { statusCode: 500 });
	}

	// Determine total count - if there's a search term, only count matching services
	let countQuery = supabase.from("services").select("id", { count: "exact" });
	if (searchTerm) {
		countQuery = countQuery.ilike("title", `%${searchTerm}%`);
	}
	const countData = await countQuery;
	const totalservices = countData.data.length;

	const responsePayload = {
		services: data,
		pageInfo: {
			total: totalservices,
		},
	};

	return new Response(JSON.stringify(responsePayload), { statusCode: 200 });
}
