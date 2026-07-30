"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

export const Sheet = SheetPrimitive.Root
export const SheetTrigger = SheetPrimitive.Trigger
export const SheetClose = SheetPrimitive.Close
export const SheetPortal = SheetPrimitive.Portal

export function SheetOverlay({
	className,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
	return (
		<SheetPrimitive.Overlay
			className={cn(
				"bg-ink/70 data-[state=open]:animate-fade fixed inset-0 z-50",
				className,
			)}
			{...props}
		/>
	)
}

const sheetVariants = cva(
	"fixed z-50 flex flex-col gap-4 bg-card text-card-foreground shadow-[var(--shadow-edge)] transition ease-out data-[state=closed]:duration-200 data-[state=open]:duration-300",
	{
		variants: {
			side: {
				top: "inset-x-0 top-0 border-b border-border",
				bottom: "inset-x-0 bottom-0 border-t border-border",
				left: "inset-y-0 left-0 h-full w-[min(22rem,100%-2.5rem)] border-r border-border",
				right:
					"inset-y-0 right-0 h-full w-[min(22rem,100%-2.5rem)] border-l border-border",
			},
		},
		defaultVariants: {
			side: "right",
		},
	},
)

export function SheetContent({
	side = "right",
	className,
	children,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Content> &
	VariantProps<typeof sheetVariants>) {
	return (
		<SheetPortal>
			<SheetOverlay />
			<SheetPrimitive.Content
				className={cn(sheetVariants({ side }), "p-0", className)}
				{...props}
			>
				{children}
				<SheetPrimitive.Close className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring absolute top-4 right-4 grid size-10 place-items-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none">
					<X className="size-4" />
					<span className="sr-only">Close</span>
				</SheetPrimitive.Close>
			</SheetPrimitive.Content>
		</SheetPortal>
	)
}

export function SheetHeader({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("flex flex-col gap-1.5 p-5 pr-14 text-left", className)}
			{...props}
		/>
	)
}

export function SheetFooter({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"mt-auto flex flex-col gap-3 p-5 shadow-[inset_0_1px_0_0_var(--border)]",
				className,
			)}
			{...props}
		/>
	)
}

export function SheetTitle({
	className,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
	return (
		<SheetPrimitive.Title
			className={cn(
				"text-foreground font-display text-lg font-extrabold tracking-[-0.02em]",
				className,
			)}
			{...props}
		/>
	)
}

export function SheetDescription({
	className,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
	return (
		<SheetPrimitive.Description
			className={cn("text-muted-foreground text-sm leading-relaxed", className)}
			{...props}
		/>
	)
}
