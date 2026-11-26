import { Clock, Mail } from "@/components/icons"

import { CallButton } from "@/components/call-button"
import {
	EmailAddress,
	ProtectedContactLink,
} from "@/components/protected-contact"
import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import { weekdayHoursPhrase } from "@/lib/public-facts"
import { cn } from "@/lib/utils"

/**
 * Contact-page stand-in for the quote form when production cannot send email.
 * Phone, email, and weekday hours only. No submit control.
 */
export function QuoteCallEmail() {
	return (
		<div className="border-border bg-card rounded-xl border p-5 shadow-[var(--shadow-panel)] sm:p-7">
			<dl className="grid gap-5">
				<div>
					<dt className="text-sm font-semibold">Phone</dt>
					<dd className="mt-2">
						<ProtectedContactLink
							className="text-foreground text-[0.9375rem] font-semibold"
							kind="phone"
						>
							{contactInfo.phoneDisplay}
						</ProtectedContactLink>
					</dd>
				</div>
				<div>
					<dt className="text-sm font-semibold">Email</dt>
					<dd className="mt-2">
						<ProtectedContactLink
							className="text-foreground text-[0.9375rem] font-semibold"
							kind="email"
						>
							<EmailAddress />
						</ProtectedContactLink>
					</dd>
				</div>
				<div>
					<dt className="text-sm font-semibold">Hours</dt>
					<dd className="text-foreground mt-2 inline-flex items-start gap-2 text-[0.9375rem]">
						<Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
						{weekdayHoursPhrase()}
					</dd>
				</div>
			</dl>

			<div className="mt-6 flex min-w-0 flex-col flex-wrap items-stretch gap-3 sm:flex-row sm:items-center">
				<CallButton
					className="w-full sm:w-auto"
					desktopLabel={`Call ${contactInfo.phoneDisplay}`}
					size="lg"
				/>
				<ProtectedContactLink
					className={cn(
						buttonVariants({ variant: "outline", size: "lg", wrap: true }),
						"w-full sm:w-auto",
					)}
					kind="email"
				>
					<Mail aria-hidden="true" className="size-4 shrink-0" />
					Email <EmailAddress />
				</ProtectedContactLink>
			</div>
		</div>
	)
}
