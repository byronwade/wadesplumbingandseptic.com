"use client"

import { CallLabel } from "@/components/call-label"
import { Phone } from "@/components/icons"
import { ProtectedContactLink } from "@/components/protected-contact"
import { buttonVariants } from "@/components/ui/button"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"
import { contactInfo } from "@/lib/contact"
import { cn } from "@/lib/utils"

export function SaveContactPrompt({
	open,
	onOpenChange,
	onCloseAutoFocus,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
	onCloseAutoFocus: (event: Event) => void
}) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				className="bg-card max-h-dvh gap-0 overflow-y-auto rounded-t-2xl sm:mx-auto sm:max-w-md sm:rounded-t-2xl"
				side="bottom"
				onCloseAutoFocus={onCloseAutoFocus}
				onFocusCapture={(event) => {
					// Radix wraps focus without scrolling clipped controls into view.
					if (event.target instanceof HTMLElement) {
						event.target.scrollIntoView({ block: "nearest", inline: "nearest" })
					}
				}}
			>
				<SheetHeader className="pb-2">
					<SheetTitle>Ready to call?</SheetTitle>
					<SheetDescription>
						If you saved Wade&apos;s to your contacts, you can dial us next. We
						are here {contactInfo.hours.toLowerCase()}.
					</SheetDescription>
				</SheetHeader>
				<SheetFooter className="pb-[max(1.25rem,env(safe-area-inset-bottom))]">
					<ProtectedContactLink
						ariaLabel={`Call ${contactInfo.phoneDisplay}`}
						className={cn(buttonVariants({ size: "xl", wrap: true }), "w-full")}
						kind="phone"
						onClick={() => onOpenChange(false)}
					>
						<CallLabel icon={<Phone aria-hidden="true" />} />
					</ProtectedContactLink>
					<button
						className={cn(
							buttonVariants({ variant: "ghost", size: "lg", wrap: true }),
							"w-full",
						)}
						onClick={() => onOpenChange(false)}
						type="button"
					>
						Not now
					</button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
