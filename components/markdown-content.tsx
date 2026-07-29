import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

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
				sizes="(min-width: 1024px) 48rem, 100vw"
				src={src}
				width={1600}
			/>
		</figure>
	)
}

export function MarkdownContent({ content }: { content: string }) {
	return (
		<div className="prose prose-neutral max-w-none">
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
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	)
}
