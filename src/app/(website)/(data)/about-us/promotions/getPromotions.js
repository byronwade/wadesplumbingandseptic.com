import { supabase } from "../../../../../utils/supabase";

export default async function fetchData() {
	let { data: promotions, error } = await supabase.from("promotions").select("*");
	console.log(promotions);

	if (error) {
		console.error("Error fetching data:", error);
		return { promotions: null, error: error };
	}
	return { promotions };
}
