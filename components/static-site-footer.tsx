import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"

import { CompanyLogo } from "@/components/company-logos"
import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
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
		href: "/service-offerings/engineered-septic-system-installation",
		label: "Engineered Septic Systems",
	},
]

const socialLinks = [
	{ href: siteConfig.social.facebook, label: "Facebook", logo: "facebook" },
	{ href: siteConfig.social.linkedin, label: "LinkedIn", logo: "linkedin" },
	{ href: siteConfig.social.instagram, label: "Instagram", logo: "instagram" },
] as const

/** Server-only footer for the homepage LCP path (no CallButton / protected-contact islands). */
export function StaticSiteFooter() {
	return (
		<footer className="bg-ink text-white">
			<div className="bg-primary shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.18)]">
				<div className="container-shell flex flex-col items-center justify-between gap-4 py-6 text-center sm:flex-row sm:text-left">
					<div>
						<p className="font-mono text-[0.6875rem] font-semibold tracking-[0.14em] text-white/80 uppercase">
							{siteConfig.hours}
						</p>
						<p className="type-subtitle mt-1 text-white">
							<a
								aria-label={`Call ${contactInfo.phoneDisplay}`}
								className="hover:text-white inline-flex min-h-11 items-center text-inherit"
								href={contactInfo.phoneHref}
							>
								{contactInfo.phoneDisplay}
							</a>
						</p>
					</div>
					<div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:items-end">
						<a
							className={cn(
								buttonVariants({ variant: "inverse", size: "lg" }),
								"bg-white text-ink hover:bg-white/90 inline-flex w-full gap-2 sm:w-auto",
							)}
							href={contactInfo.phoneHref}
						>
							Call {contactInfo.phoneDisplay}
						</a>
						<a
							className="text-center text-sm font-bold text-white/85 underline-offset-2 hover:text-white hover:underline sm:text-right"
							href={contactInfo.vcardPath}
						>
							Save to contacts
						</a>
					</div>
				</div>
			</div>

			<div className="container-shell grid gap-10 py-12 md:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]">
				<div>
					<Link className="inline-flex items-center gap-3" href="/" prefetch>
						<Image
							alt=""
							className="size-11 rounded-md"
							height={44}
							src="/images/brand/wades-mark-sm.webp"
							width={44}
						/>
						<span className="font-display text-lg font-extrabold tracking-[-0.03em]">
							Wade&apos;s Plumbing &amp; Septic
						</span>
					</Link>
					<p className="text-on-dark-muted mt-4 max-w-sm text-sm leading-relaxed">
						{siteConfig.description}
					</p>
					<div className="mt-5 flex gap-3">
						{socialLinks.map((social) => (
							<a
								aria-label={social.label}
								className="focus-visible:ring-ring grid size-11 place-items-center rounded-md bg-white/8 opacity-80 transition-opacity outline-none hover:opacity-100 focus-visible:ring-2"
								href={social.href}
								key={social.label}
								rel="noopener noreferrer"
								target="_blank"
							>
								<CompanyLogo name={social.logo} className="size-5" />
							</a>
						))}
					</div>
				</div>

				<div>
					<p className="spec-label text-primary-bright">Services</p>
					<ul className="mt-4 space-y-1">
						{serviceLinks.map((link) => (
							<li key={link.href}>
								<Link
									className="hover:text-primary-bright inline-flex min-h-11 items-center py-1 text-sm text-white/85 transition-colors"
									href={link.href as Route}
									prefetch
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>

				<div>
					<p className="spec-label text-primary-bright">Company</p>
					<ul className="mt-4 space-y-1">
						{companyNavigation.map((link) => (
							<li key={link.href}>
								<Link
									className="hover:text-primary-bright inline-flex min-h-11 items-center py-1 text-sm text-white/85 transition-colors"
									href={link.href as Route}
									prefetch
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>

				<div>
					<p className="spec-label text-primary-bright">Resources</p>
					<ul className="mt-4 space-y-1">
						{resourceNavigation.map((link) => (
							<li key={link.href}>
								<Link
									className="hover:text-primary-bright inline-flex min-h-11 items-center py-1 text-sm text-white/85 transition-colors"
									href={link.href as Route}
									prefetch
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>

			<div className="border-t border-white/10">
				<div className="container-shell text-on-dark-subtle flex flex-col gap-2 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
					<p>
						© {siteConfig.name}. All rights reserved.
					</p>
					<p>{siteConfig.licenses}</p>
				</div>
			</div>
		</footer>
	)
}
