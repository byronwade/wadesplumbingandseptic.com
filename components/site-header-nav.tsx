"use client"

import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
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
	type LucideIcon,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
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
import { Separator } from "@/components/ui/separator"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import {
	companyNavLinks,
	midNavLinks,
	serviceMegaHighlights,
	serviceNavLinks,
	type MegaNavItem,
	type NavLink,
} from "@/lib/navigation"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

const megaIcons: Record<MegaNavItem["icon"], LucideIcon> = {
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
					className="focus-visible:ring-ring group flex items-start gap-3 rounded-md p-3 transition-colors outline-none hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
					href={href as Route}
					prefetch
				>
					<span className="bg-ink-soft text-primary-bright mt-0.5 grid size-9 shrink-0 place-items-center rounded-md shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
						<Icon className="size-4" aria-hidden="true" />
					</span>
					<span className="min-w-0">
						<span className="group-hover:text-primary-bright block text-sm font-extrabold tracking-[-0.01em] text-white">
							{label}
						</span>
						{description ? (
							<span className="header-muted mt-1 block text-sm leading-snug">
								{description}
							</span>
						) : null}
					</span>
				</Link>
			</NavigationMenuLink>
		</li>
	)
}

function MobileNavLink({ href, label, description }: NavLink) {
	return (
		<SheetClose asChild>
			<Link
				className="hover:bg-muted focus-visible:ring-ring block rounded-md px-3 py-3 transition-colors outline-none focus-visible:ring-2"
				href={href as Route}
				prefetch
			>
				<span className="text-foreground block text-base font-extrabold tracking-[-0.02em]">
					{label}
				</span>
				{description ? (
					<span className="text-muted-foreground mt-0.5 block text-sm">
						{description}
					</span>
				) : null}
			</Link>
		</SheetClose>
	)
}

function ServicesMegaMenu() {
	return (
		<div className="w-full">
			<div className="container-shell grid gap-8 py-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.45fr)_minmax(0,0.95fr)] lg:gap-10 lg:py-8">
				{/* Brand column — soft copper wash on the same ink as the header */}
				<div className="relative overflow-hidden rounded-lg p-6 sm:p-7">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0"
						style={{
							background: `
								radial-gradient(ellipse 90% 80% at 0% 0%, color-mix(in srgb, var(--primary) 28%, transparent), transparent 65%),
								linear-gradient(165deg, var(--ink-soft) 0%, transparent 70%)
							`,
						}}
					/>
					<div className="relative">
						<p className="text-primary-bright text-xs font-extrabold tracking-[0.16em] uppercase">
							Local specialists
						</p>
						<h3 className="mt-3 text-2xl font-extrabold tracking-[-0.03em] text-white">
							Plumbing &amp; septic done right the first time
						</h3>
						<p className="header-muted mt-3 text-sm leading-relaxed">
							From drain diagnostics to engineered septic work — clear options,
							licensed crews, and service across Santa Cruz County.
						</p>
						<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
							<a
								className={cn(buttonVariants({ size: "lg" }), "gap-2")}
								href={siteConfig.phoneHref}
							>
								<Phone className="size-4" aria-hidden="true" />
								Call {siteConfig.phone}
							</a>
							<Link
								className={cn(
									buttonVariants({ variant: "inverse", size: "lg" }),
									"gap-2",
								)}
								href={"/services" as Route}
								prefetch
							>
								Browse all services
								<ArrowRight className="size-4" aria-hidden="true" />
							</Link>
						</div>
					</div>
				</div>

				<div>
					<p className="text-primary-bright mb-3 text-xs font-extrabold tracking-[0.16em] uppercase">
						Service categories
					</p>
					<ul className="grid gap-1 sm:grid-cols-2">
						{serviceNavLinks.map((item) => (
							<MegaLink key={item.href} {...item} />
						))}
					</ul>
				</div>

				<div className="lg:border-l lg:border-white/10 lg:pl-8">
					<p className="text-primary-bright mb-3 text-xs font-extrabold tracking-[0.16em] uppercase">
						Popular right now
					</p>
					<ul className="space-y-1">
						{serviceMegaHighlights.map((item) => (
							<li key={item.href}>
								<NavigationMenuLink asChild>
									<Link
										className="focus-visible:ring-ring group block rounded-md p-3 transition-colors outline-none hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
										href={item.href as Route}
										prefetch
									>
										<span className="group-hover:text-primary-bright flex items-center justify-between gap-3 text-sm font-extrabold tracking-[-0.01em] text-white">
											{item.label}
											<ArrowRight
												className="header-muted size-4 opacity-0 transition group-hover:opacity-100"
												aria-hidden="true"
											/>
										</span>
										<span className="header-muted mt-1 block text-sm leading-snug">
											{item.description}
										</span>
									</Link>
								</NavigationMenuLink>
							</li>
						))}
					</ul>
					<p className="header-muted mt-5 text-xs font-bold">
						{siteConfig.licenses} · {siteConfig.hours}
					</p>
				</div>
			</div>
		</div>
	)
}

function CompanyMegaMenu() {
	return (
		<div className="w-full">
			<div className="container-shell grid gap-8 py-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-12 lg:py-8">
				<div className="overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
					<div className="relative aspect-[16/10] min-h-48">
						<Image
							alt="Coastal redwoods in Wade's Santa Cruz County service area"
							className="object-cover"
							fill
							sizes="(min-width: 1024px) 28rem, 100vw"
							src="/images/locations/santa-cruz-redwoods.webp"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
						<div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
							<p className="text-primary-bright text-xs font-extrabold tracking-[0.16em] uppercase">
								Family-owned · Local
							</p>
							<p className="mt-2 max-w-sm text-lg font-extrabold tracking-[-0.02em] text-white">
								Trusted plumbing &amp; septic for Santa Cruz County homes and
								businesses.
							</p>
						</div>
					</div>
					<div className="bg-ink-soft flex flex-wrap gap-x-5 gap-y-2 px-5 py-4 text-sm font-bold text-white">
						<span className="inline-flex items-center gap-2">
							<BadgeCheck
								className="text-primary-bright size-4"
								aria-hidden="true"
							/>
							{siteConfig.licenses}
						</span>
						<span className="header-muted inline-flex items-center gap-2">
							<Phone className="size-4" aria-hidden="true" />
							{siteConfig.phone}
						</span>
					</div>
				</div>

				<div>
					<p className="text-primary-bright mb-3 text-xs font-extrabold tracking-[0.16em] uppercase">
						Company
					</p>
					<ul className="grid gap-1 sm:grid-cols-2">
						{companyNavLinks.map((item) => (
							<MegaLink key={item.href} {...item} />
						))}
					</ul>
					<div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
						<a
							className={cn(buttonVariants({ size: "lg" }), "gap-2")}
							href={siteConfig.phoneHref}
						>
							<Phone className="size-4" aria-hidden="true" />
							Call {siteConfig.phone}
						</a>
						<Link
							className={cn(
								buttonVariants({ variant: "inverse", size: "lg" }),
								"gap-2",
							)}
							href={"/contact" as Route}
							prefetch
						>
							Get a free quote
							<ArrowRight className="size-4" aria-hidden="true" />
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

export function SiteHeaderNav() {
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
				<Button asChild size="lg">
					<a className="gap-2" href={siteConfig.phoneHref}>
						<Phone aria-hidden="true" />
						{siteConfig.phone}
					</a>
				</Button>
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
				<Button
					asChild
					variant="ghost"
					size="icon"
					className="hover:text-primary-bright focus-visible:ring-offset-ink text-white hover:bg-transparent sm:hidden"
				>
					<a
						href={siteConfig.phoneHref}
						aria-label={`Call ${siteConfig.phone}`}
					>
						<Phone aria-hidden="true" className="size-5" />
					</a>
				</Button>
				<Sheet>
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="hover:text-primary-bright focus-visible:ring-offset-ink text-white hover:bg-transparent"
							aria-label="Open main menu"
						>
							<Menu aria-hidden="true" className="size-5" />
						</Button>
					</SheetTrigger>
					<SheetContent side="right" className="bg-card">
						<SheetHeader className="shadow-[inset_0_-1px_0_0_var(--border)]">
							<div className="flex items-center gap-3">
								<Image
									alt="Wade's Plumbing & Septic logo"
									className="size-10 rounded-md"
									height={40}
									src="/images/brand/wades-mark-sm.webp"
									width={40}
								/>
								<div>
									<SheetTitle>Wade&apos;s Plumbing &amp; Septic</SheetTitle>
									<SheetDescription>Menu · {siteConfig.hours}</SheetDescription>
								</div>
							</div>
						</SheetHeader>

						<nav
							className="flex-1 overflow-y-auto px-2 py-3"
							aria-label="Mobile navigation"
						>
							<MobileNavLink href="/" label="Home" />

							<Separator className="my-3" />

							<p className="text-muted-foreground px-3 pb-1 text-xs font-extrabold tracking-[0.14em] uppercase">
								Services
							</p>
							{serviceNavLinks.map((item) => (
								<MobileNavLink key={item.href} {...item} />
							))}

							<Separator className="my-3" />

							{midNavLinks.map((item) => (
								<MobileNavLink key={item.href} {...item} />
							))}

							<Separator className="my-3" />

							<p className="text-muted-foreground px-3 pb-1 text-xs font-extrabold tracking-[0.14em] uppercase">
								Company
							</p>
							{companyNavLinks.map((item) => (
								<MobileNavLink key={item.href} {...item} />
							))}
						</nav>

						<SheetFooter>
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
			</div>
		</>
	)
}
