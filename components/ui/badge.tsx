import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export const badgeVariants = cva(
	"inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-[0.7rem] font-extrabold tracking-[0.14em] uppercase",
	{
		variants: {
			tone: {
				default: "bg-accent text-accent-foreground",
				bright: "bg-primary-bright/15 text-primary-bright",
				muted: "bg-muted text-muted-foreground",
				inverse: "bg-primary-bright/15 text-primary-bright",
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
