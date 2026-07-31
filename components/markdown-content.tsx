import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { ProtectedContactLink } from "@/components/protected-contact"
import { cn } from "@/lib/utils"

function MarkdownImage({ src, alt }: { src?: string; alt?: string }) {
	if (!src) return null

	const isLocal = src.startsWith("/")

	if (!isLocal) {
		return (
			<a
				className="text-primary my-6 inline-flex font-semibold underline-offset-4 hover:underline"
				href={src}
				rel="noreferrer"
				target="_blank"
			>
				{alt || "View image"}
			</a>
		)
	}

	return (
		<figure className="bg-muted my-8 overflow-hidden rounded-lg">
			<Image
				alt={alt?.trim() || "Wade's Plumbing & Septic project photo"}
				className="h-auto w-full object-cover"
				height={900}
				sizes="(min-width: 1024px) 40rem, 100vw"
				src={src}
				width={1600}
			/>
		</figure>
	)
}

/*
 * The measure comes from .prose (--measure, ~75 characters a line). It used to
 * carry max-w-none, so body copy ran the full width of the article column -
 * around 95 characters a line on desktop.
 */
export function MarkdownContent({
	className,
	content,
	/** Pages that already render an H1 in ContentHero should demote markdown #. */
	demoteH1 = false,
}: {
	className?: string
	content: string
	demoteH1?: boolean
}) {
	return (
		<div className={cn("prose", className)}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					a: ({ href = "", children, ...props }) => {
						if (href.startsWith("/")) {
							return (
								<Link href={href as Route} prefetch={false} {...props}>
									{children}
								</Link>
							)
						}

						// Keep visible link text; apply real tel:/mailto: only on the client
						// so scrapers do not harvest contiguous contact hrefs from HTML.
						if (href.startsWith("tel:")) {
							return (
								<ProtectedContactLink kind="phone" {...props}>
									{children}
								</ProtectedContactLink>
							)
						}

						if (href.startsWith("mailto:")) {
							return (
								<ProtectedContactLink kind="email" {...props}>
									{children}
								</ProtectedContactLink>
							)
						}

						return (
							<a href={href} rel="noreferrer" target="_blank" {...props}>
								{children}
							</a>
						)
					},
					img: ({ src, alt }) => (
						<MarkdownImage
							alt={alt}
							src={typeof src === "string" ? src : undefined}
						/>
					),
					...(demoteH1
						? {
								h1: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
							}
						: {}),
					// Wide tables scroll inside their own box instead of pushing the
					// page sideways on narrow screens.
					table: ({ children, ...props }) => (
						<div className="table-scroll">
							<table {...props}>{children}</table>
						</div>
					),
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	)
}
