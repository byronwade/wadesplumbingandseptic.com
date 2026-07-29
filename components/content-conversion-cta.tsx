import Link from "next/link"
import { ArrowRight, BadgeCheck, Clock, Phone, Star } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import type { ContentConversion } from "@/lib/content-conversion"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

export function ContentConversionCta({
	conversion,
}: {
	conversion: ContentConversion
}) {
	return (
		<section className="surface-dark relative overflow-hidden">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-90"
				style={{
					background: `
						radial-gradient(ellipse 70% 55% at 12% 20%, color-mix(in srgb, var(--primary) 28%, transparent), transparent 70%),
						radial-gradient(ellipse 50% 45% at 88% 80%, color-mix(in srgb, var(--primary-bright) 14%, transparent), transparent 65%),
						linear-gradient(165deg, var(--ink) 0%, var(--ink-soft) 55%, #15191e 100%)
					`,
				}}
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--primary-bright)_45%,transparent)] to-transparent"
			/>

			<div className="container-shell section-y relative">
				<div className="mx-auto max-w-3xl text-center">
					<p className="type-eyebrow text-primary-bright motion-fade">
						{conversion.eyebrow}
					</p>
					<h2 className="type-title motion-rise mt-4 text-balance text-white">
						{conversion.title}
					</h2>
					<p className="motion-fade motion-delay-1 mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#e8e8e4] sm:text-lg">
						{conversion.description}
					</p>

					<div className="motion-rise motion-delay-2 mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
						<a
							className={cn(
								buttonVariants({ size: "xl" }),
								"w-full gap-2 sm:w-auto",
							)}
							href={siteConfig.phoneHref}
						>
							<Phone className="size-5" />
							Call {siteConfig.phone}
						</a>
						<Link
							className={cn(
								buttonVariants({ variant: "inverse", size: "xl" }),
								"w-full justify-center gap-2 sm:w-auto",
							)}
							href="/contact"
							prefetch
						>
							Get a Free Quote
							<ArrowRight />
						</Link>
					</div>

					<ul className="text-white/70 motion-fade motion-delay-2 mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-bold">
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
							<Clock className="text-primary-bright size-4" aria-hidden="true" />
							{siteConfig.hours}
						</li>
					</ul>
				</div>

				<div className="mx-auto mt-14 max-w-5xl">
					<p className="text-primary-bright mb-6 text-center text-xs font-extrabold tracking-[0.18em] uppercase">
						What neighbors say
					</p>
					<ul className="grid gap-8 md:grid-cols-3 md:gap-10">
						{conversion.testimonials.map((testimonial, index) => (
							<li
								key={`${testimonial.name}-${index}`}
								className={cn(
									"motion-rise relative",
									index === 1 && "motion-delay-1",
									index >= 2 && "motion-delay-2",
								)}
							>
								<blockquote className="border-white/10 border-t pt-5">
									<p className="text-[0.95rem] leading-relaxed text-[#e8e8e4]">
										&ldquo;{testimonial.quote}&rdquo;
									</p>
									<footer className="mt-4 text-sm font-extrabold text-white">
										{testimonial.name}
										{testimonial.location ? (
											<span className="text-white/55 font-bold">
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
			</div>
		</section>
	)
}
