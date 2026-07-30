"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, RotateCcw } from "@/components/icons"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<main
			className="container-shell grid min-h-[60vh] place-items-center py-[var(--space-section-y)]"
			id="main-content"
		>
			<div className="section-head max-w-xl text-center" role="alert">
				<p className="spec-label spec-label-center">Something went wrong</p>
				<h1 className="type-headline">We hit an unexpected error.</h1>
				<p className="type-lead">
					Try again, or head home and keep browsing. If this keeps happening,
					give us a call and we will help.
				</p>
				<div className="flex flex-col justify-center gap-3 pt-3 sm:flex-row">
					<button
						className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
						onClick={reset}
						type="button"
					>
						<RotateCcw aria-hidden="true" />
						Try again
					</button>
					<Link
						className={cn(
							buttonVariants({ variant: "outline", size: "lg" }),
							"w-full sm:w-auto",
						)}
						href="/"
						prefetch
					>
						<ArrowLeft aria-hidden="true" />
						Back home
					</Link>
				</div>
			</div>
		</main>
	)
}
