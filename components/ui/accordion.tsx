"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

export function Accordion({
	className,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
	return (
		<AccordionPrimitive.Root
			className={cn("border-border border-t", className)}
			{...props}
		/>
	)
}

export function AccordionItem({
	className,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
	return (
		<AccordionPrimitive.Item
			className={cn("border-border border-b", className)}
			{...props}
		/>
	)
}

export function AccordionTrigger({
	className,
	children,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
	return (
		<AccordionPrimitive.Header className="flex">
			<AccordionPrimitive.Trigger
				className={cn(
					"hover:text-primary focus-visible:ring-ring flex flex-1 items-center justify-between gap-4 py-5 text-left text-[1.0625rem] font-bold tracking-[-0.015em] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)] [&[data-state=open]>svg]:rotate-180",
					className,
				)}
				{...props}
			>
				{children}
				<ChevronDown
					aria-hidden="true"
					className="text-muted-foreground size-4 shrink-0 transition-transform duration-200"
				/>
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	)
}

export function AccordionContent({
	className,
	children,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
	return (
		<AccordionPrimitive.Content
			className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
			{...props}
		>
			<div
				className={cn(
					"text-muted-foreground max-w-[62ch] pr-8 pb-5 leading-relaxed text-pretty",
					className,
				)}
			>
				{children}
			</div>
		</AccordionPrimitive.Content>
	)
}
