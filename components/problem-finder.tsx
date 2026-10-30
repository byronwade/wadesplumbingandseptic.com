"use client"

import type { Route } from "next"
import Link from "next/link"
import { useId, useState } from "react"

import { CallButton } from "@/components/call-button"
import { ArrowRight } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import type { FinderProblem, FinderTown } from "@/lib/problem-finder"
import { cn } from "@/lib/utils"

/**
 * "What's going on?" helper: pick a symptom, optionally a town, and get the
 * service page that covers it, the local page when one exists, and the phone
 * number. Nothing is stored or sent anywhere.
 */
export function ProblemFinder({
	problems,
	towns,
	spokes,
}: {
	problems: FinderProblem[]
	towns: FinderTown[]
	spokes: string[]
}) {
	const [problemId, setProblemId] = useState<string | null>(null)
	const [townSlug, setTownSlug] = useState("")
	const townFieldId = useId()

	const problem = problems.find((item) => item.id === problemId)
	const town = towns.find((item) => item.slug === townSlug)
	const [best, ...others] = problem?.services ?? []
	const localService =
		best && town && spokes.includes(`${town.slug}/${best.slug}`) ? best : null

	return (
		<section
			aria-labelledby="problem-finder-title"
			className="section-y border-border surface-sunken border-b"
		>
			<div className="container-shell">
				<div className="section-head mx-auto max-w-2xl text-center">
					<p className="spec-label spec-label-center">Quick help</p>
					<h2 className="type-title" id="problem-finder-title">
						What&apos;s going on?
					</h2>
					<p className="type-lead">
						Pick what you are seeing and we will point you to the right service.
					</p>
				</div>

				<div className="mt-[var(--space-block)] grid grid-cols-1 gap-[var(--space-grid)] lg:grid-cols-[3fr_2fr]">
					<ul
						className="grid grid-cols-1 gap-[min(0.5rem,8px)] sm:grid-cols-2"
						role="list"
					>
						{problems.map((item) => {
							const selected = item.id === problemId
							return (
								<li key={item.id}>
									<button
										aria-pressed={selected}
										className={cn(
											"surface-panel flex min-h-12 w-full items-center px-4 py-3 text-left text-sm font-bold transition-colors",
											"focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
											selected
												? "border-primary bg-accent text-accent-foreground"
												: "hover:border-border-strong",
										)}
										onClick={() => setProblemId(item.id)}
										type="button"
									>
										{item.label}
									</button>
								</li>
							)
						})}
					</ul>

					<div
						aria-live="polite"
						className="surface-panel panel-inset flex flex-col gap-[min(1rem,16px)] rounded-lg"
					>
						{best ? (
							<>
								<div>
									<p className="spec-label">Best fit</p>
									<Link
										prefetch={false}
										className="type-subtitle text-primary mt-2 inline-flex items-center gap-2 underline-offset-4 hover:underline"
										href={`/service-offerings/${best.slug}` as Route}
									>
										{best.label}
										<ArrowRight aria-hidden="true" className="size-4" />
									</Link>
									{others.length ? (
										<p className="text-muted-foreground mt-2 text-sm">
											Also worth a look:{" "}
											{others.map((item, index) => (
												<span key={item.slug}>
													{index ? ", " : null}
													<Link
														prefetch={false}
														className="text-foreground font-bold underline underline-offset-4"
														href={`/service-offerings/${item.slug}` as Route}
													>
														{item.label}
													</Link>
												</span>
											))}
										</p>
									) : null}
								</div>

								<div>
									<label className="text-sm font-bold" htmlFor={townFieldId}>
										Your town (optional)
									</label>
									<select
										className="border-input bg-card mt-2 block min-h-12 w-full rounded-md border px-3 text-base"
										id={townFieldId}
										onChange={(event) => setTownSlug(event.target.value)}
										value={townSlug}
									>
										<option value="">Choose a town</option>
										{towns.map((item) => (
											<option key={item.slug} value={item.slug}>
												{item.name}
											</option>
										))}
									</select>
									{town ? (
										<p className="mt-3 text-sm">
											<Link
												prefetch={false}
												className="font-bold underline underline-offset-4"
												href={
													(localService
														? `/service-area/${town.slug}/${localService.slug}`
														: town.href) as Route
												}
											>
												{localService
													? `${localService.label} in ${town.name}`
													: `Plumbing and septic in ${town.name}`}
											</Link>
										</p>
									) : null}
								</div>

								<div className="mt-auto flex flex-col gap-[min(0.5rem,8px)] sm:flex-row">
									<CallButton
										className="w-full sm:w-auto"
										desktopLabel={`Call ${contactInfo.phoneDisplay}`}
										size="lg"
									/>
									<Link
										prefetch={false}
										className={cn(
											buttonVariants({ variant: "outline", size: "lg" }),
											"w-full sm:w-auto",
										)}
										href="/contact"
									>
										Send a message
									</Link>
								</div>
							</>
						) : (
							<p className="text-muted-foreground my-auto text-center text-sm">
								Choose a problem to see which service covers it.
							</p>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}
