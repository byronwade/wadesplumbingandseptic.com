/**
 * Server-rendered FAQ. Radix accordion was a client island on the homepage
 * and pulled hydration into the LCP critical path under Lantern Slow 4G.
 */
export function HomeFaq({
	faqs,
}: {
	faqs: Array<{ question: string; answer: string }>
}) {
	return (
		<div className="divide-border border-border divide-y rounded-xl border">
			{faqs.map((faq) => (
				<details className="group px-5 py-1" key={faq.question}>
					<summary className="focus-visible:ring-ring cursor-pointer list-none rounded-sm py-4 text-sm font-bold tracking-[-0.02em] outline-none marker:content-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)] [&::-webkit-details-marker]:hidden">
						<span className="flex items-center justify-between gap-4">
							{faq.question}
							<span
								aria-hidden="true"
								className="text-muted-foreground text-lg leading-none transition group-open:rotate-45"
							>
								+
							</span>
						</span>
					</summary>
					<p className="text-muted-foreground pb-4 text-sm leading-relaxed">
						{faq.answer}
					</p>
				</details>
			))}
		</div>
	)
}
