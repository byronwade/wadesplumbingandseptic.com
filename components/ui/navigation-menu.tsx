"use client"

import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

export function NavigationMenu({
	className,
	children,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root>) {
	return (
		<NavigationMenuPrimitive.Root
			className={cn(
				"relative z-10 flex max-w-max flex-1 items-center justify-center",
				className,
			)}
			{...props}
		>
			{children}
			<NavigationMenuViewport />
		</NavigationMenuPrimitive.Root>
	)
}

export function NavigationMenuList({
	className,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
	return (
		<NavigationMenuPrimitive.List
			className={cn(
				"group flex flex-1 list-none items-center justify-center gap-1",
				className,
			)}
			{...props}
		/>
	)
}

export const NavigationMenuItem = NavigationMenuPrimitive.Item

export const navigationMenuTriggerStyle = cva(
	"group inline-flex h-10 w-max items-center justify-center rounded-md px-3.5 py-2 text-sm font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
)

export function NavigationMenuTrigger({
	className,
	children,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
	return (
		<NavigationMenuPrimitive.Trigger
			className={cn(navigationMenuTriggerStyle(), "group", className)}
			{...props}
		>
			{children}
			<ChevronDown
				className="relative top-px ml-1 size-3.5 transition duration-200 group-data-[state=open]:rotate-180"
				aria-hidden="true"
			/>
		</NavigationMenuPrimitive.Trigger>
	)
}

export function NavigationMenuContent({
	className,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
	return (
		<NavigationMenuPrimitive.Content
			className={cn(
				"top-0 left-0 w-full md:absolute md:w-auto",
				"data-[motion^=from-]:animate-fade data-[motion^=to-]:animate-fade",
				className,
			)}
			{...props}
		/>
	)
}

export const NavigationMenuLink = NavigationMenuPrimitive.Link

function NavigationMenuViewport({
	className,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
	return (
		<div className="absolute top-full left-0 flex w-full justify-center md:w-auto">
			<NavigationMenuPrimitive.Viewport
				className={cn(
					"origin-top-center border-border bg-popover text-popover-foreground relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-lg border shadow-[var(--shadow-edge)] md:w-[var(--radix-navigation-menu-viewport-width)]",
					className,
				)}
				{...props}
			/>
		</div>
	)
}

export { NavigationMenuViewport }
