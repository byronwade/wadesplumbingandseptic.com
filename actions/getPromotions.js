import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";

const getCachedPromotions = unstable_cache(
	async () => {
		try {
			const { data: promotions, error } = await supabase
				.from("promotions")
				.select(
					`
					id,
					title,
					description,
					slug,
					created_at,
					content,
					featuredImage: images (alttext, sourceurl, sizes)
					`
				)
				.order("created_at", { ascending: false });

			if (error) throw error;

			return { promotions };
		} catch (error) {
			console.error("Error fetching promotions:", error);
			return { promotions: [], error: error.message };
		}
	},
	["promotions"],
	{
		tags: ["promotions"],
		revalidate: 60, // Cache for 60 seconds
	}
);

export async function getPromotions() {
	return getCachedPromotions();
}

const getCachedPromotionDetails = unstable_cache(
	async (slug) => {
		try {
			const { data, error } = await supabase
				.from("promotions")
				.select(
					`
					id,
					title,
					description,
					slug,
					created_at,
					content,
					featuredImage: images (alttext, sourceurl, sizes)
					`
				)
				.eq("slug", slug)
				.single();

			if (error) throw error;

			return { promotion: data };
		} catch (error) {
			console.error("Error fetching promotion details:", error);
			return { promotion: null, error: error.message };
		}
	},
	["promotion-details"],
	{
		tags: ["promotions"],
		revalidate: 60, // Cache for 60 seconds
	}
);

export async function getPromotionDetails(slug) {
	return getCachedPromotionDetails(slug);
}
