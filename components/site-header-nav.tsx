"use client"

import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { Menu, Phone } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
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
	primaryNavLinks,
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
					className="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring block rounded-md p-3 transition-colors outline-none focus-visible:ring-2"
					href={href as Route}
					prefetch
				>
					<span className="text-foreground text-sm font-extrabold tracking-[-0.01em]">
						{label}
					</span>
					{description ? (
						<span className="text-muted-foreground mt-1 block text-sm leading-snug">
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
					{primaryNavLinks.map((item) => (
						<NavigationMenuItem key={item.href}>
							<NavigationMenuLink asChild>
								<Link
									className={cn(
										navigationMenuTriggerStyle(),
										"bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[active]:bg-white/10",
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
						<NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[state=open]:bg-white/12 data-[state=open]:text-white">
							Services
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid w-[22rem] gap-1 p-3 md:w-[28rem] md:grid-cols-2">
								{serviceNavLinks.map((item) => (
									<ListItem key={item.href} {...item} />
								))}
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>

					<NavigationMenuItem>
						<NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[state=open]:bg-white/12 data-[state=open]:text-white">
							Company
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid w-[20rem] gap-1 p-3">
								{companyNavLinks.map((item) => (
									<ListItem key={item.href} {...item} />
								))}
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>

			<div className="hidden items-center gap-3 sm:flex">
				<Button asChild size="lg">
					<a className="gap-2" href={siteConfig.phoneHref}>
						<Phone aria-hidden="true" />
						{siteConfig.phone}
					</a>
				</Button>
			</div>

			<Sheet>
				<SheetTrigger asChild>
					<Button
						variant="inverse"
						size="icon"
						className="lg:hidden"
						aria-label="Open main menu"
					>
						<Menu aria-hidden="true" />
					</Button>
				</SheetTrigger>
				<SheetContent side="right" className="bg-card">
					<SheetHeader className="border-border border-b">
						<div className="flex items-center gap-3">
							<span className="border-border grid size-10 place-items-center rounded-md border bg-white p-1">
								<Image
									alt=""
									height={36}
									src="/images/brand/wades-mark.webp"
									width={36}
								/>
							</span>
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
						<p className="text-muted-foreground px-3 pb-1 text-xs font-extrabold tracking-[0.14em] uppercase">
							Explore
						</p>
						{primaryNavLinks.map((item) => (
							<MobileNavLink key={item.href} {...item} />
						))}

						<Separator className="my-3" />

						<p className="text-muted-foreground px-3 pb-1 text-xs font-extrabold tracking-[0.14em] uppercase">
							Services
						</p>
						{serviceNavLinks.map((item) => (
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
		</>
	)
}
