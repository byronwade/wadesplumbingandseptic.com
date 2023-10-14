import { supabase } from "../../utils/supabase";

async function fetchNewestItems(entityType, categoryNames) {
	const responsePayload = {};

	for (let categoryName of categoryNames) {
		// Convert the category name to database format
		const categoryId = toDatabaseCategory(categoryName);

		const { data, error } = await supabase.from(entityType).select(`slug, title, readingtime`).contains("categories", [categoryId]).order("created_at", { ascending: false }).limit(4);

		if (error) {
			console.error(`Error fetching ${entityType} for category name ${categoryName} (ID: ${categoryId}):`, error);
			throw error; // Propagate the error to the main handler
		}

		// Use the categoryName for constructing the response
		responsePayload[categoryName] = data;
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

function categorizeData(categories, fetchedData) {
	return categories.reduce((acc, curr) => {
		acc[curr] = fetchedData[curr];
		return acc;
	}, {});
}

function toDatabaseCategory(str) {
	return str
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2") // Convert camelCase to spaced words
		.split(" ") // Split the string into words
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
		.join(" "); // Join words back together
}

export default async function getMenu() {
	const postCategories = ["septic", "plumbing"];
	const serviceCategories = ["residential", "commercial", "drainClearing", "septic", "engineeredSeptic", "drainage"];

	// Fetch featured items and counts first since they're independent
	const [featuredPostData, featuredServiceData, countData, countDataServices] = await Promise.all([fetchFeaturedItem("tips"), fetchFeaturedItem("services"), supabase.from("tips").select("id", { count: "exact" }), supabase.from("services").select("id", { count: "exact" })]);

	// Now, fetch the newest items which might take longer
	const [postsData, servicesData] = await Promise.all([fetchNewestItems("tips", postCategories), fetchNewestItems("services", serviceCategories)]);

	return {
		posts: categorizeData(postCategories, postsData),
		services: categorizeData(serviceCategories, servicesData),
		featuredPost: featuredPostData,
		featuredService: featuredServiceData,
		totalPosts: countData.data.length,
		totalServices: countDataServices.data.length,
	};
}
