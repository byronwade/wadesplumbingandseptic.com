import { supabase } from "../../../../utils/supabase";

async function fetchNewestItems(entityType, categoryIds) {
	const responsePayload = {};

	for (const categoryId of categoryIds) {
		const { data, error } = await supabase.from(entityType).select(`slug, title, readingtime`).contains("categories", [categoryId]).order("created_at", { ascending: false }).limit(4);

		if (error) {
			console.error(`Error fetching ${entityType} for category ID ${categoryId}:`, error);
			throw error; // Propagate the error to the main handler
		}

		responsePayload[categoryId] = data;
	}

	return responsePayload;
}

async function fetchFeaturedItem(entityType) {
	const { data, error } = await supabase.from(entityType).select(`slug, title, readingtime`).eq("featured", true).limit(1);

	if (error) {
		console.error(`Error fetching featured ${entityType}:`, error);
		throw error; // Propagate the error to the main handler
	}

	return data[0] || null;
}

export async function GET(request) {
	const postCategories = ["septic", "plumbing"];
	const serviceCategories = ["Residential", "Commercial", "Drain Clearing", "Septic", "Engineered Septic", "Drainage"];

	try {
		// Fetch featured items and counts first since they're independent
		const [featuredPostData, featuredServiceData, countData, countDataServices] = await Promise.all([fetchFeaturedItem("tips"), fetchFeaturedItem("services"), supabase.from("tips").select("id", { count: "exact" }), supabase.from("services").select("id", { count: "exact" })]);

		// Now, fetch the newest items which might take longer
		const [postsData, servicesData] = await Promise.all([fetchNewestItems("tips", postCategories), fetchNewestItems("services", serviceCategories)]);

		const responsePayload = {
			posts: categorizeData(postCategories, postsData),
			services: categorizeData(serviceCategories, servicesData),
			featuredPost: featuredPostData,
			featuredService: featuredServiceData,
			totalPosts: countData.data.length,
			totalServices: countDataServices.data.length,
		};

		return new Response(JSON.stringify(responsePayload), { statusCode: 200 });
	} catch (error) {
		console.error("Error in GET function:", error);
		return new Response(JSON.stringify({ error: "Internal Server Error" }), { statusCode: 500 });
	}
}

function categorizeData(categories, fetchedData) {
	return categories.reduce((acc, curr) => {
		acc[curr] = fetchedData[curr];
		return acc;
	}, {});
}
