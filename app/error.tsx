"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, RotateCcw } from "lucide-react"

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
			className="grid min-h-[65vh] place-items-center px-4 py-20"
			id="main-content"
		>
			<div className="max-w-xl text-center" role="alert">
				<p className="type-eyebrow justify-center">Something went wrong</p>
				<h1 className="type-title mt-4">We hit an unexpected error.</h1>
				<p className="type-lead mt-5">
					Try again, or head home and keep browsing. If this keeps happening,
					give us a call and we will help.
				</p>
				<div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
					<button
						className={cn(buttonVariants({ size: "lg" }), "gap-2")}
						onClick={reset}
						type="button"
					>
						<RotateCcw className="size-4" />
						Try again
					</button>
					<Link
						className={buttonVariants({ variant: "outline", size: "lg" })}
						href="/"
						prefetch
					>
						<ArrowLeft />
						Back Home
					</Link>
				</div>
			</div>
		</main>
	)
}
