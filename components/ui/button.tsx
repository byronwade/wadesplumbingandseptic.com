import type * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export const buttonVariants = cva(
	"inline-flex shrink-0 items-center justify-center gap-2 rounded-md border-0 shadow-none text-sm font-bold whitespace-nowrap transition-[color,background-color,transform,opacity] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-px",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground shadow-[inset_0_0_0_1px_rgba(0,0,0,0.22)] hover:bg-[color-mix(in_srgb,var(--primary)_88%,black)]",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-[color-mix(in_srgb,var(--secondary)_85%,var(--ink))]",
				outline:
					"border border-border bg-card text-foreground hover:border-foreground/25 hover:bg-muted",
				ghost:
					"bg-transparent text-foreground hover:bg-transparent hover:text-primary",
				link: "bg-transparent text-primary underline-offset-4 hover:underline",
				/**
				 * Dark-surface secondary CTA. No fill plate - light translucent
				 * backgrounds create hard edges that read as white borders on ink.
				 */
				inverse:
					"bg-transparent px-0 text-white hover:bg-transparent hover:text-primary-bright focus-visible:ring-offset-ink",
			},
			size: {
				default: "h-11 px-4 py-2",
				sm: "h-9 rounded-md px-3 text-xs",
				lg: "h-12 px-6 text-base",
				xl: "h-14 px-7 text-base tracking-[-0.01em]",
				icon: "size-11",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
)

export type ButtonProps = React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean
	}

export function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot : "button"

	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	)
}
