import { ContactCta } from "@/components/contact-cta"

/**
 * Desktop rail beside an expert tip: a jump list of the article's sections and
 * a compact call card, so the wide margin next to the body copy does work.
 */
export function ArticleAside({
	headings,
}: {
	headings: Array<{ id: string; text: string }>
}) {
	return (
		<aside className="hidden min-w-0 lg:block">
			<div className="sticky top-[calc(var(--header-h)+2rem)] flex flex-col gap-[var(--space-grid)]">
				{headings.length >= 3 ? (
					<nav
						aria-label="In this guide"
						className="border-border border-l pl-5"
					>
						<p className="spec-label">In this guide</p>
						<ol className="mt-4 grid gap-2.5 text-sm">
							{headings.map((heading) => (
								<li key={heading.id}>
									<a
										className="text-muted-foreground hover:text-primary leading-snug font-semibold transition-colors"
										href={`#${heading.id}`}
									>
										{heading.text}
									</a>
								</li>
							))}
						</ol>
					</nav>
				) : null}
				<ContactCta
					compact
					description="Tell us what you are seeing. We will explain the likely cause and your options before any work begins."
					showCall
					title="Want a pro to look?"
				/>
			</div>
		</aside>
	)
}
