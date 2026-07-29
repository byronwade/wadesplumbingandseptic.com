import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export const badgeVariants = cva(
	"inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-[0.7rem] font-extrabold tracking-[0.14em] uppercase",
	{
		variants: {
			tone: {
				default: "border-primary/25 bg-accent text-accent-foreground",
				bright:
					"border-primary-bright/35 bg-primary-bright/12 text-primary-bright",
				muted: "border-border bg-muted text-muted-foreground",
				inverse: "border-white/20 bg-white/8 text-white",
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
	return (
		<span className={cn(badgeVariants({ tone }), className)} {...props} />
	)
}
