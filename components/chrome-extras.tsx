"use client"

import dynamic from "next/dynamic"

const AnalyticsLoader = dynamic(
	() =>
		import("@/components/analytics-loader").then((mod) => mod.AnalyticsLoader),
	{ ssr: false },
)

/** Client islands for analytics (command menu mounts from the root layout). */
export function ChromeExtras() {
	return <AnalyticsLoader />
}
