"use client"

import dynamic from "next/dynamic"

const CommandMenuLoader = dynamic(
	() =>
		import("@/components/command-menu-loader").then(
			(mod) => mod.CommandMenuLoader,
		),
	{ ssr: false },
)

const AnalyticsLoader = dynamic(
	() =>
		import("@/components/analytics-loader").then((mod) => mod.AnalyticsLoader),
	{ ssr: false },
)

/** Client islands for search + analytics (mounted with site chrome). */
export function ChromeExtras() {
	return (
		<>
			<CommandMenuLoader />
			<AnalyticsLoader />
		</>
	)
}
