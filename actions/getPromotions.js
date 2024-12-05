"use cache";

import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";

const getCachedPromotions = unstable_cache(
	async () => {
		try {
			const { data: promotions, error } = await supabase.from("promotions").select("*");

			if (error) throw error;

			return promotions;
		} catch (error) {
			console.error("Error fetching promotions:", error);
			return null;
		}
	},
	["promotions"],
	{
		tags: ["promotions"],
		revalidate: 3600, // Cache for 1 hour
	}
);

export async function getPromotions() {
	try {
		const promotions = await getCachedPromotions();
		return { promotions };
	} catch (error) {
		console.error("Error in getPromotions:", error);
		return { promotions: null, error: error.message };
	}
}
