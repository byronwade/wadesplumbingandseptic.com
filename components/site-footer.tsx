import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { Phone } from "lucide-react"

import { companyNavigation, resourceNavigation, siteConfig } from "@/lib/site"

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
		<footer className="bg-[#0b0b0b] text-white">
			<div className="bg-primary border-b border-white/10">
				<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-center sm:flex-row sm:text-left md:px-8">
					<div>
						<p className="text-sm font-bold text-white/80">
							24/7 Emergency Service
						</p>
						<p className="text-2xl font-black">{siteConfig.phone}</p>
					</div>
					<a
						className="inline-flex h-12 items-center gap-2 rounded-lg bg-white px-6 font-black text-neutral-950 hover:bg-neutral-100"
						href={siteConfig.phoneHref}
					>
						<Phone className="size-4" aria-hidden="true" />
						Call Now
					</a>
				</div>
			</div>

			<div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
				<div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
					<div>
						<Link
							className="flex items-center gap-3 text-xl font-black"
							href="/"
						>
							<span className="grid size-14 place-items-center rounded-xl bg-white p-1.5">
								<Image
									alt=""
									height={48}
									src="/images/brand/wades-mark.webp"
									width={48}
								/>
							</span>
							<span>Wade&apos;s Plumbing &amp; Septic</span>
						</Link>
						<p className="mt-4 text-sm leading-relaxed text-neutral-400">
							Family-owned plumbing and septic specialists. Honest
							recommendations, clear pricing, and quality workmanship.
						</p>
						<p className="mt-4 text-xs font-semibold text-neutral-400">
							{siteConfig.licenses}
						</p>
						<div className="mt-5 flex gap-3">
							<a
								className="grid size-10 place-items-center rounded-lg border border-white/10 text-neutral-400 hover:text-white"
								href={siteConfig.social.facebook}
								aria-label="Facebook"
							>
								<span className="text-sm font-black" aria-hidden="true">
									f
								</span>
							</a>
							<a
								className="grid size-10 place-items-center rounded-lg border border-white/10 text-neutral-400 hover:text-white"
								href={siteConfig.social.linkedin}
								aria-label="LinkedIn"
							>
								<span className="text-xs font-black" aria-hidden="true">
									in
								</span>
							</a>
							<a
								className="grid size-10 place-items-center rounded-lg border border-white/10 text-neutral-400 hover:text-white"
								href={siteConfig.social.instagram}
								aria-label="Instagram"
							>
								<span className="text-sm font-black" aria-hidden="true">
									i
								</span>
							</a>
						</div>
					</div>

					<FooterColumn title="Services" links={serviceLinks} />
					<FooterColumn title="Company" links={companyNavigation} />
					<FooterColumn title="Resources" links={resourceNavigation} />
				</div>

				<div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
					<p>© 2026 Wade&apos;s Plumbing &amp; Septic. All rights reserved.</p>
					<div className="flex gap-5">
						<Link className="hover:text-white" href="/privacy-policy">
							Privacy Policy
						</Link>
						<Link className="hover:text-white" href="/terms-of-service">
							Terms
						</Link>
						<Link className="hover:text-white" href="/sitemap.xml">
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
			<h2 className="text-sm font-black tracking-wider uppercase">{title}</h2>
			<ul className="mt-4 space-y-3 text-sm text-neutral-400">
				{links.map((link) => (
					<li key={link.href}>
						<Link
							className="hover:text-primary transition-colors"
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
