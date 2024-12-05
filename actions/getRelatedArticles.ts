"use server";

export async function getRelatedArticles(pathname: string) {
	// For now, return an empty array until we implement the actual data fetching
	return {
		articles: [],
		total: 0,
	};
}
