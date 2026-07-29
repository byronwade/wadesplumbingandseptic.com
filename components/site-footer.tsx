import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { Phone } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { companyNavigation, resourceNavigation, siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

const serviceLinks = [
	{ href: "/service-offerings/drain-cleaning", label: "Drain Cleaning" },
	{
		href: "/service-offerings/tankless-water-heater-installation",
		label: "Tankless Water Heaters",
	},
	{
		href: "/service-offerings/septic-tank-inspection-and-assessment",
		label: "Septic Inspections",
	},
	{
		href: "/service-offerings/alternative-septic-system-installation",
		label: "Engineered Septic",
	},
]

export function SiteFooter() {
	return (
		<footer className="bg-ink text-white">
			<div className="bg-primary shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.18)]">
				<div className="container-shell flex flex-col items-center justify-between gap-4 py-6 text-center sm:flex-row sm:text-left">
					<div>
						<p className="text-sm font-bold text-white/85">
							{siteConfig.hours}
						</p>
						<p className="text-2xl font-extrabold tracking-[-0.03em]">
							{siteConfig.phone}
						</p>
					</div>
					<a
						className={cn(
							buttonVariants({ variant: "secondary", size: "lg" }),
							"text-foreground w-full gap-2 bg-white hover:bg-white/90 sm:w-auto",
						)}
						href={siteConfig.phoneHref}
					>
						<Phone className="size-4" aria-hidden="true" />
						Call Now
					</a>
				</div>
			</div>

			<div className="container-shell py-14 sm:py-16">
				<div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
					<div>
						<Link
							className="flex items-center gap-3 text-lg font-extrabold tracking-[-0.03em]"
							href="/"
							prefetch
						>
							<Image
								alt=""
								className="size-11 shrink-0 rounded-md sm:size-12"
								height={48}
								src="/images/brand/wades-mark-sm.webp"
								width={48}
							/>
							<span className="leading-tight">
								Wade&apos;s Plumbing
								<span className="text-primary-bright mt-1 block text-[0.65rem] font-extrabold tracking-[0.18em] uppercase">
									&amp; Septic
								</span>
							</span>
						</Link>
						<p className="mt-4 text-sm leading-relaxed text-white/65">
							Family-owned plumbing and septic specialists. Honest
							recommendations, clear pricing, and quality workmanship.
						</p>
						<p className="mt-4 text-xs font-bold text-white/45">
							{siteConfig.licenses}
						</p>
						<div className="mt-5 flex gap-3">
							{[
								{
									href: siteConfig.social.facebook,
									label: "Facebook",
									mark: "f",
								},
								{
									href: siteConfig.social.linkedin,
									label: "LinkedIn",
									mark: "in",
								},
								{
									href: siteConfig.social.instagram,
									label: "Instagram",
									mark: "i",
								},
							].map((item) => (
								<a
									className="hover:text-primary-bright grid size-10 place-items-center text-white/60 transition-colors"
									href={item.href}
									aria-label={item.label}
									key={item.label}
								>
									<span className="text-xs font-extrabold" aria-hidden="true">
										{item.mark}
									</span>
								</a>
							))}
						</div>
					</div>

					<FooterColumn title="Services" links={serviceLinks} />
					<FooterColumn title="Company" links={companyNavigation} />
					<FooterColumn title="Resources" links={resourceNavigation} />
				</div>

				<div className="mt-14 flex flex-col gap-4 pt-7 text-xs text-white/45 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] sm:flex-row sm:items-center sm:justify-between">
					<p>© 2026 Wade&apos;s Plumbing &amp; Septic. All rights reserved.</p>
					<div className="flex gap-5">
						<Link
							className="transition-colors hover:text-white"
							href="/privacy-policy"
							prefetch
						>
							Privacy Policy
						</Link>
						<Link
							className="transition-colors hover:text-white"
							href="/terms-of-service"
							prefetch
						>
							Terms
						</Link>
						<Link
							className="transition-colors hover:text-white"
							href="/sitemap.xml"
							prefetch
						>
							Sitemap
						</Link>
					</div>
				</div>
			</div>
		</footer>
	)
}

function FooterColumn({
	title,
	links,
}: {
	title: string
	links: ReadonlyArray<{ href: string; label: string }>
}) {
	return (
		<div>
			<h2 className="text-xs font-extrabold tracking-[0.16em] uppercase">
				{title}
			</h2>
			<ul className="mt-4 space-y-3 text-sm text-white/55">
				{links.map((link) => (
					<li key={link.href}>
						<Link
							className="hover:text-primary-bright transition-colors"
							href={link.href as Route}
							prefetch
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
