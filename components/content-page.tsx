import type { ContentDocument } from "@/lib/content"

import { ContactCta } from "@/components/contact-cta"
import { ContentHero } from "@/components/content-hero"
import { MarkdownContent } from "@/components/markdown-content"

export function ContentPage({
	document,
	isPost = false,
}: {
	document: ContentDocument
	isPost?: boolean
}) {
	return (
		<main id="main-content">
			<ContentHero
				description={document.description}
				eyebrow={document.eyebrow ?? document.category}
				image={document.image}
				imageAlt={document.imageAlt}
				parent={
					isPost ? { href: "/expert-tips", label: "Expert Tips" } : undefined
				}
				title={document.title}
			/>
			<article className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:px-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:py-20">
				<div>
					{isPost && document.date ? (
						<p className="text-muted-foreground mb-8 text-sm font-bold">
							Published{" "}
							<time dateTime={document.date}>
								{new Intl.DateTimeFormat("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
									timeZone: "UTC",
								}).format(new Date(`${document.date}T00:00:00Z`))}
							</time>
							{document.updated ? ` · Updated ${document.updated}` : null}
						</p>
					) : null}
					<MarkdownContent content={document.content} />
				</div>
				<aside className="lg:sticky lg:top-28 lg:self-start">
					<ContactCta
						compact
						description="Tell us what is happening and get practical options from a local licensed team."
						title="Need help with this?"
					/>
				</aside>
			</article>
			<ContactCta />
		</main>
	)
}
