import { supabase } from "../../utils/supabase";

/**
 * Fetch the newest items for a given entity type and categories.
 * @param {string} entityType - The type of entity to fetch.
 * @param {string[]} categoryNames - The names of the categories to fetch.
 * @returns {Promise<Object>} The response payload containing the newest items.
 */
async function fetchNewestItems(entityType, categoryNames) {
	const responsePayload = {};

	for (const categoryName of categoryNames) {
		// Convert the category name to database format
		const categoryId = toDatabaseCategory(categoryName);

		const { data, error } = await supabase.from(entityType).select("slug, title, readingtime").contains("categories", [categoryId]).order("created_at", { ascending: false }).limit(4);

		if (error) {
			console.error(`Error fetching ${entityType} for category name ${categoryName} (ID: ${categoryId}):`, error);
			throw new Error(`Error fetching ${entityType} for category name ${categoryName}`);
		}

		// Use the categoryName for constructing the response
		responsePayload[categoryName] = data;
	}

	return responsePayload;
}

/**
 * Fetch the featured item for a given entity type.
 * @param {string} entityType - The type of entity to fetch.
 * @returns {Promise<Object|null>} The featured item or null if not found.
 */
async function fetchFeaturedItem(entityType) {
	const { data, error } = await supabase.from(entityType).select("slug, title, readingtime").eq("featured", true).limit(1);

	if (error) {
		console.error(`Error fetching featured ${entityType}:`, error);
		throw new Error(`Error fetching featured ${entityType}`);
	}

	return data[0] || null;
}

/**
 * Categorize fetched data based on categories.
 * @param {string[]} categories - The list of categories.
 * @param {Object} fetchedData - The data fetched from the database.
 * @returns {Object} The categorized data.
 */
function categorizeData(categories, fetchedData) {
	return categories.reduce((acc, curr) => {
		acc[curr] = fetchedData[curr];
		return acc;
	}, {});
}

/**
 * Convert a string to database category format.
 * @param {string} str - The string to convert.
 * @returns {string} The formatted category string.
 */
function toDatabaseCategory(str) {
	return str
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2") // Convert camelCase to spaced words
		.split(" ") // Split the string into words
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
		.join(" "); // Join words back together
}

/**
 * Get the menu data including posts and services.
 * @returns {Promise<Object>} The menu data.
 */
export default async function getMenu() {
	const postCategories = ["septic", "plumbing"];
	const serviceCategories = ["residential", "commercial", "drainClearing", "septic", "engineeredSeptic", "drainage"];

	try {
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
	} catch (error) {
		console.error("Error fetching menu data:", error);
		throw new Error("Error fetching menu data");
	}
}
