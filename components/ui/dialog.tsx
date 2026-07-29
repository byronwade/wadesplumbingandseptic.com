"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogPortal = DialogPrimitive.Portal
export const DialogClose = DialogPrimitive.Close

export function DialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
	return (
		<DialogPrimitive.Overlay
			className={cn(
				"bg-ink/70 data-[state=closed]:animate-fade data-[state=open]:animate-fade fixed inset-0 z-50",
				className,
			)}
			{...props}
		/>
	)
}

export function DialogContent({
	className,
	children,
	showCloseButton = true,
	overlayClassName,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
	showCloseButton?: boolean
	overlayClassName?: string
}) {
	return (
		<DialogPortal>
			<DialogOverlay className={overlayClassName} />
			<DialogPrimitive.Content
				className={cn(
					"border-border bg-popover text-popover-foreground fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-[var(--shadow-edge)] duration-200 sm:rounded-lg",
					className,
				)}
				{...props}
			>
				{children}
				{showCloseButton ? (
					<DialogPrimitive.Close className="focus-visible:ring-ring absolute top-4 right-4 rounded-md opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none">
						<X className="size-4" />
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				) : null}
			</DialogPrimitive.Content>
		</DialogPortal>
	)
}

export function DialogHeader({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("flex flex-col gap-1.5 text-left", className)}
			{...props}
		/>
	)
}

export function DialogTitle({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
	return (
		<DialogPrimitive.Title
			className={cn("text-lg font-extrabold tracking-[-0.02em]", className)}
			{...props}
		/>
	)
}

export function DialogDescription({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	)
}
