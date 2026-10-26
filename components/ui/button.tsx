import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export const buttonVariants = cva(
	"inline-flex shrink-0 items-center justify-center gap-2 rounded-md border-0 shadow-none text-sm font-bold whitespace-nowrap transition-[color,background-color,transform,opacity] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-px",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground shadow-[inset_0_0_0_1px_rgba(0,0,0,0.22)] hover:bg-primary-hover",
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
			/**
			 * Let the label wrap instead of overflowing or being cut off in narrow
			 * columns and with enlarged text. Each size's height becomes a floor.
			 */
			wrap: {
				true: "h-auto min-w-0 max-w-full py-2 text-center whitespace-normal [overflow-wrap:anywhere]",
				false: "",
			},
		},
		compoundVariants: [
			{ wrap: true, size: "default", class: "min-h-11" },
			{ wrap: true, size: "sm", class: "min-h-9" },
			// Keep enlarged padding from leaving only a few letters per line. The
			// `100vw - 18rem` term only wins when the screen is under about 20rem
			// wide (enlarged text on a phone), leaving room for the phone number
			// on one line. At normal text size it is inactive from 316px up.
			{
				wrap: true,
				size: "lg",
				class: "min-h-12 px-[min(1.5rem,32px,max(0.5rem,100vw_-_18rem))]",
			},
			{
				wrap: true,
				size: "xl",
				class: "min-h-14 px-[min(1.75rem,32px,max(0.5rem,100vw_-_18rem))]",
			},
		],
		defaultVariants: {
			variant: "default",
			size: "default",
			wrap: false,
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
	wrap,
	asChild = false,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot : "button"

	return (
		<Comp
			className={cn(buttonVariants({ variant, size, wrap, className }))}
			{...props}
		/>
	)
}
