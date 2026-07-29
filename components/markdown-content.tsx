import type { Route } from "next"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function MarkdownContent({ content }: { content: string }) {
	return (
		<div className="prose prose-neutral max-w-none">
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					a: ({ href = "", children, ...props }) => {
						if (href.startsWith("/")) {
							return (
								<Link href={href as Route} prefetch {...props}>
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
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	)
}
