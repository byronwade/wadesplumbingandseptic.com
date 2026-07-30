"use client"

import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

import { ArrowRight, Phone } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"
import {
	companyNavLinks,
	midNavLinks,
	serviceMegaHighlights,
	serviceNavLinks,
	type NavLink,
} from "@/lib/navigation"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

function MobileNavLink({
	href,
	label,
	description,
	compact = false,
}: NavLink & { compact?: boolean }) {
	return (
		<SheetClose asChild>
			<Link
				className={cn(
					"hover:bg-muted focus-visible:ring-ring block rounded-md px-3 transition-colors outline-none focus-visible:ring-2",
					compact ? "py-2" : "py-2.5",
				)}
				href={href as Route}
				prefetch
			>
				<span
					className={cn(
						"text-foreground block font-bold tracking-[-0.02em]",
						compact ? "text-[0.9375rem]" : "text-base",
					)}
				>
					{label}
				</span>
				{description && !compact ? (
					<span className="text-muted-foreground mt-0.5 block text-sm leading-snug">
						{description}
					</span>
				) : null}
			</Link>
		</SheetClose>
	)
}

function MobileNavSection({
	label,
	children,
}: {
	label: string
	children: ReactNode
}) {
	return (
		<section className="pt-4">
			<p className="spec-tag px-3 pb-1.5">{label}</p>
			{children}
		</section>
	)
}

const mobilePrimaryLinks: NavLink[] = [
	{ href: "/", label: "Home" },
	{ href: "/services", label: "Services" },
	...midNavLinks,
	{ href: "/contact", label: "Contact" },
]

const mobileCompanyLinks = companyNavLinks.filter(
	(item) => item.href !== "/contact",
)

export function SiteHeaderMobileMenu({
	open,
	onOpenChange,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="bg-card gap-0">
				<SheetHeader className="shadow-[inset_0_-1px_0_0_var(--border)]">
					<div className="flex items-center gap-3">
						<Image
							alt="Wade's Plumbing & Septic logo"
							className="size-9 rounded-md"
							height={36}
							src="/images/brand/wades-mark-sm.webp"
							width={36}
						/>
						<div>
							<SheetTitle className="text-base">
								Wade&apos;s Plumbing &amp; Septic
							</SheetTitle>
							<SheetDescription className="text-xs">
								{siteConfig.hours}
							</SheetDescription>
						</div>
					</div>
				</SheetHeader>

				{/*
				  Mobile IA: primary destinations first (same order as desktop),
				  then dense service shortcuts, then the rest of company pages.
				  Descriptions are omitted so the sheet stays scannable.
				*/}
				<nav
					className="flex-1 overflow-y-auto px-2 pb-4"
					aria-label="Mobile navigation"
				>
					<section className="pt-2">
						<p className="spec-tag px-3 pb-1.5">Main</p>
						<ul>
							{mobilePrimaryLinks.map((item) => (
								<li key={item.href}>
									<MobileNavLink compact {...item} />
								</li>
							))}
						</ul>
					</section>

					<Separator className="my-3" />

					<MobileNavSection label="Popular services">
						<ul>
							{serviceMegaHighlights.map((item) => (
								<li key={item.href}>
									<MobileNavLink
										compact
										href={item.href}
										label={item.label}
									/>
								</li>
							))}
							<li>
								<SheetClose asChild>
									<Link
										className="text-primary hover:bg-muted focus-visible:ring-ring flex items-center gap-1.5 rounded-md px-3 py-2 text-[0.9375rem] font-bold outline-none focus-visible:ring-2"
										href={"/services" as Route}
										prefetch
									>
										Browse all services
										<ArrowRight aria-hidden="true" className="size-3.5" />
									</Link>
								</SheetClose>
							</li>
						</ul>
					</MobileNavSection>

					<MobileNavSection label="Service categories">
						<ul className="grid grid-cols-2 gap-x-1">
							{serviceNavLinks
								.filter((item) => item.href !== "/services")
								.map((item) => (
									<li key={item.href}>
										<MobileNavLink
											compact
											href={item.href}
											label={item.label}
										/>
									</li>
								))}
						</ul>
					</MobileNavSection>

					<MobileNavSection label="More">
						<ul className="grid grid-cols-2 gap-x-1">
							{mobileCompanyLinks.map((item) => (
								<li key={item.href}>
									<MobileNavLink compact href={item.href} label={item.label} />
								</li>
							))}
						</ul>
					</MobileNavSection>
				</nav>

				<SheetFooter className="gap-2">
					<a
						className={cn(buttonVariants({ size: "lg" }), "w-full gap-2")}
						href={siteConfig.phoneHref}
					>
						<Phone aria-hidden="true" />
						Call {siteConfig.phone}
					</a>
					<SheetClose asChild>
						<Link
							className={cn(
								buttonVariants({ variant: "outline", size: "lg" }),
								"w-full",
							)}
							href={"/contact" as Route}
							prefetch
						>
							Get a Free Quote
						</Link>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
