/** Client-safe: no `server-only` import, so both server and client modules can use it. */
export function taxonomySlug(value: string) {
	return value
		.toLowerCase()
		.replace(/&/g, "and")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "")
}
