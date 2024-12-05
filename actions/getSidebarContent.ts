"use server";

export async function getSidebarContent(pathname: string) {
	// For now, return an empty object until we implement the actual data fetching
	return {
		categories: [],
		recentPosts: [],
		popularPosts: [],
	};
}
