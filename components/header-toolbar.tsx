import { CallButton, CallIconButton } from "@/components/call-button"
import {
	HeaderMobileMenuButton,
	HeaderSearchButton,
} from "@/components/header-controls"
import { contactInfo } from "@/lib/contact"

/**
 * Search, call, and the mobile sheet. Call links stay server HTML. Search and
 * the hamburger are a small island so the Radix mega-menu can load after idle
 * on wide screens and never download on phones.
 */
export function HeaderToolbar() {
	return (
		<>
			<div className="hidden shrink-0 items-center gap-2 @min-[40rem]/header:flex">
				<HeaderSearchButton />
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
				<HeaderSearchButton className="size-[44px] @min-[40rem]/header:hidden [&_svg]:size-[16px]" />
				<CallIconButton className="hover:text-primary-bright focus-visible:ring-offset-ink text-on-dark size-[44px] rounded-md hover:bg-transparent @min-[40rem]/header:hidden [&_svg]:size-[20px]" />
				<HeaderMobileMenuButton />
			</div>
		</>
	)
}
