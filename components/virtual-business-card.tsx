import Image from "next/image"
import { Mail } from "@/components/icons"

import { CallButton } from "@/components/call-button"
import {
	ProtectedContactLink,
	ProtectedEmailText,
	ProtectedPhoneText,
} from "@/components/protected-contact"
import { SaveContactButton } from "@/components/save-contact-button"
import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import { cn } from "@/lib/utils"

/**
 * Virtual business card: one clean contact composition with save + call.
 * Mobile keeps a single vertical flow (no icon-tile grid). Desktop adds a
 * side action column.
 */
export function VirtualBusinessCard({
	tone = "light",
	className,
	id = "virtual-business-card",
}: {
	tone?: "light" | "dark"
	className?: string
	id?: string
}) {
	const dark = tone === "dark"

	return (
		<section
			aria-labelledby={`${id}-title`}
			className={cn(
				"overflow-hidden",
				dark
					? "rounded-xl border border-white/10 bg-white/[0.04]"
					: "border-border bg-card shadow-[var(--shadow-panel)] rounded-xl border",
				className,
			)}
			id={id}
		>
			<div className="flex flex-col sm:flex-row sm:items-stretch">
				<div className="flex min-w-0 flex-1 flex-col gap-5 p-5 sm:gap-6 sm:p-7">
					<div className="flex items-center gap-3.5">
						<Image
							alt="Wade's Plumbing & Septic logo"
							className="size-12 shrink-0 rounded-md sm:size-14"
							height={56}
							src="/images/brand/wades-mark-sm.webp"
							width={56}
						/>
						<div className="min-w-0">
							<p
								className={cn(
									"font-mono text-[0.6875rem] font-semibold tracking-[0.14em] uppercase",
									dark ? "text-primary-bright" : "text-primary",
								)}
							>
								Virtual business card
							</p>
							<h2
								className={cn(
									"font-display mt-1 text-[1.2rem] leading-tight font-extrabold tracking-[-0.02em] sm:text-[1.35rem]",
									dark ? "text-white" : "text-foreground",
								)}
								id={`${id}-title`}
							>
								{contactInfo.displayName}
							</h2>
						</div>
					</div>

					<div
						className={cn(
							"grid gap-4 border-y py-4",
							dark ? "border-white/10" : "border-border",
						)}
					>
						<div>
							<p
								className={cn(
									"font-mono text-[0.625rem] tracking-[0.14em] uppercase",
									dark ? "text-on-dark-subtle" : "text-muted-foreground",
								)}
							>
								Phone
							</p>
							<ProtectedPhoneText
								className={cn(
									"mt-1 text-xl font-extrabold tracking-[-0.02em] transition-colors sm:text-2xl",
									dark
										? "text-white hover:text-primary-bright"
										: "text-foreground hover:text-primary",
								)}
							/>
						</div>
						<div className="grid gap-3 sm:grid-cols-2 sm:gap-6">
							<div className="min-w-0">
								<p
									className={cn(
										"font-mono text-[0.625rem] tracking-[0.14em] uppercase",
										dark ? "text-on-dark-subtle" : "text-muted-foreground",
									)}
								>
									Email
								</p>
								<ProtectedEmailText
									className={cn(
										"mt-1 block text-sm font-bold break-all transition-colors sm:text-base",
										dark
											? "text-white hover:text-primary-bright"
											: "text-foreground hover:text-primary",
									)}
								/>
							</div>
							<div className="min-w-0">
								<p
									className={cn(
										"font-mono text-[0.625rem] tracking-[0.14em] uppercase",
										dark ? "text-on-dark-subtle" : "text-muted-foreground",
									)}
								>
									Office & hours
								</p>
								<p
									className={cn(
										"mt-1 text-sm leading-snug font-bold sm:text-base",
										dark ? "text-white" : "text-foreground",
									)}
								>
									{contactInfo.address.display}
								</p>
								<p
									className={cn(
										"mt-1 text-sm",
										dark ? "text-on-dark-muted" : "text-muted-foreground",
									)}
								>
									{contactInfo.hours}
								</p>
							</div>
						</div>
					</div>

					{/* Mobile actions live in the main flow so the card reads as one unit. */}
					<div className="grid gap-2 sm:hidden">
						<SaveContactButton className="w-full" size="lg" />
						<CallButton
							className="w-full"
							desktopLabel={`Call ${contactInfo.phoneDisplay}`}
							prefer="dial"
							size="lg"
							variant={dark ? "inverse" : "outline"}
						/>
						<ProtectedContactLink
							ariaLabel={`Email ${contactInfo.email}`}
							className={cn(
								buttonVariants({ variant: "ghost", size: "lg" }),
								"w-full",
								dark
									? "text-on-dark-muted hover:text-white"
									: "text-muted-foreground",
							)}
							kind="email"
						>
							<Mail aria-hidden="true" />
							Email us
						</ProtectedContactLink>
					</div>
				</div>

				<div
					className={cn(
						"hidden shrink-0 flex-col justify-center gap-3 border-t p-5 sm:flex sm:w-60 sm:border-t-0 sm:border-l sm:p-7",
						dark ? "border-white/10" : "border-border",
					)}
				>
					<p
						className={cn(
							"text-sm leading-relaxed",
							dark ? "text-on-dark-muted" : "text-muted-foreground",
						)}
					>
						Save our card to your phone with the logo, number, email, and
						address ready. After you save, you can call right away.
					</p>
					<SaveContactButton className="w-full" size="lg" />
					<CallButton
						className="w-full"
						desktopLabel={`Call ${contactInfo.phoneDisplay}`}
						prefer="dial"
						size="lg"
						variant={dark ? "inverse" : "outline"}
					/>
					<ProtectedContactLink
						ariaLabel={`Email ${contactInfo.email}`}
						className={cn(
							buttonVariants({ variant: "ghost", size: "lg" }),
							"w-full",
							dark
								? "text-on-dark-muted hover:text-white"
								: "text-muted-foreground",
						)}
						kind="email"
					>
						<Mail aria-hidden="true" />
						Email us
					</ProtectedContactLink>
				</div>
			</div>
		</section>
	)
}
