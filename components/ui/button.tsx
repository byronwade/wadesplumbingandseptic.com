import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export const buttonVariants = cva(
	"inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-transparent text-sm font-bold whitespace-nowrap transition-[color,background-color,border-color,transform] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-px",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground hover:bg-[color-mix(in_srgb,var(--primary)_88%,black)]",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-[color-mix(in_srgb,var(--secondary)_85%,var(--ink))]",
				outline:
					"border-border bg-card text-foreground hover:border-foreground/25 hover:bg-muted",
				ghost: "text-foreground hover:bg-muted",
				link: "text-primary underline-offset-4 hover:underline",
				inverse:
					"border-transparent bg-white/12 text-white hover:bg-white/18 focus-visible:ring-offset-ink",
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
