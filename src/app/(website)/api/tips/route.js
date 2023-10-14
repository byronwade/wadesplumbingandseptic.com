import { supabase } from "../../../../utils/supabase";

export async function GET(request) {
	const searchTerm = request?.nextUrl?.searchParams.get("search") || "";
	const slug = request?.nextUrl?.searchParams.get("slug") || "";
	const page = Number(request?.nextUrl?.searchParams.get("page")) || 1;
	const limit = 10;
	const rangeStart = (page - 1) * limit;
	const rangeEnd = rangeStart + limit - 1;

	let query;

	if (slug) {
		query = supabase
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
			.eq("slug", slug);
	} else {
		query = supabase.from("tips").select(
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
		console.error("Error fetching tips:", error);
		return new Response(JSON.stringify({ error }), { statusCode: 500 });
	}

	let countQuery = supabase.from("tips").select("id", { count: "exact" });
	if (searchTerm) {
		countQuery = countQuery.ilike("title", `%${searchTerm}%`);
	}
	const countData = await countQuery;
	const totalPosts = countData.data.length;

	const responsePayload = {
		posts: data,
		pageInfo: {
			total: totalPosts,
		},
	};

	return new Response(JSON.stringify(responsePayload), { statusCode: 200 });
}
