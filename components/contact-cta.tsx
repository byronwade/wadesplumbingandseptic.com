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
				"relative overflow-hidden bg-[#111] text-white",
				compact ? "rounded-2xl p-7 sm:p-9" : "py-16",
			)}
		>
			<div className="bg-primary/15 pointer-events-none absolute -top-24 -right-24 size-72 rounded-full blur-3xl" />
			<div
				className={cn(
					"relative",
					!compact &&
						"mx-auto flex max-w-7xl flex-col gap-8 px-4 md:flex-row md:items-center md:justify-between md:px-8",
				)}
			>
				<div className="max-w-2xl">
					<p className="text-primary-bright mb-2 text-xs font-black tracking-[0.18em] uppercase">
						Wade&apos;s Plumbing &amp; Septic
					</p>
					<h2 className="text-3xl font-black tracking-tight sm:text-4xl">
						{title}
					</h2>
					<p className="mt-3 leading-relaxed text-neutral-200">{description}</p>
					<div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-300">
						<span className="inline-flex items-center gap-2">
							<Clock className="text-primary-bright size-4" />
							{siteConfig.hours}
						</span>
						<a
							className="inline-flex items-center gap-2 hover:text-white"
							href={`mailto:${siteConfig.email}`}
						>
							<Mail className="text-primary-bright size-4" />
							{siteConfig.email}
						</a>
					</div>
				</div>

				<div
					className={cn(
						"mt-7 flex flex-col gap-3 sm:flex-row",
						!compact && "md:mt-0 md:shrink-0",
					)}
				>
					<a
						className={cn(buttonVariants({ size: "xl" }), "gap-2")}
						href={siteConfig.phoneHref}
					>
						<Phone className="size-5" />
						Call {siteConfig.phone}
					</a>
					<Link
						className={cn(
							buttonVariants({ variant: "inverse", size: "xl" }),
							"gap-2",
						)}
						href="/contact"
					>
						Send a Message
						<ArrowRight />
					</Link>
				</div>
			</div>
		</section>
	)
}
