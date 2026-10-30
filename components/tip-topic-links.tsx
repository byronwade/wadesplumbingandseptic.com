import type { Route } from "next"
import Link from "next/link"

import { postCategoryAliases } from "@/lib/post-categories"

/** Links the expert tips index to each topic archive so every archive is reachable. */
export function TipTopicLinks() {
	const topics = Object.entries(postCategoryAliases).map(([slug, labels]) => ({
		href: `/category/${slug}`,
		label: labels[0] ?? slug,
	}))

	return (
		<nav
			aria-label="Guide topics"
			className="container-shell pt-[var(--space-grid)]"
		>
			<p className="spec-label">Browse by topic</p>
			<ul className="mt-3 flex flex-wrap gap-[min(0.75rem,12px)]">
				{topics.map((topic) => (
					<li className="max-w-full min-w-0" key={topic.href}>
						<Link
							prefetch={false}
							className="surface-panel inline-flex max-w-full px-[min(1rem,16px)] py-[min(0.5rem,8px)] text-sm font-bold [overflow-wrap:anywhere]"
							href={topic.href as Route}
						>
							{topic.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	)
}
