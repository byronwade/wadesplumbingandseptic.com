import { useLogger, withEvlog } from "@/lib/evlog"
import { getSearchIndex } from "@/lib/search-index"

export const GET = withEvlog(async () => {
	const log = useLogger()
	const index = await getSearchIndex()

	log.set({
		searchIndex: {
			documentCount: index.length,
		},
	})

	return Response.json(index, {
		headers: {
			"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
		},
	})
})
