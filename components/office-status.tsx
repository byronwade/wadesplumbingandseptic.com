"use client"

import { useEffect, useState } from "react"

import { officeStatus, type OfficeStatus } from "@/lib/office-hours"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * Live "open now" line for the published office hours. The server render and
 * the first client render show the plain hours, so cached HTML is never wrong;
 * the status replaces them once the visitor's clock is known.
 */
export function OfficeHoursStatus({ className }: { className?: string }) {
	const [status, setStatus] = useState<OfficeStatus | null>(null)

	useEffect(() => {
		const update = () => setStatus(officeStatus(new Date()))
		update()
		const timer = window.setInterval(update, 60_000)
		return () => window.clearInterval(timer)
	}, [])

	if (!status) return <span className={className}>{siteConfig.hours}</span>

	return (
		<span className={cn("inline-flex items-center gap-2", className)}>
			<span
				aria-hidden="true"
				className={cn(
					"size-2 shrink-0 rounded-full",
					status.open ? "bg-emerald-500" : "bg-primary-bright",
				)}
			/>
			<span>
				{status.label}
				<span className="sr-only">. {siteConfig.hours}</span>
			</span>
		</span>
	)
}
