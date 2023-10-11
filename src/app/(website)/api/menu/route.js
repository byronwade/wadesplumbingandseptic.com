import { supabase } from "../../../../utils/supabase";

// Function to fetch the newest 4 items (either posts or services) for specified categories
async function fetchNewestItems(entityType, categoryIds) {
	const responsePayload = {};

	for (const categoryId of categoryIds) {
		const { data, error } = await supabase
			.from(entityType)
			.select(
				`
        slug,
        title,
        readingtime
        `
			)
			.contains("categories", [categoryId]) // Use "contains" for an array of values
			.order("created_at", { ascending: false })
			.limit(4);

		if (error) {
			console.error(`Error fetching ${entityType} for category ID ${categoryId}:`, error);
			return new Response(JSON.stringify({ error }), { statusCode: 500 });
		}

		responsePayload[categoryId] = data; // Store data under the category name
	}

	return responsePayload;
}

// Function to fetch the featured item (either a featured post or featured service)
async function fetchFeaturedItem(entityType) {
	const { data, error } = await supabase
		.from(entityType)
		.select(
			`
      slug,
      title,
      readingtime
      `
		)
		.eq("featured", true) // Check for featured items
		.limit(1); // Limit to one featured item

	if (error) {
		console.error(`Error fetching featured ${entityType}:`, error);
		return new Response(JSON.stringify({ error }), { statusCode: 500 });
	}

	return data[0] || null;
}

export async function GET(request) {
	const postCategories = {
		septic: "septic",
		plumbing: "plumbing",
		// Add more categories as needed
	};

	const serviceCategories = {
		Residential: "Residential",
		Commercial: "Commercial",
		"Drain Clearing": "DrainClearing",
		Septic: "Septic",
		"Engineered Septic": "EngineeredSeptic",
		Drainage: "Drainage",
		// Add more categories as needed
	};

	const postsData = await fetchNewestItems("posts", Object.keys(postCategories));
	const servicesData = await fetchNewestItems("services", Object.keys(serviceCategories));
	const featuredPostData = await fetchFeaturedItem("posts");
	const featuredServiceData = await fetchFeaturedItem("services");

	// Create an object for featured post and featured service
	const featuredPayload = {
		featuredPost: featuredPostData,
		featuredService: featuredServiceData,
	};

	// Determine total count - if there's a search term, only count matching posts
	const countQuery = supabase.from("posts").select("id", { count: "exact" });
	const countData = await countQuery;
	const totalPosts = countData.data.length;

	// Determine total count - if there's a search term, only count matching posts
	const countQueryServices = supabase.from("services").select("id", { count: "exact" });
	const countDataServices = await countQueryServices;
	const totalServices = countDataServices.data.length;

	// Organize the data by category names
	const categorizedPosts = {};
	const categorizedServices = {};

	for (const categoryId of Object.keys(postCategories)) {
		categorizedPosts[postCategories[categoryId]] = postsData[categoryId];
	}

	for (const categoryId of Object.keys(serviceCategories)) {
		categorizedServices[serviceCategories[categoryId]] = servicesData[categoryId];
	}

	// Merge the featured posts, services, and total counts into the response payload
	const responsePayload = {
		posts: categorizedPosts,
		services: categorizedServices,
		...featuredPayload,
		totalPosts,
		totalServices,
	};

	return new Response(JSON.stringify(responsePayload), { statusCode: 200 });
}
