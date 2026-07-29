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

export function CardHeader({
	className,
	...props
}: React.ComponentProps<"div">) {
	return <div className={cn("p-5 pb-2", className)} {...props} />
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
	return (
		<h3
			className={cn(
				"text-lg font-extrabold tracking-[-0.02em] text-balance",
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
				"text-muted-foreground mt-2 text-sm leading-relaxed",
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
	return <div className={cn("p-5 pt-2", className)} {...props} />
}
