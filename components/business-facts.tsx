import type { Route } from "next"
import Link from "next/link"

import {
	compactFactRows,
	factLinks,
	freeQuoteHref,
	publicFactRows,
} from "@/lib/public-facts"
import { siteConfig } from "@/lib/site"

const linkClass =
	"text-primary underline decoration-current/40 underline-offset-4 hover:decoration-current"

function FactRows({
	rows,
	columns,
}: {
	rows: Array<{ term: string; detail: string }>
	columns: "compact" | "full"
}) {
	return (
		<dl
			className={
				columns === "compact"
					? "mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4"
					: "mt-6 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2"
			}
		>
			{rows.map((row) => (
				<div key={row.term}>
					<dt className="text-muted-foreground text-xs font-semibold">
						{row.term}
					</dt>
					<dd className="mt-1 text-sm font-semibold">{row.detail}</dd>
				</div>
			))}
		</dl>
	)
}

/** Four-row strip on service pages: area, hours, pricing, how to book. */
export function CompactBusinessFacts() {
	const rows = compactFactRows()
	const booking = rows.find((row) => row.term === "How to book")
	const rest = rows.filter((row) => row.term !== "How to book")

	return (
		<div className="container-shell py-6">
			<h2 className="spec-label" id="service-facts-heading">
				At a glance
			</h2>
			<dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
				{rest.map((row) => (
					<div key={row.term}>
						<dt className="text-muted-foreground text-xs font-semibold">
							{row.term}
						</dt>
						<dd className="mt-1 text-sm font-semibold">{row.detail}</dd>
					</div>
				))}
				{booking ? (
					<div>
						<dt className="text-muted-foreground text-xs font-semibold">
							{booking.term}
						</dt>
						<dd className="mt-1 text-sm font-semibold">
							Call{" "}
							<a className={linkClass} href={siteConfig.phoneHref}>
								{siteConfig.phone}
							</a>{" "}
							or{" "}
							<Link
								className={linkClass}
								href={freeQuoteHref as Route}
								prefetch={false}
							>
								request a free quote
							</Link>
							.
						</dd>
					</div>
				) : null}
			</dl>
		</div>
	)
}

/**
 * Server-rendered facts on About Us. Plain HTML so crawlers and assistants
 * can read hours, towns, septic installation, and free quotes without JS.
 */
export function CompanyFacts() {
	return (
		<section
			aria-labelledby="company-facts-heading"
			className="border-border bg-card border-b"
		>
			<div className="container-shell py-8 sm:py-10">
				<h2 className="spec-label" id="company-facts-heading">
					Company facts
				</h2>
				<p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
					Plain facts about {siteConfig.name}. Quotes are free. Pricing is
					flat-rate and quoted on site before work begins.
				</p>
				<FactRows columns="full" rows={publicFactRows()} />
				<ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
					{factLinks.map((item) => (
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
			</div>
		</section>
	)
}
