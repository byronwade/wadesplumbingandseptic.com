import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"

import { CallButton } from "@/components/call-button"
import { CompanyLogo } from "@/components/company-logos"
import { ProtectedPhoneText } from "@/components/protected-contact"
import { VirtualBusinessCard } from "@/components/virtual-business-card"
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
			<div className="bg-primary shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.18)]">
				<div className="container-shell flex flex-col items-center justify-between gap-4 py-6 text-center sm:flex-row sm:text-left">
					<div>
						<p className="font-mono text-[0.6875rem] font-semibold tracking-[0.14em] text-white/80 uppercase">
							{siteConfig.hours}
						</p>
						<p className="type-subtitle mt-1 text-white">
							<ProtectedPhoneText className="text-inherit hover:text-white" />
						</p>
					</div>
					{/*
					  Explicit ink text on the white plate. This used to inherit
					  text-foreground, which in dark mode resolves to near-white - an
					  invisible label on a white button.
					*/}
					<CallButton
						className="text-ink w-full bg-white hover:bg-white/90 sm:w-auto"
						desktopLabel="Call now"
						mobileLabel="Save contact"
						size="lg"
						variant="secondary"
					/>
				</div>
			</div>

			<div className="container-shell py-[var(--space-section-y-tight)]">
				<div className="mb-[var(--space-block)]">
					<VirtualBusinessCard id="footer-business-card" tone="dark" />
				</div>

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
			<ul className="text-on-dark-muted mt-5 space-y-3 text-sm">
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
