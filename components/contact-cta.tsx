import Link from "next/link"
import { ArrowRight, Clock, Mail, Phone } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

export function ContactCta({
	title = "Ready to get started?",
	description = "Talk to a local licensed professional and get clear options with no pressure.",
	compact = false,
}: {
	title?: string
	description?: string
	compact?: boolean
}) {
	return (
		<section
			className={cn(
				"surface-dark relative overflow-hidden",
				compact ? "rounded-lg p-7 sm:p-9" : "section-y",
			)}
		>
			<div
				className={cn(
					"relative",
					!compact &&
						"container-shell flex flex-col gap-8 md:flex-row md:items-center md:justify-between",
				)}
			>
				<div className="max-w-2xl">
					<p className="type-eyebrow mb-3">Wade&apos;s Plumbing &amp; Septic</p>
					<h2 className="type-title text-white">{title}</h2>
					<p className="mt-3 text-base leading-relaxed text-[#e8e8e4] sm:text-lg">
						{description}
					</p>
					{!compact ? (
						<div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/75">
							<span className="inline-flex items-center gap-2">
								<Clock className="text-primary-bright size-4" />
								{siteConfig.hours}
							</span>
							<a
								className="inline-flex items-center gap-2 transition-colors hover:text-white"
								href={`mailto:${siteConfig.email}`}
							>
								<Mail className="text-primary-bright size-4" />
								{siteConfig.email}
							</a>
						</div>
					) : null}
				</div>

				<div
					className={cn(
						"mt-7 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row",
						!compact && "md:mt-0 md:max-w-none md:shrink-0",
					)}
				>
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
							"w-full gap-2 sm:w-auto",
						)}
						href="/contact"
						prefetch
					>
						Send a Message
						<ArrowRight />
					</Link>
				</div>
			</div>
		</section>
	)
}
