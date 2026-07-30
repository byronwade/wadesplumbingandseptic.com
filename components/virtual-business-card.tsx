import Image from "next/image"
import { Clock, IdentificationCard, Mail, MapPin, Phone } from "@/components/icons"

import { CallButton } from "@/components/call-button"
import {
	ProtectedContactLink,
	ProtectedEmailText,
	ProtectedPhoneText,
} from "@/components/protected-contact"
import { buttonVariants } from "@/components/ui/button"
import { contactInfo } from "@/lib/contact"
import { cn } from "@/lib/utils"

/**
 * Virtual business card: logo, hours, protected phone/email, address, and
 * actions to save the vCard or dial/email. Safe to place on light or dark bands
 * via the `tone` prop.
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
				"overflow-hidden rounded-xl",
				dark
					? "surface-float"
					: "border-border bg-card shadow-[var(--shadow-panel)] border",
				className,
			)}
			id={id}
		>
			<div
				className={cn(
					"flex flex-col gap-6 p-[var(--space-card)] sm:flex-row sm:items-stretch sm:gap-8 sm:p-7",
				)}
			>
				<div className="flex min-w-0 flex-1 flex-col gap-5">
					<div className="flex items-start gap-3">
						<Image
							alt="Wade's Plumbing & Septic logo"
							className="size-14 shrink-0 rounded-md"
							height={56}
							src="/images/brand/wades-mark-sm.webp"
							width={56}
						/>
						<div className="min-w-0">
							<p
								className={cn(
									"spec-label",
									dark ? "text-primary-bright" : undefined,
								)}
							>
								Virtual business card
							</p>
							<h2
								className={cn(
									"type-subtitle mt-2 text-[1.25rem]",
									dark ? "text-white" : undefined,
								)}
								id={`${id}-title`}
							>
								{contactInfo.displayName}
							</h2>
						</div>
					</div>

					<ul className="grid gap-3 text-sm">
						<li className="flex items-start gap-3">
							<span
								className={cn(
									"mt-0.5 grid size-8 shrink-0 place-items-center rounded-md",
									dark
										? "bg-white/10 text-primary-bright"
										: "bg-accent text-accent-foreground",
								)}
							>
								<Phone aria-hidden="true" className="size-4" />
							</span>
							<div className="min-w-0">
								<p
									className={cn(
										"font-mono text-[0.6875rem] tracking-[0.12em] uppercase",
										dark ? "text-on-dark-subtle" : "text-muted-foreground",
									)}
								>
									Call or text
								</p>
								<ProtectedPhoneText
									className={cn(
										"mt-0.5 text-base font-bold transition-colors",
										dark
											? "text-white hover:text-primary-bright"
											: "text-foreground hover:text-primary",
									)}
								/>
							</div>
						</li>
						<li className="flex items-start gap-3">
							<span
								className={cn(
									"mt-0.5 grid size-8 shrink-0 place-items-center rounded-md",
									dark
										? "bg-white/10 text-primary-bright"
										: "bg-accent text-accent-foreground",
								)}
							>
								<Mail aria-hidden="true" className="size-4" />
							</span>
							<div className="min-w-0">
								<p
									className={cn(
										"font-mono text-[0.6875rem] tracking-[0.12em] uppercase",
										dark ? "text-on-dark-subtle" : "text-muted-foreground",
									)}
								>
									Email
								</p>
								<ProtectedEmailText
									className={cn(
										"mt-0.5 break-all text-base font-bold transition-colors",
										dark
											? "text-white hover:text-primary-bright"
											: "text-foreground hover:text-primary",
									)}
								/>
							</div>
						</li>
						<li className="flex items-start gap-3">
							<span
								className={cn(
									"mt-0.5 grid size-8 shrink-0 place-items-center rounded-md",
									dark
										? "bg-white/10 text-primary-bright"
										: "bg-accent text-accent-foreground",
								)}
							>
								<MapPin aria-hidden="true" className="size-4" />
							</span>
							<div className="min-w-0">
								<p
									className={cn(
										"font-mono text-[0.6875rem] tracking-[0.12em] uppercase",
										dark ? "text-on-dark-subtle" : "text-muted-foreground",
									)}
								>
									Office
								</p>
								<p
									className={cn(
										"mt-0.5 text-base font-bold leading-snug",
										dark ? "text-white" : "text-foreground",
									)}
								>
									{contactInfo.address.display}
								</p>
							</div>
						</li>
						<li className="flex items-start gap-3">
							<span
								className={cn(
									"mt-0.5 grid size-8 shrink-0 place-items-center rounded-md",
									dark
										? "bg-white/10 text-primary-bright"
										: "bg-accent text-accent-foreground",
								)}
							>
								<Clock aria-hidden="true" className="size-4" />
							</span>
							<div className="min-w-0">
								<p
									className={cn(
										"font-mono text-[0.6875rem] tracking-[0.12em] uppercase",
										dark ? "text-on-dark-subtle" : "text-muted-foreground",
									)}
								>
									Hours
								</p>
								<p
									className={cn(
										"mt-0.5 text-base font-bold",
										dark ? "text-white" : "text-foreground",
									)}
								>
									{contactInfo.hours}
								</p>
							</div>
						</li>
					</ul>
				</div>

				<div
					className={cn(
						"flex shrink-0 flex-col justify-center gap-3 border-t pt-5 sm:w-56 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8",
						dark ? "border-white/10" : "border-border",
					)}
				>
					<p
						className={cn(
							"text-sm leading-relaxed",
							dark ? "text-on-dark-muted" : "text-muted-foreground",
						)}
					>
						On a phone, save our card to your contacts with the logo, number,
						email, and address ready to use.
					</p>
					<ProtectedContactLink
						ariaLabel="Save Wade's Plumbing & Septic to your contacts"
						className={cn(buttonVariants({ size: "lg" }), "w-full")}
						kind="vcard"
					>
						<IdentificationCard aria-hidden="true" />
						Save to phone
					</ProtectedContactLink>
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
