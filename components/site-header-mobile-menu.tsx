"use client"

import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"

import { Phone } from "@/components/icons"
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
	serviceNavLinks,
	type NavLink,
} from "@/lib/navigation"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

function MobileNavLink({ href, label, description }: NavLink) {
	return (
		<SheetClose asChild>
			<Link
				className="hover:bg-muted focus-visible:ring-ring block rounded-md px-3 py-3 transition-colors outline-none focus-visible:ring-2"
				href={href as Route}
				prefetch
			>
				<span className="text-foreground block text-base font-bold tracking-[-0.02em]">
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

export function SiteHeaderMobileMenu({
	open,
	onOpenChange,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
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

					<p className="spec-tag px-3 pb-2">Services</p>
					{serviceNavLinks.map((item) => (
						<MobileNavLink key={item.href} {...item} />
					))}

					<Separator className="my-3" />

					{midNavLinks.map((item) => (
						<MobileNavLink key={item.href} {...item} />
					))}

					<Separator className="my-3" />

					<p className="spec-tag px-3 pb-2">Company</p>
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
	)
}
