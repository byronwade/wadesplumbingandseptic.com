import * as React from "react"

import { cn } from "@/lib/utils"

export function Card({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"border-border bg-card text-card-foreground rounded-lg border shadow-[var(--shadow-edge)]",
				className,
			)}
			{...props}
		/>
	)
}

/*
 * Padding and title size live in globals.css under `@container card`, so a card
 * scales from its own width instead of the viewport's. That lets the same card
 * sit in a three-up rail and in a full-width column without a per-usage
 * breakpoint ladder. --space-card is the shared inset with panels and CTA boxes.
 */
export function CardHeader({
	className,
	...props
}: React.ComponentProps<"div">) {
	return <div className={cn("card-head", className)} {...props} />
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
	return (
		<h3
			className={cn(
				"card-title font-display leading-snug font-extrabold tracking-[-0.02em] text-balance",
				className,
			)}
			{...props}
		/>
	)
}

export function CardDescription({
	className,
	...props
}: React.ComponentProps<"p">) {
	return (
		<p
			className={cn(
				"text-muted-foreground mt-2 text-sm leading-relaxed text-pretty",
				className,
			)}
			{...props}
		/>
	)
}

export function CardContent({
	className,
	...props
}: React.ComponentProps<"div">) {
	return <div className={cn("card-body", className)} {...props} />
}
