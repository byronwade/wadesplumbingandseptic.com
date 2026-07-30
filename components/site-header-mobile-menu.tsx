"use client"

import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

import { ArrowRight } from "@/components/icons"
import { CallButton } from "@/components/call-button"
import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import { Separator } from "@/components/ui/separator"
import {
	Sheet,
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
	onNavigate,
}: NavLink & { compact?: boolean; onNavigate: () => void }) {
	const router = useRouter()

	return (
		<Link
			className={cn(
				"hover:bg-muted focus-visible:ring-ring block rounded-md px-3 transition-colors outline-none focus-visible:ring-2",
				compact ? "py-2" : "py-2.5",
			)}
			href={href as Route}
			prefetch
			onClick={(event) => {
				/*
				  Radix SheetClose + Next Link races the dialog unmount against
				  soft navigation, so many taps close the menu and go nowhere.
				  Close first, then push explicitly.
				*/
				event.preventDefault()
				onNavigate()
				router.push(href as Route)
			}}
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
	const router = useRouter()
	const closeMenu = () => onOpenChange(false)

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			{/*
			  h-dvh + min-h-0 keeps the scroll region between header/footer so
			  lower links are not trapped under the sticky CTA bar.
			*/}
			<SheetContent side="right" className="bg-card h-dvh gap-0 overflow-hidden">
				<SheetHeader className="shrink-0 shadow-[inset_0_-1px_0_0_var(--border)]">
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
					className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-4"
					aria-label="Mobile navigation"
				>
					<section className="pt-2">
						<p className="spec-tag px-3 pb-1.5">Main</p>
						<ul>
							{mobilePrimaryLinks.map((item) => (
								<li key={item.href}>
									<MobileNavLink
										compact
										onNavigate={closeMenu}
										{...item}
									/>
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
										onNavigate={closeMenu}
									/>
								</li>
							))}
							<li>
								<button
									type="button"
									className="text-primary hover:bg-muted focus-visible:ring-ring flex w-full items-center gap-1.5 rounded-md px-3 py-2 text-left text-[0.9375rem] font-bold outline-none focus-visible:ring-2"
									onClick={() => {
										closeMenu()
										router.push("/services")
									}}
								>
									Browse all services
									<ArrowRight aria-hidden="true" className="size-3.5" />
								</button>
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
											onNavigate={closeMenu}
										/>
									</li>
								))}
						</ul>
					</MobileNavSection>

					<MobileNavSection label="More">
						<ul className="grid grid-cols-2 gap-x-1">
							{mobileCompanyLinks.map((item) => (
								<li key={item.href}>
									<MobileNavLink
										compact
										href={item.href}
										label={item.label}
										onNavigate={closeMenu}
									/>
								</li>
							))}
						</ul>
					</MobileNavSection>
				</nav>

				<SheetFooter className="shrink-0 gap-2">
					<CallButton
						className="w-full gap-2"
						desktopLabel={`Call ${contactInfo.phoneDisplay}`}
						size="lg"
					/>
					<button
						type="button"
						className={cn(
							buttonVariants({ variant: "outline", size: "lg" }),
							"w-full",
						)}
						onClick={() => {
							closeMenu()
							router.push("/contact")
						}}
					>
						Get a Free Quote
					</button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
