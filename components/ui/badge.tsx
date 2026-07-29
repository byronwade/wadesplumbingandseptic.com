import * as React from "react"

import { cn } from "@/lib/utils"

export function Badge({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			className={cn(
				"border-primary/30 bg-primary/10 text-primary inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold tracking-wide",
				className,
			)}
			{...props}
		/>
	)
}
