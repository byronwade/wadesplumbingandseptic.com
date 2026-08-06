"use client"

import type { Route } from "next"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
	ArrowRight,
	BadgeCheck,
	Briefcase,
	Building2,
	CircleHelp,
	Droplets,
	Menu,
	Phone,
	Search,
	ShieldCheck,
	Siren,
	Star,
	Users,
	Wallet,
	Wrench,
	type IconComponent,
} from "@/components/icons"

import { CallButton, CallIconButton } from "@/components/call-button"
import { Button, buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import { openGlobalSearch } from "@/lib/search-events"
import { prefetchSearchIndex } from "@/lib/search-client"
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
	companyNavLinks,
	midNavLinks,
	serviceMegaHighlights,
	serviceNavLinks,
	type MegaNavItem,
} from "@/lib/navigation"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

const SiteHeaderMobileMenu = dynamic(
	() =>
		import("@/components/site-header-mobile-menu").then(
			(mod) => mod.SiteHeaderMobileMenu,
		),
	{ ssr: false },
)

const megaIcons: Record<MegaNavItem["icon"], IconComponent> = {
	wrench: Wrench,
	droplets: Droplets,
	building: Building2,
	siren: Siren,
	users: Users,
	star: Star,
	briefcase: Briefcase,
	phone: Phone,
	badge: BadgeCheck,
	wallet: Wallet,
	shield: ShieldCheck,
	help: CircleHelp,
}

const triggerClassName =
	"hover:text-primary-bright focus:text-primary-bright data-[active]:text-primary-bright data-[state=open]:text-primary-bright bg-transparent text-white hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent"

function MegaLink({ href, label, description, icon }: MegaNavItem) {
	const Icon = megaIcons[icon]

	return (
		<li>
			<NavigationMenuLink asChild>
				<Link
					className="focus-visible:ring-ring group relative flex items-start gap-3.5 rounded-lg p-3 transition-colors outline-none hover:bg-white/[0.05] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]"
					href={href as Route}
					prefetch
				>
					<span className="surface-raised text-primary-bright grid size-9 shrink-0 place-items-center rounded-md transition-colors group-hover:bg-[color-mix(in_srgb,var(--primary)_30%,var(--dark-3))]">
						<Icon className="size-[1.125rem]" aria-hidden="true" />
					</span>
					<span className="min-w-0">
						<span className="group-hover:text-primary-bright block text-sm font-bold tracking-[-0.01em] text-white transition-colors">
							{label}
						</span>
						{description ? (
							<span className="text-on-dark-subtle mt-1 block text-[0.8125rem] leading-snug">
								{description}
							</span>
						) : null}
					</span>
				</Link>
			</NavigationMenuLink>
		</li>
	)
}

/* Shared footer bar. Credentials on the left, the two actions on the right, so
   both menus resolve the same way instead of each inventing its own CTA block. */
function MegaFooter({
	action,
	actionLabel,
}: {
	action: Route
	actionLabel: string
}) {
	return (
		<div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
			<p className="text-on-dark-subtle flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.6875rem] tracking-[0.08em] uppercase">
				<span className="inline-flex items-center gap-2">
					<BadgeCheck
						aria-hidden="true"
						className="text-primary-bright size-4"
					/>
					{siteConfig.licenses}
				</span>
				<span>{siteConfig.hours}</span>
			</p>
			<div className="flex shrink-0 items-center gap-2">
				<CallButton desktopLabel={contactInfo.phoneDisplay} size="sm" />
				<NavigationMenuLink asChild>
					<Link
						className={buttonVariants({ variant: "inverse", size: "sm" })}
						href={action}
						prefetch
					>
						{actionLabel}
						<ArrowRight aria-hidden="true" />
					</Link>
				</NavigationMenuLink>
			</div>
		</div>
	)
}

/*
 * Two columns instead of three, and no marketing tile. The old middle column of
 * links was squeezed between a big pitch block and a highlights rail, which left
 * every column too narrow to read. Categories now get the room, highlights sit
 * in their own sunken well, and the CTAs move to a shared footer bar.
 */
function ServicesMegaMenu() {
	return (
		<div className="container-shell py-7 lg:py-8">
			<div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-10">
				<div>
					<p className="spec-label mb-3">Service categories</p>
					<ul className="grid gap-0.5 sm:grid-cols-2">
						{serviceNavLinks.map((item) => (
							<MegaLink key={item.href} {...item} />
						))}
					</ul>
				</div>

				<div className="rounded-lg bg-black/20 p-3 lg:p-4">
					<p className="spec-label mb-3 px-1">Popular right now</p>
					<ul className="space-y-0.5">
						{serviceMegaHighlights.map((item) => (
							<li key={item.href}>
								<NavigationMenuLink asChild>
									<Link
										className="focus-visible:ring-ring group block rounded-md p-2.5 transition-colors outline-none hover:bg-white/[0.05] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]"
										href={item.href as Route}
										prefetch
									>
										<span className="group-hover:text-primary-bright flex items-center justify-between gap-3 text-sm font-bold tracking-[-0.01em] text-white transition-colors">
											{item.label}
											<ArrowRight
												aria-hidden="true"
												className="text-primary-bright size-4 shrink-0 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
											/>
										</span>
										<span className="text-on-dark-subtle mt-1 block text-[0.8125rem] leading-snug">
											{item.description}
										</span>
									</Link>
								</NavigationMenuLink>
							</li>
						))}
					</ul>
				</div>
			</div>

			<MegaFooter action={"/services" as Route} actionLabel="All services" />
		</div>
	)
}

function CompanyMegaMenu() {
	return (
		<div className="container-shell py-7 lg:py-8">
			<div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-10">
				<div>
					<p className="spec-label mb-3">Company</p>
					<ul className="grid gap-0.5 sm:grid-cols-2">
						{companyNavLinks.map((item) => (
							<MegaLink key={item.href} {...item} />
						))}
					</ul>
				</div>

				{/* Place image. items-stretch plus h-full so it fills the link column
				    instead of leaving a band of empty tile under its caption. */}
				<NavigationMenuLink asChild>
					<Link
						className="focus-visible:ring-ring group surface-raised relative block overflow-hidden rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]"
						href={"/service-areas" as Route}
						prefetch
					>
						<div className="relative aspect-16/10 lg:aspect-auto lg:h-full lg:min-h-56">
							<Image
								alt="Coastal redwoods in Wade's Santa Cruz County service area"
								className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
								fill
								sizes="(min-width: 1024px) 24rem, 100vw"
								src="/images/locations/santa-cruz-redwoods.webp"
							/>
							<div className="from-dark-3 via-dark-3/55 absolute inset-0 bg-linear-to-t to-transparent" />
							<div className="absolute inset-x-0 bottom-0 p-4">
								<p className="spec-label">Where we work</p>
								<p className="mt-2 flex items-center gap-2 text-[0.9375rem] font-bold tracking-[-0.02em] text-white">
									Santa Cruz County and the foothills
									<ArrowRight
										aria-hidden="true"
										className="text-primary-bright size-4 shrink-0 transition-transform group-hover:translate-x-1"
									/>
								</p>
							</div>
						</div>
					</Link>
				</NavigationMenuLink>
			</div>

			<MegaFooter action={"/contact" as Route} actionLabel="Get a free quote" />
		</div>
	)
}

export function SiteHeaderNav() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [mobileMenuReady, setMobileMenuReady] = useState(false)

	const openMobileMenu = () => {
		setMobileMenuReady(true)
		setMobileMenuOpen(true)
	}

	return (
		<>
			<NavigationMenu
				className="static hidden max-w-none flex-1 justify-center lg:flex"
				aria-label="Primary navigation"
			>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink asChild>
							<Link
								className={cn(navigationMenuTriggerStyle(), triggerClassName)}
								href={"/" as Route}
								prefetch
							>
								Home
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>

					<NavigationMenuItem>
						<NavigationMenuTrigger className={triggerClassName}>
							Services
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ServicesMegaMenu />
						</NavigationMenuContent>
					</NavigationMenuItem>

					{midNavLinks.map((item) => (
						<NavigationMenuItem key={item.href}>
							<NavigationMenuLink asChild>
								<Link
									className={cn(navigationMenuTriggerStyle(), triggerClassName)}
									href={item.href as Route}
									prefetch
								>
									{item.label}
								</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
					))}

					<NavigationMenuItem>
						<NavigationMenuTrigger className={triggerClassName}>
							Company
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<CompanyMegaMenu />
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>

			<div className="hidden items-center gap-2 sm:flex">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="hover:text-primary-bright focus-visible:ring-offset-ink text-white hover:bg-transparent"
					aria-label="Search services, tips, and pages"
					onMouseEnter={() => void prefetchSearchIndex()}
					onFocus={() => void prefetchSearchIndex()}
					onClick={openGlobalSearch}
				>
					<Search aria-hidden="true" className="size-5" />
				</Button>
				<CallButton
					className="gap-2"
					desktopLabel={contactInfo.phoneDisplay}
					size="lg"
				/>
			</div>

			<div className="flex items-center lg:hidden">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="hover:text-primary-bright focus-visible:ring-offset-ink text-white hover:bg-transparent sm:hidden"
					aria-label="Search services, tips, and pages"
					onMouseEnter={() => void prefetchSearchIndex()}
					onFocus={() => void prefetchSearchIndex()}
					onClick={openGlobalSearch}
				>
					<Search aria-hidden="true" className="size-5" />
				</Button>
				<CallIconButton className="hover:text-primary-bright focus-visible:ring-offset-ink inline-flex size-11 items-center justify-center rounded-md text-white hover:bg-transparent sm:hidden" />
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="hover:text-primary-bright focus-visible:ring-offset-ink text-white hover:bg-transparent"
					aria-label="Open main menu"
					onClick={openMobileMenu}
				>
					<Menu aria-hidden="true" className="size-5" />
				</Button>
				{mobileMenuReady ? (
					<SiteHeaderMobileMenu
						open={mobileMenuOpen}
						onOpenChange={setMobileMenuOpen}
					/>
				) : null}
			</div>
		</>
	)
}
