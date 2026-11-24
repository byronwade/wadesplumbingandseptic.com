import type { Route } from "next"
import Link from "next/link"

import type { ArchiveItem } from "@/lib/archive"

const linkClass = "text-primary underline-offset-4 hover:underline"

/**
 * In-article service and town links with descriptive anchors. Related rails
 * still show cards; this list is the crawlable, quoteable path.
 */
export function GuideLocalLinks({
	services,
	towns,
}: {
	services: ArchiveItem[]
	towns: ArchiveItem[]
}) {
	const serviceLinks = services.slice(0, 3)
	const townLinks = towns.slice(0, 3)
	if (!serviceLinks.length && !townLinks.length) return null

	return (
		<nav
			aria-label="Related services and towns"
			className="border-border mt-12 border-t pt-8"
		>
			<h2 className="type-title">Related services and towns</h2>
			<p className="text-muted-foreground mt-3 text-sm leading-relaxed">
				Wade&apos;s Plumbing &amp; Septic can handle this work in Santa Cruz
				County. Start with the matching service page, then the town page for
				your address.
			</p>
			<ul className="mt-4 flex flex-col gap-2 text-sm font-semibold">
				{serviceLinks.map((item) => (
					<li key={item.href}>
						<Link
							className={linkClass}
							href={item.href as Route}
							prefetch={false}
						>
							{item.title}
						</Link>
					</li>
				))}
				{townLinks.map((item) => (
					<li key={item.href}>
						<Link
							className={linkClass}
							href={item.href as Route}
							prefetch={false}
						>
							{item.title}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	)
}
