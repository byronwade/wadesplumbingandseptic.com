import { supabase } from "../../../../utils/supabase";

export async function GET(request) {
	const searchTerm = request?.nextUrl?.searchParams.get("q") || "";
	const slug = request?.nextUrl?.searchParams.get("slug") || "";
	const page = Number(request?.nextUrl?.searchParams.get("page")) || 1;
	const limit = 10;
	const rangeStart = (page - 1) * limit;
	const rangeEnd = rangeStart + limit - 1;

	let query;

	if (slug) {
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
			.eq("slug", slug);
	} else {
		query = supabase.from("services").select(
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
		);

		if (searchTerm) {
			query = query.ilike("title", `%${searchTerm}%`);
		}
		query = query.range(rangeStart, rangeEnd);
	}

	const { data, error } = await query;

	if (error) {
		console.error("Error fetching services:", error);
		return new Response(JSON.stringify({ error }), { statusCode: 500 });
	}

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
