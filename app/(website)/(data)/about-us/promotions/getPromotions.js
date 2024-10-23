import { supabase } from "../../../../../utils/supabase";

export default async function getPromotions() {
	let { data: promotions, error } = await supabase.from("promotions").select("*");

	if (error) {
		console.error("Error fetching data:", error);
		return { promotions: null, error: error };
	}

	// const jsonLd = {
	// 	"@context": "https://schema.org",
	// 	"@type": "OfferCatalog",
	// 	name: "Current Promotions & Discounts",
	// 	url: "https://www.wadesplumbingandseptic.com/about-us/promotions/",
	// 	description: "Discover the latest promotions and discounts offered by Wade&#39;s Plumbing & Septic. Save on your next plumbing project with our exclusive deals.",
	// 	provider: {
	// 		"@type": "Organization",
	// 		name: "Wade&#39;s Plumbing & Septic",
	// 		url: "https://www.wadesplumbingandseptic.com",
	// 	},
	// 	// Assuming the promotions data is available in a similar format
	// 	itemListElement: promotions
	// 		? promotions.map((promotion, index) => ({
	// 				"@type": "Offer",
	// 				url: `https://www.wadesplumbingandseptic.com/about-us/promotions/#offer-${index + 1}`,
	// 				name: promotion.title,
	// 				//description: promotion.content,
	// 				price: "Contact for Price",
	// 				validThrough: promotion.expiration,
	// 		  }))
	// 		: [],
	// };

	return { promotions };
}
