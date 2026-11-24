import type { Route } from "next"
import Link from "next/link"

import { midNavLinks } from "@/lib/navigation"

const linkClassName =
	"hover:text-primary-bright focus:text-primary-bright focus-visible:ring-ring text-on-dark hover:bg-transparent focus:bg-transparent inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-3.5 py-2 text-sm font-semibold transition-colors outline-none focus-visible:ring-2 @max-[80rem]/header:px-2.5"

/**
 * Server-rendered desktop links that match the mega-menu trigger row. Shown
 * until the Radix menu hydrates on wide screens; hidden on phones where the
 * toolbar hamburger is the menu.
 */
export function StaticHeaderNav() {
	return (
		<nav
			aria-label="Primary navigation"
			className="static hidden max-w-none flex-1 items-center justify-center @min-[64rem]/header:flex"
		>
			<ul className="flex flex-1 list-none items-center justify-center gap-1">
				<li>
					<Link prefetch={false} className={linkClassName} href={"/" as Route}>
						Home
					</Link>
				</li>
				<li>
					<Link
						prefetch={false}
						className={linkClassName}
						href={"/services" as Route}
					>
						Services
					</Link>
				</li>
				{midNavLinks.map((item) => (
					<li key={item.href}>
						<Link
							prefetch={false}
							className={linkClassName}
							href={item.href as Route}
						>
							{item.label}
						</Link>
					</li>
				))}
				<li>
					<Link
						prefetch={false}
						className={linkClassName}
						href={"/about-us" as Route}
					>
						Company
					</Link>
				</li>
			</ul>
		</nav>
	)
}
