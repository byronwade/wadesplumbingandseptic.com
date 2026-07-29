import * as React from "react"

import { cn } from "@/lib/utils"

export function Card({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"border-border bg-card text-card-foreground rounded-2xl border shadow-sm",
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
	return <div className={cn("p-6 pb-3", className)} {...props} />
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
	return (
		<h3
			className={cn("text-xl font-extrabold tracking-tight", className)}
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
			className={cn("text-muted-foreground text-sm leading-relaxed", className)}
			{...props}
		/>
	)
}

export function CardContent({
	className,
	...props
}: React.ComponentProps<"div">) {
	return <div className={cn("p-6 pt-3", className)} {...props} />
}
