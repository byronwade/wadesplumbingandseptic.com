const SerpApi = require("serpapi-client");
const serpApi = new SerpApi.GoogleSearchApi(YOUR_API_KEY);

const params = {
	engine: "google_reviews",
	q: "Wade's Plumbing & Septic",
	hl: "en",
	num: 6,
	filter: "5",
	api_key: "6b76bbd0dc381cbd09862af92c69d2b922b0eab3528fabd58fbf443048e5adf1",
};

async function getGoogleReviews() {
	try {
		const response = await serpApi.search(params);
		const reviews = response.organic_results;
		return reviews;
	} catch (error) {
		console.log(error);
	}
}

module.exports = getGoogleReviews;
