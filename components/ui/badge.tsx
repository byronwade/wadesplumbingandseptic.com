import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/*
 * Category mark, not a pill. Matches the .spec-label plate treatment in
 * globals.css so cards, heroes, and section heads all label things the same
 * way - the old rounded chip fought the "no pill clusters" rule and doubled up
 * with the eyebrow style it sat next to.
 */
export const badgeVariants = cva(
	"inline-flex items-center font-mono text-[length:var(--type-label)] font-semibold tracking-[0.14em] uppercase",
	{
		variants: {
			tone: {
				default: "text-primary",
				bright: "text-primary-bright",
				muted: "text-muted-foreground",
				inverse: "text-primary-bright",
			},
		},
		defaultVariants: {
			tone: "default",
		},
	},
)

export function Badge({
	className,
	tone,
	...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
	return <span className={cn(badgeVariants({ tone }), className)} {...props} />
}
