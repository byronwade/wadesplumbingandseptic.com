import type { Route } from "next"
import Link from "next/link"
import { ArrowRight, Phone } from "@/components/icons"

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
					<div className="section-head reveal items-center text-center">
						<p className="spec-label spec-label-center">
							{conversion.eyebrow}
						</p>
						<h2 className="type-title text-white">{conversion.title}</h2>
						<p className="type-lead text-on-dark-muted mx-auto max-w-2xl">
							{conversion.description}
						</p>
					</div>

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
								<ArrowRight aria-hidden="true" />
							</a>
						) : (
							<Link
								className={secondaryClassName}
								href={secondary.href as Route}
								prefetch
							>
								{secondary.label}
								<ArrowRight aria-hidden="true" />
							</Link>
						)}
					</div>
				</div>

				{conversion.testimonials.length > 0 ? (
					<div className="mx-auto mt-14 max-w-5xl">
						<p className="spec-label spec-label-center mb-7">
							What neighbors say
						</p>
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

			{/*
			  Credential bar mirrors the home cinematic hero: one hairline row
			  instead of a wrap cluster of stars and chips.
			*/}
			<div className="relative border-t border-white/12 bg-black/25">
				<div className="container-shell flex flex-wrap items-center justify-center gap-x-7 gap-y-2 py-3.5 sm:justify-between">
					<p className="text-on-dark-subtle font-mono text-[0.625rem] tracking-[0.16em] uppercase">
						<span className="text-primary-bright">★★★★★</span>
						<span className="ml-2 text-white/85">5-star local reviews</span>
					</p>
					<p className="text-on-dark-subtle font-mono text-[0.625rem] tracking-[0.16em] uppercase">
						{siteConfig.licenses}
					</p>
					<p className="text-on-dark-subtle font-mono text-[0.625rem] tracking-[0.16em] uppercase">
						{siteConfig.hours}
					</p>
				</div>
			</div>
		</section>
	)
}
