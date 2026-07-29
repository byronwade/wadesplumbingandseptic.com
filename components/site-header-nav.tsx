"use client"

import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { Menu, Phone, Search } from "lucide-react"

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
	serviceNavLinks,
	type NavLink,
} from "@/lib/navigation"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

function ListItem({ href, label, description }: NavLink) {
	return (
		<li>
			<NavigationMenuLink asChild>
				<Link
					className="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring block rounded-md px-4 py-3.5 transition-colors outline-none focus-visible:ring-2"
					href={href as Route}
					prefetch
				>
					<span className="text-foreground text-base font-extrabold tracking-[-0.02em]">
						{label}
					</span>
					{description ? (
						<span className="text-muted-foreground mt-1.5 block text-sm leading-relaxed">
							{description}
						</span>
					) : null}
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

export function SiteHeaderNav() {
	return (
		<>
			<NavigationMenu
				className="hidden lg:flex"
				aria-label="Primary navigation"
			>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink asChild>
							<Link
								className={cn(
									navigationMenuTriggerStyle(),
									"hover:text-primary-bright focus:text-primary-bright data-[active]:text-primary-bright bg-transparent text-white hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent",
								)}
								href={"/" as Route}
								prefetch
							>
								Home
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>

					<NavigationMenuItem>
						<NavigationMenuTrigger className="hover:text-primary-bright focus:text-primary-bright data-[state=open]:text-primary-bright bg-transparent text-white hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
							Services
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid w-[min(40rem,calc(100vw-2rem))] gap-2 p-4 md:w-[40rem] md:grid-cols-2">
								{serviceNavLinks.map((item) => (
									<ListItem key={item.href} {...item} />
								))}
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>

					{midNavLinks.map((item) => (
						<NavigationMenuItem key={item.href}>
							<NavigationMenuLink asChild>
								<Link
									className={cn(
										navigationMenuTriggerStyle(),
										"hover:text-primary-bright focus:text-primary-bright data-[active]:text-primary-bright bg-transparent text-white hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent",
									)}
									href={item.href as Route}
									prefetch
								>
									{item.label}
								</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
					))}

					<NavigationMenuItem>
						<NavigationMenuTrigger className="hover:text-primary-bright focus:text-primary-bright data-[state=open]:text-primary-bright bg-transparent text-white hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
							Company
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid w-[min(26rem,calc(100vw-2rem))] gap-2 p-4 md:w-[26rem]">
								{companyNavLinks.map((item) => (
									<ListItem key={item.href} {...item} />
								))}
							</ul>
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
