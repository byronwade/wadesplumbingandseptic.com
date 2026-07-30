import type { Metadata } from "next"
import { cacheLife, cacheTag } from "next/cache"

import { GlossaryTopicHub } from "@/components/glossary-hub"
import {
	getGlossaryTerms,
	glossaryHubs,
} from "@/lib/glossary"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
	title: glossaryHubs.septic.title,
	description: glossaryHubs.septic.description,
	pathname: "/glossary/septic",
	image: glossaryHubs.septic.image,
})

async function SepticGlossaryBody() {
	"use cache"
	cacheTag("glossary:septic")
	cacheLife("max")

	const terms = await getGlossaryTerms("septic")
	return (
		<GlossaryTopicHub
			hub={glossaryHubs.septic}
			otherTopic={{ topic: "plumbing", label: "Plumbing Glossary" }}
			terms={terms}
		/>
	)
}

export default function SepticGlossaryPage() {
	return <SepticGlossaryBody />
}
