import Link from "next/link"
import { ArrowLeft, Phone } from "@/components/icons"

import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

export default function NotFound() {
	return (
		<main className="surface-hero tex-grid" id="main-content">
			<div className="container-shell grid min-h-[60vh] place-items-center py-[var(--space-section-y)]">
				<div className="section-head max-w-xl text-center">
					<p className="spec-label spec-label-center">Error 404</p>
					<h1 className="type-headline text-white">
						This page could not be found.
					</h1>
					<p className="type-lead text-on-dark-muted">
						The page may have moved during our website upgrade. Use the links
						below or call us and we will point you in the right direction.
					</p>
					<div className="flex flex-col justify-center gap-3 pt-3 sm:flex-row">
						<Link
							className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
							href="/"
							prefetch
						>
							<ArrowLeft aria-hidden="true" />
							Back home
						</Link>
						<a
							className={cn(
								buttonVariants({ variant: "inverse", size: "lg" }),
								"w-full sm:w-auto",
							)}
							href={siteConfig.phoneHref}
						>
							<Phone aria-hidden="true" />
							{siteConfig.phone}
						</a>
					</div>
				</div>
			</div>
		</main>
	)
}
