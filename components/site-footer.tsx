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
			<div className="border-b border-white/10 bg-primary">
				<div className="container-shell flex flex-col items-center justify-between gap-4 py-6 text-center sm:flex-row sm:text-left">
					<div>
						<p className="text-sm font-bold text-white/80">
							24/7 Emergency Service
						</p>
						<p className="text-2xl font-extrabold tracking-[-0.03em]">
							{siteConfig.phone}
						</p>
					</div>
					<a
						className={cn(
							buttonVariants({ variant: "secondary", size: "lg" }),
							"gap-2 bg-white text-foreground hover:bg-white/90",
						)}
						href={siteConfig.phoneHref}
					>
						<Phone className="size-4" aria-hidden="true" />
						Call Now
					</a>
				</div>
			</div>

			<div className="container-shell py-16">
				<div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
					<div>
						<Link
							className="flex items-center gap-3 text-lg font-extrabold tracking-[-0.03em]"
							href="/"
						>
							<span className="grid size-12 place-items-center rounded-md bg-white p-1.5">
								<Image
									alt=""
									height={40}
									src="/images/brand/wades-mark.webp"
									width={40}
								/>
							</span>
							<span>Wade&apos;s Plumbing &amp; Septic</span>
						</Link>
						<p className="mt-4 text-sm leading-relaxed text-white/60">
							Family-owned plumbing and septic specialists. Honest
							recommendations, clear pricing, and quality workmanship.
						</p>
						<p className="mt-4 text-xs font-semibold text-white/45">
							{siteConfig.licenses}
						</p>
						<div className="mt-5 flex gap-3">
							{[
								{ href: siteConfig.social.facebook, label: "Facebook", mark: "f" },
								{ href: siteConfig.social.linkedin, label: "LinkedIn", mark: "in" },
								{
									href: siteConfig.social.instagram,
									label: "Instagram",
									mark: "i",
								},
							].map((item) => (
								<a
									className="grid size-10 place-items-center rounded-md border border-white/12 text-white/55 transition-colors hover:border-white/30 hover:text-white"
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

				<div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
					<p>© 2026 Wade&apos;s Plumbing &amp; Septic. All rights reserved.</p>
					<div className="flex gap-5">
						<Link className="transition-colors hover:text-white" href="/privacy-policy">
							Privacy Policy
						</Link>
						<Link className="transition-colors hover:text-white" href="/terms-of-service">
							Terms
						</Link>
						<Link className="transition-colors hover:text-white" href="/sitemap.xml">
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
							className="transition-colors hover:text-primary-bright"
							href={link.href as Route}
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
