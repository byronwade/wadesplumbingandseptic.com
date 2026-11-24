"use client"

import dynamic from "next/dynamic"
import { useRef, useState } from "react"
import { Menu, Search } from "@/components/icons"

import { CallButton, CallIconButton } from "@/components/call-button"
import { Button } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import { prefetchSearchIndex } from "@/lib/search-client"
import { openGlobalSearch } from "@/lib/search-events"

const SiteHeaderMobileMenu = dynamic(
	() =>
		import("@/components/site-header-mobile-menu").then(
			(mod) => mod.SiteHeaderMobileMenu,
		),
	{ ssr: false },
)

/**
 * Search, call, and the mobile sheet. Kept as a small island so the Radix mega
 * menu can load after idle on wide screens and never download on phones.
 */
export function HeaderToolbar() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [mobileMenuReady, setMobileMenuReady] = useState(false)
	const mobileMenuTriggerRef = useRef<HTMLButtonElement>(null)

	const openMobileMenu = () => {
		setMobileMenuReady(true)
		setMobileMenuOpen(true)
	}

	const restoreMobileMenuFocus = (event: Event) => {
		event.preventDefault()
		mobileMenuTriggerRef.current?.focus()
	}

	return (
		<>
			<div className="hidden shrink-0 items-center gap-2 @min-[40rem]/header:flex">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="hover:text-primary-bright focus-visible:ring-offset-ink text-on-dark hover:bg-transparent"
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
					prefer="dial"
					size="lg"
					wrap={false}
				/>
			</div>

			{/* Icon targets are sized in px: icons are not text, so enlarged text
			    should not double them and push the menu button off screen. */}
			<div className="flex shrink-0 items-center @min-[64rem]/header:hidden">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="hover:text-primary-bright focus-visible:ring-offset-ink text-on-dark size-[44px] hover:bg-transparent @min-[40rem]/header:hidden [&_svg]:size-[16px]"
					aria-label="Search services, tips, and pages"
					onMouseEnter={() => void prefetchSearchIndex()}
					onFocus={() => void prefetchSearchIndex()}
					onClick={openGlobalSearch}
				>
					<Search aria-hidden="true" className="size-5" />
				</Button>
				<CallIconButton className="hover:text-primary-bright focus-visible:ring-offset-ink text-on-dark size-[44px] rounded-md hover:bg-transparent @min-[40rem]/header:hidden [&_svg]:size-[20px]" />
				<Button
					ref={mobileMenuTriggerRef}
					type="button"
					variant="ghost"
					size="icon"
					className="hover:text-primary-bright focus-visible:ring-offset-ink text-on-dark size-[44px] hover:bg-transparent [&_svg]:size-[16px]"
					aria-label="Open main menu"
					aria-expanded={mobileMenuOpen}
					aria-haspopup="dialog"
					onClick={openMobileMenu}
				>
					<Menu aria-hidden="true" className="size-5" />
				</Button>
				{mobileMenuReady ? (
					<SiteHeaderMobileMenu
						open={mobileMenuOpen}
						onOpenChange={setMobileMenuOpen}
						onCloseAutoFocus={restoreMobileMenuFocus}
					/>
				) : null}
			</div>
		</>
	)
}
