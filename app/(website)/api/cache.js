export function withCache(handler, revalidate = 3600) {
	return async function (req, res) {
		const response = await handler(req, res);
		response.headers.set("Cache-Control", `s-maxage=${revalidate}, stale-while-revalidate`);
		return response;
	};
}
