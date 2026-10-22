import { io } from "next/cache"
import type { ComponentProps } from "react"

import { FilterableArchive } from "@/components/filterable-archive"

export async function RequestArchive(
	props: ComponentProps<typeof FilterableArchive>,
) {
	// Keep only the URL-dependent archive out of the static shell. Otherwise
	// useSearchParams bails out to client rendering during prerendering, leaving
	// archive cards out of ordinary HTML responses and duplicating closing tags.
	// Callers keep their existing Suspense boundary around this request-time UI.
	await io()

	return <FilterableArchive {...props} />
}
