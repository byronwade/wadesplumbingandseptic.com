export type GlossaryTopic = "plumbing" | "septic"

export type GlossaryTerm = {
	slug: string
	term: string
	alsoKnownAs?: string[]
	/** Card + meta description (about 140 to 160 characters). */
	shortDefinition: string
	/** Primary definition body (plain text paragraphs separated by blank lines). */
	definition: string
	/** Local Santa Cruz / Central Coast relevance. */
	localContext: string
	/** Practical homeowner takeaway. */
	homeownerTip: string
	relatedServiceSlugs: string[]
	/** Other term slugs in the same topic. */
	relatedTermSlugs: string[]
}

export type GlossaryHub = {
	topic: GlossaryTopic
	title: string
	eyebrow: string
	description: string
	intro: string[]
	image: string
	imageAlt: string
}
