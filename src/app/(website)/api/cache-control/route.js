export async function GET() {
	return new Response("Cache Control", {
		status: 200,
		headers: {
			"Cache-Control": "max-age=10",
			"CDN-Cache-Control": "max-age=60",
			"Vercel-CDN-Cache-Control": "max-age=3600",
		},
	});
}
