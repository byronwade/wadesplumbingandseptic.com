import type { Metadata } from "next"
import { cacheLife, cacheTag } from "next/cache"

import { GlossaryTopicHub } from "@/components/glossary-hub"
import { getGlossaryTerms, glossaryHubs } from "@/lib/glossary"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
	title: glossaryHubs.plumbing.title,
	description: glossaryHubs.plumbing.description,
	pathname: "/glossary/plumbing",
	image: glossaryHubs.plumbing.image,
})

async function PlumbingGlossaryBody() {
	"use cache"
	cacheTag("glossary:plumbing")
	cacheLife("max")

	const terms = await getGlossaryTerms("plumbing")
	return (
		<GlossaryTopicHub
			hub={glossaryHubs.plumbing}
			otherTopic={{ topic: "septic", label: "Septic Glossary" }}
			terms={terms}
		/>
	)
}

export default function PlumbingGlossaryPage() {
	return <PlumbingGlossaryBody />
}
