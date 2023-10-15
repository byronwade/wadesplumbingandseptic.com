// src/app/(website)/api/housecallpro/route.js

export async function GET(req) {
	try {
		const data = await fetchScheduledJobs();
		return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
	} catch (error) {
		console.error("Error fetching scheduled jobs:", error);
		return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
	}
}

async function fetchScheduledJobs() {
	const url = "https://api.housecallpro.com/company/schedule_availability/booking_windows";
	const options = {
		method: "GET",
		headers: { Accept: "application/json", Authorization: "Token 504198d362b64b75b960a62d69dc3f6d" },
	};

	try {
		const response = await fetch(url, options);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		throw error; // Rethrow the error so it can be handled by the route handler
	}
}
