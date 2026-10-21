"use client"

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
						className={cn(buttonVariants({ size: "xl" }), "w-full")}
						kind="phone"
						onClick={() => onOpenChange(false)}
					>
						<Phone aria-hidden="true" />
						Call {contactInfo.phoneDisplay}
					</ProtectedContactLink>
					<button
						className={cn(
							buttonVariants({ variant: "ghost", size: "lg" }),
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
