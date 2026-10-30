import type { Route } from "next"
import Link from "next/link"
import {
	ArrowLeft,
	ArrowRight,
	BookOpen,
	MapPin,
	Phone,
	PipeWrench,
} from "@/components/icons"

import { CallLabel } from "@/components/call-label"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

const destinations = [
	{
		href: "/services",
		icon: PipeWrench,
		title: "Services",
		body: "Plumbing, septic, and commercial work.",
	},
	{
		href: "/service-areas",
		icon: MapPin,
		title: "Service areas",
		body: "Towns we cover across Santa Cruz County.",
	},
	{
		href: "/expert-tips",
		icon: BookOpen,
		title: "Expert tips",
		body: "Guides for common plumbing and septic problems.",
	},
] as const

export default function NotFound() {
	return (
		<main className="surface-hero" id="main-content">
			<div className="container-shell grid min-h-[60vh] grid-cols-1 place-items-center py-[var(--space-section-y)]">
				<div className="section-head max-w-xl text-center">
					<p className="spec-label spec-label-center">Error 404</p>
					<h1 className="type-headline text-on-dark">
						This page could not be found.
					</h1>
					<p className="type-lead text-on-dark-muted">
						The page may have moved during our website upgrade. Use the links
						below or call us and we will point you in the right direction.
					</p>
					<div className="flex flex-col justify-center gap-3 pt-3 sm:flex-row">
						<Link
							prefetch={false}
							className={cn(
								buttonVariants({ size: "lg", wrap: true }),
								"w-full sm:w-auto",
							)}
							href="/"
						>
							<ArrowLeft aria-hidden="true" />
							Back home
						</Link>
						<a
							className={cn(
								buttonVariants({ variant: "inverse", size: "lg", wrap: true }),
								"w-full sm:w-auto",
							)}
							href={siteConfig.phoneHref}
						>
							<CallLabel
								icon={<Phone aria-hidden="true" />}
								label={siteConfig.phone}
							/>
						</a>
					</div>
				</div>
				<ul className="mt-[var(--space-block)] grid w-full max-w-4xl grid-cols-1 gap-[var(--space-grid)] sm:grid-cols-3">
					{destinations.map(({ href, icon: Icon, title, body }) => (
						<li key={href}>
							<Link
								prefetch={false}
								className="group flex h-full flex-col rounded-lg border border-white/10 bg-white/5 p-5 transition-colors hover:border-[var(--primary-bright)]"
								href={href as Route}
							>
								<Icon
									aria-hidden="true"
									className="text-primary-bright size-6 shrink-0"
								/>
								<span className="text-on-dark mt-4 flex items-center gap-2 font-semibold">
									{title}
									<ArrowRight
										aria-hidden="true"
										className="size-4 transition-transform group-hover:translate-x-0.5"
									/>
								</span>
								<span className="text-on-dark-muted mt-1 text-sm leading-relaxed">
									{body}
								</span>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</main>
	)
}
