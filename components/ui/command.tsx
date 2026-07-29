"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

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
	...props
}: React.ComponentProps<typeof Dialog> & {
	title?: string
	description?: string
}) {
	return (
		<Dialog {...props}>
			<DialogContent className="overflow-hidden p-0">
				<DialogTitle className="sr-only">{title}</DialogTitle>
				<DialogDescription className="sr-only">{description}</DialogDescription>
				<Command className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group]]:px-2 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3">
					{children}
				</Command>
			</DialogContent>
		</Dialog>
	)
}

export function CommandInput({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
	return (
		<div
			className="border-border flex items-center border-b px-3"
			cmdk-input-wrapper=""
		>
			<Search className="mr-2 size-4 shrink-0 opacity-50" />
			<CommandPrimitive.Input
				className={cn(
					"placeholder:text-muted-foreground focus-visible:ring-ring flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				{...props}
			/>
		</div>
	)
}

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
	...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
	return (
		<CommandPrimitive.Empty
			className="text-muted-foreground py-6 text-center text-sm"
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
