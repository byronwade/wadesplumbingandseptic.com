import Link from "next/link"
import { ArrowLeft, Phone } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"

export default function NotFound() {
	return (
		<main
			className="grid min-h-[65vh] place-items-center px-4 py-20"
			id="main-content"
		>
			<div className="max-w-xl text-center">
				<p className="type-eyebrow justify-center">404</p>
				<h1 className="type-display mt-4">This page could not be found.</h1>
				<p className="type-lead mt-5">
					The page may have moved during our website upgrade. Use the links
					below or call us and we will point you in the right direction.
				</p>
				<div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
					<Link className={buttonVariants({ size: "lg" })} href="/">
						<ArrowLeft />
						Back Home
					</Link>
					<a
						className={buttonVariants({ variant: "outline", size: "lg" })}
						href={siteConfig.phoneHref}
					>
						<Phone />
						{siteConfig.phone}
					</a>
				</div>
			</div>
		</main>
	)
}
