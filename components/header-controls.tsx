"use client"

import dynamic from "next/dynamic"
import { useRef, useState } from "react"
import { Menu, Search } from "@/components/icons"

import { Button } from "@/components/ui/button"
import { prefetchSearchIndex } from "@/lib/search-client"
import { openGlobalSearch } from "@/lib/search-events"
import { cn } from "@/lib/utils"

const SiteHeaderMobileMenu = dynamic(
	() =>
		import("@/components/site-header-mobile-menu").then(
			(mod) => mod.SiteHeaderMobileMenu,
		),
	{ ssr: false },
)

const searchButtonClass =
	"hover:text-primary-bright focus-visible:ring-offset-ink text-on-dark hover:bg-transparent"

export function HeaderSearchButton({ className }: { className?: string }) {
	return (
		<Button
			type="button"
			variant="ghost"
			size="icon"
			className={cn(searchButtonClass, className)}
			aria-label="Search services, tips, and pages"
			onMouseEnter={() => void prefetchSearchIndex()}
			onFocus={() => void prefetchSearchIndex()}
			onClick={openGlobalSearch}
		>
			<Search aria-hidden="true" className="size-5" />
		</Button>
	)
}

export function HeaderMobileMenuButton({
	quoteEmailReady,
}: {
	quoteEmailReady: boolean
}) {
	const [open, setOpen] = useState(false)
	const [ready, setReady] = useState(false)
	const triggerRef = useRef<HTMLButtonElement>(null)

	const restoreFocus = (event: Event) => {
		event.preventDefault()
		triggerRef.current?.focus()
	}

	return (
		<>
			<Button
				ref={triggerRef}
				type="button"
				variant="ghost"
				size="icon"
				className={cn(searchButtonClass, "size-[44px] [&_svg]:size-[16px]")}
				aria-label="Open main menu"
				aria-expanded={open}
				aria-haspopup="dialog"
				onClick={() => {
					setReady(true)
					setOpen(true)
				}}
			>
				<Menu aria-hidden="true" className="size-5" />
			</Button>
			{ready ? (
				<SiteHeaderMobileMenu
					open={open}
					onOpenChange={setOpen}
					onCloseAutoFocus={restoreFocus}
					quoteEmailReady={quoteEmailReady}
				/>
			) : null}
		</>
	)
}
