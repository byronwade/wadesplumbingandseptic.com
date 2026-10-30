"use client"

import type { Route } from "next"
import Link from "next/link"
import { useId, useState } from "react"

import { CallButton } from "@/components/call-button"
import { MapPin } from "@/components/icons"
import { contactInfo } from "@/lib/contact"

type Town = {
	slug: string
	name: string
	href: string
	county: string
	/** Served only at some addresses, so the answer is never a plain yes. */
	byAddress: boolean
}

const normalize = (value: string) =>
	value
		.toLowerCase()
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.replace(/[^a-z0-9]+/g, " ")
		.trim()

/**
 * "Do you cover my town?" Type a town and see whether it has a page here.
 * A town that is not listed gets the phone number, never a yes or a no,
 * because coverage near the edges depends on the address.
 */
export function TownLookup({ towns }: { towns: Town[] }) {
	const [query, setQuery] = useState("")
	const inputId = useId()
	const search = normalize(query)
	const matches = search
		? towns.filter((town) => normalize(town.name).includes(search)).slice(0, 6)
		: []

	return (
		<div className="surface-panel panel-inset rounded-lg">
			<label className="type-subtitle block" htmlFor={inputId}>
				Do you cover my town?
			</label>
			<input
				autoComplete="address-level2"
				className="border-input bg-card mt-3 block min-h-12 w-full rounded-md border px-3 text-base"
				id={inputId}
				onChange={(event) => setQuery(event.target.value)}
				placeholder="Start typing a town, like Felton"
				type="search"
				value={query}
			/>
			<div aria-live="polite" className="mt-4 text-sm">
				{!search ? null : matches.length ? (
					<div className="flex flex-col gap-[min(0.75rem,12px)]">
						<ul className="flex flex-col gap-[min(0.5rem,8px)]">
							{matches.map((town) => (
								<li key={town.slug}>
									<Link
										prefetch={false}
										className="town-link"
										href={town.href as Route}
									>
										<MapPin
											aria-hidden="true"
											className="text-primary size-4 shrink-0"
										/>
										<span className="min-w-0">
											{town.byAddress
												? `Parts of ${town.name}, by address`
												: `Yes, we serve ${town.name}`}
											<span className="text-muted-foreground font-normal">
												{" "}
												({town.county})
											</span>
										</span>
									</Link>
								</li>
							))}
						</ul>
						{matches.some((town) => town.byAddress) ? (
							<>
								<p>
									Coverage there depends on the address. Call with the address
									to confirm.
								</p>
								<CallButton
									className="w-full sm:w-auto"
									desktopLabel={`Call ${contactInfo.phoneDisplay}`}
									size="lg"
								/>
							</>
						) : null}
					</div>
				) : (
					<div className="flex flex-col gap-[min(0.75rem,12px)]">
						<p>
							{query.trim()} is not on our list, but coverage near the edges
							depends on the address. Call with the address to check.
						</p>
						<CallButton
							className="w-full sm:w-auto"
							desktopLabel={`Call ${contactInfo.phoneDisplay}`}
							size="lg"
						/>
					</div>
				)}
			</div>
		</div>
	)
}
