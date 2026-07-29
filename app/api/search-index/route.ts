import { getSearchIndex } from "@/lib/search-index"

export async function GET() {
	const index = await getSearchIndex()

	return Response.json(index, {
		headers: {
			"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
		},
	})
}
