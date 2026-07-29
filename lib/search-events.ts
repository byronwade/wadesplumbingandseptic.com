export const OPEN_GLOBAL_SEARCH_EVENT = "wades:open-global-search"

export function openGlobalSearch() {
	if (typeof window === "undefined") return
	window.dispatchEvent(new Event(OPEN_GLOBAL_SEARCH_EVENT))
}
