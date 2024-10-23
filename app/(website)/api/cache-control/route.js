export function setCacheControl(res) {
	res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
}
