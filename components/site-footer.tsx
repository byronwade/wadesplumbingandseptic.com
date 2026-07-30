import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"

import { CompanyLogo } from "@/components/company-logos"
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
		href: "/service-offerings/engineered-septic-system-installation",
		label: "Engineered Septic Systems",
	},
]

const socialLinks = [
	{ href: siteConfig.social.facebook, label: "Facebook", logo: "facebook" },
	{ href: siteConfig.social.linkedin, label: "LinkedIn", logo: "linkedin" },
	{ href: siteConfig.social.instagram, label: "Instagram", logo: "instagram" },
] as const

export function SiteFooter() {
	return (
		<footer className="bg-ink text-white">
			{/*
			  No Call strip here. Page-level ContactCta / conversion bands already
			  offer Call + hours; stacking another dial bar on the footer reads as
			  two identical CTAs back-to-back.
			*/}
			<div className="container-shell py-[var(--space-section-y-tight)]">
				<div className="grid gap-[var(--space-block)] sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
					<div>
						<Link
							aria-label="Wade's Plumbing & Septic home"
							className="flex items-center gap-3"
							href="/"
							prefetch
						>
							<Image
								alt="Wade's Plumbing & Septic logo"
								className="size-11 shrink-0 rounded-md"
								height={44}
								src="/images/brand/wades-mark-sm.webp"
								width={44}
							/>
							<span>
								<span className="font-display block text-lg leading-tight font-extrabold tracking-[-0.03em]">
									Wade&apos;s Plumbing
								</span>
								<span className="text-primary-bright mt-1 block font-mono text-[0.625rem] leading-none font-semibold tracking-[0.2em] uppercase">
									&amp; Septic
								</span>
							</span>
						</Link>
						<p className="text-on-dark-muted mt-5 max-w-xs text-sm leading-relaxed">
							Family-owned plumbing and septic specialists. Honest
							recommendations, clear pricing, and quality workmanship.
						</p>
						<p className="text-on-dark-muted mt-4 max-w-xs text-sm leading-relaxed">
							{siteConfig.address.display}
						</p>
						<p className="text-on-dark-subtle mt-4 font-mono text-xs tracking-[0.06em]">
							{siteConfig.licenses}
						</p>
						<div className="mt-6 flex gap-2">
							{socialLinks.map((item) => (
								<a
									aria-label={item.label}
									className="focus-visible:ring-ring grid size-10 place-items-center rounded-md bg-white/8 opacity-80 transition-opacity outline-none hover:opacity-100 focus-visible:ring-2"
									href={item.href}
									key={item.label}
									rel="noopener noreferrer"
									target="_blank"
								>
									<CompanyLogo className="size-5" name={item.logo} />
								</a>
							))}
						</div>
					</div>

					<FooterColumn links={serviceLinks} title="Services" />
					<FooterColumn links={companyNavigation} title="Company" />
					<FooterColumn links={resourceNavigation} title="Resources" />
				</div>

				<div className="text-on-dark-subtle mt-[var(--space-block)] flex flex-col gap-4 border-t border-white/10 pt-7 text-xs sm:flex-row sm:items-center sm:justify-between">
					<p>© 2026 Wade&apos;s Plumbing &amp; Septic. All rights reserved.</p>
					<div className="flex flex-wrap gap-x-6 gap-y-2">
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

			<div className="footer-credit relative overflow-hidden">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_120%_at_50%_-20%,color-mix(in_srgb,var(--primary)_28%,transparent),transparent_55%)]"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"
				/>
				<div className="container-shell relative flex flex-col items-center gap-3 py-8 text-center sm:gap-3.5 sm:py-10">
					<p className="text-primary-bright/90 font-mono text-[0.625rem] font-semibold tracking-[0.22em] uppercase">
						Also a tech company
					</p>
					<p className="max-w-[22rem] text-[0.9375rem] leading-snug text-pretty text-white/78 sm:max-w-lg sm:text-base sm:leading-relaxed">
						Wade&apos;s Plumbing &amp; Septic and Wade&apos;s Inc. were developed
						and designed by{" "}
						<a
							className="font-semibold text-white underline decoration-white/25 underline-offset-[0.2em] transition-colors hover:text-primary-bright hover:decoration-primary-bright/50"
							href="https://byronwade.com"
							rel="noopener noreferrer"
							target="_blank"
						>
							Byron Wade
						</a>
					</p>
					<p className="flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.08em] text-white/45">
						<span>Made with 🩷</span>
						<span aria-hidden="true" className="text-white/20">
							·
						</span>
						<a
							className="transition-colors hover:text-white"
							href="https://byronwade.com"
							rel="noopener noreferrer"
							target="_blank"
						>
							byronwade.com
						</a>
					</p>
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
			<h2 className="spec-label text-primary-bright">{title}</h2>
			<ul className="text-on-dark-muted mt-5 space-y-1 text-sm">
				{links.map((link) => (
					<li key={link.href}>
						<Link
							className="hover:text-primary-bright inline-flex min-h-6 items-center py-1 transition-colors"
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
