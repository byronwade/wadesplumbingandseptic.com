"use server";

import { supabase } from "@/lib/supabase";

export async function getPromotions() {
	try {
		const { data: promotions, error } = await supabase.from("promotions").select("*");

		if (error) throw error;

		return { promotions };
	} catch (error) {
		console.error("Error fetching promotions:", error);
		return { promotions: null, error: error.message };
	}
}
