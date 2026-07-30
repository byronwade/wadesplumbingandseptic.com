"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "@/components/icons"

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export function Command({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive>) {
	return (
		<CommandPrimitive
			className={cn(
				"bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-lg",
				className,
			)}
			{...props}
		/>
	)
}

export function CommandDialog({
	title = "Command menu",
	description = "Search site navigation and actions.",
	children,
	className,
	overlayClassName,
	commandClassName,
	showCloseButton = true,
	shouldFilter = true,
	onOpenAutoFocus,
	...props
}: React.ComponentProps<typeof Dialog> & {
	title?: string
	description?: string
	className?: string
	overlayClassName?: string
	commandClassName?: string
	showCloseButton?: boolean
	shouldFilter?: boolean
	onOpenAutoFocus?: React.ComponentProps<typeof DialogContent>["onOpenAutoFocus"]
}) {
	return (
		<Dialog {...props}>
			<DialogContent
				className={cn("overflow-hidden p-0", className)}
				overlayClassName={overlayClassName}
				showCloseButton={showCloseButton}
				onOpenAutoFocus={onOpenAutoFocus}
			>
				<DialogTitle className="sr-only">{title}</DialogTitle>
				<DialogDescription className="sr-only">
					{description}
				</DialogDescription>
				<Command
					shouldFilter={shouldFilter}
					className={cn(
						"[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group]]:px-2 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3",
						commandClassName,
					)}
				>
					{children}
				</Command>
			</DialogContent>
		</Dialog>
	)
}

export const CommandInput = React.forwardRef<
	React.ComponentRef<typeof CommandPrimitive.Input>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(function CommandInput({ className, ...props }, ref) {
	return (
		<div
			data-slot="command-input-wrapper"
			className="border-border flex items-center border-b px-3"
			cmdk-input-wrapper=""
		>
			<Search className="mr-2 size-4 shrink-0 opacity-50" aria-hidden="true" />
			<CommandPrimitive.Input
				ref={ref}
				data-slot="command-input"
				className={cn(
					"placeholder:text-muted-foreground focus-visible:ring-ring flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				{...props}
			/>
		</div>
	)
})

export function CommandList({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
	return (
		<CommandPrimitive.List
			className={cn("max-h-80 overflow-x-hidden overflow-y-auto", className)}
			{...props}
		/>
	)
}

export function CommandEmpty({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
	return (
		<CommandPrimitive.Empty
			className={cn(
				"text-muted-foreground py-6 text-center text-sm",
				className,
			)}
			{...props}
		/>
	)
}

export function CommandGroup({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
	return (
		<CommandPrimitive.Group
			className={cn(
				"text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:uppercase",
				className,
			)}
			{...props}
		/>
	)
}

export function CommandItem({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
	return (
		<CommandPrimitive.Item
			className={cn(
				"data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground focus-visible:ring-ring relative flex cursor-pointer items-center gap-2 rounded-md text-sm font-bold outline-none select-none focus-visible:ring-2 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
				className,
			)}
			{...props}
		/>
	)
}

export function CommandSeparator({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
	return (
		<CommandPrimitive.Separator
			className={cn("bg-border -mx-1 h-px", className)}
			{...props}
		/>
	)
}
