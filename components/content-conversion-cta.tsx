import type { Route } from "next"
import Link from "next/link"
import { ArrowRight, BadgeCheck, Clock, Phone, Star } from "@/components/icons"

import { buttonVariants } from "@/components/ui/button"
import type { ContentConversion } from "@/lib/content-conversion"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

export function ContentConversionCta({
	conversion,
	secondaryAction,
}: {
	conversion: ContentConversion
	/** Override the secondary CTA (defaults to Contact / Get a Free Quote). */
	secondaryAction?: {
		href: string
		label: string
		external?: boolean
	}
}) {
	const secondary = secondaryAction ?? {
		href: "/contact",
		label: "Get a Free Quote",
		external: false,
	}
	const secondaryClassName = cn(
		buttonVariants({ variant: "inverse", size: "xl" }),
		"w-full sm:w-auto",
	)
	const secondaryIsExternal =
		secondary.external ||
		secondary.href.startsWith("mailto:") ||
		secondary.href.startsWith("tel:")

	return (
		<section className="surface-hero tex-grid tex-glow overflow-hidden">
			<div className="container-shell section-y relative">
				<div className="mx-auto max-w-3xl text-center">
					<p className="spec-label spec-label-center reveal">
						{conversion.eyebrow}
					</p>
					<h2 className="type-title reveal mt-4 text-white">
						{conversion.title}
					</h2>
					<p className="type-lead reveal text-on-dark-muted mx-auto mt-5 max-w-2xl">
						{conversion.description}
					</p>

					<div className="reveal mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
						<a
							className={cn(buttonVariants({ size: "xl" }), "w-full sm:w-auto")}
							href={siteConfig.phoneHref}
						>
							<Phone aria-hidden="true" />
							Call {siteConfig.phone}
						</a>
						{secondaryIsExternal ? (
							<a className={secondaryClassName} href={secondary.href}>
								{secondary.label}
								<ArrowRight />
							</a>
						) : (
							<Link
								className={secondaryClassName}
								href={secondary.href as Route}
								prefetch
							>
								{secondary.label}
								<ArrowRight />
							</Link>
						)}
					</div>

					<ul className="text-on-dark-muted reveal mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-bold">
						<li className="inline-flex items-center gap-2">
							<span
								className="text-primary-bright inline-flex items-center gap-0.5"
								aria-label="5 star rated"
							>
								{Array.from({ length: 5 }).map((_, index) => (
									<Star
										className="size-3.5 fill-current"
										key={index}
										aria-hidden="true"
									/>
								))}
							</span>
							5-star local reviews
						</li>
						<li className="inline-flex items-center gap-2">
							<BadgeCheck
								className="text-primary-bright size-4"
								aria-hidden="true"
							/>
							{siteConfig.licenses}
						</li>
						<li className="inline-flex items-center gap-2">
							<Clock
								className="text-primary-bright size-4"
								aria-hidden="true"
							/>
							{siteConfig.hours}
						</li>
					</ul>
				</div>

				{conversion.testimonials.length > 0 ? (
					<div className="mx-auto mt-14 max-w-5xl">
						<p className="spec-label spec-label-center mb-7">
							What neighbors say
						</p>
						{/* No manual delays: scroll-driven reveals stagger on their own,
						    since each column crosses the viewport edge in turn. */}
						<ul className="grid gap-8 md:grid-cols-3 md:gap-10">
							{conversion.testimonials.map((testimonial, index) => (
								<li
									className="reveal relative"
									key={`${testimonial.name}-${index}`}
								>
									<blockquote className="border-t border-white/10 pt-5">
										<p className="text-on-dark-muted text-[0.9375rem] leading-relaxed text-pretty">
											&ldquo;{testimonial.quote}&rdquo;
										</p>
										<footer className="mt-4 text-sm font-bold text-white">
											{testimonial.name}
											{testimonial.location ? (
												<span className="text-on-dark-subtle font-normal">
													{" "}
													· {testimonial.location}
												</span>
											) : null}
										</footer>
									</blockquote>
								</li>
							))}
						</ul>
					</div>
				) : null}
			</div>
		</section>
	)
}
