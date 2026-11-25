/** Schema.org types this site is allowed to emit. */
export const allowedJsonLdTypes = new Set([
	"AdministrativeArea",
	"Answer",
	"Article",
	"BlogPosting",
	"Brand",
	"BreadcrumbList",
	"CollectionPage",
	"ContactPoint",
	"DefinedTerm",
	"DefinedTermSet",
	"EducationalOccupationalCredential",
	"FAQPage",
	"GeoCoordinates",
	"GovernmentOrganization",
	"HomeAndConstructionBusiness",
	"ImageObject",
	"ItemList",
	"ListItem",
	"LocalBusiness",
	"Offer",
	"OfferCatalog",
	"OpeningHoursSpecification",
	"Organization",
	"Place",
	"Plumber",
	"PostalAddress",
	"PropertyValue",
	"Question",
	"Service",
	"ServiceChannel",
	"WebPage",
	"WebSite",
])

export type JsonLdNode = Record<string, unknown>

function schemaTypes(value: unknown) {
	if (typeof value === "string") return [value]
	if (Array.isArray(value))
		return value.filter((entry): entry is string => typeof entry === "string")
	return []
}

export function collectJsonLdNodes(data: unknown): JsonLdNode[] {
	const nodes: JsonLdNode[] = []

	function visit(value: unknown) {
		if (Array.isArray(value)) {
			value.forEach(visit)
			return
		}
		if (!value || typeof value !== "object") return
		const record = value as JsonLdNode
		if (record["@graph"]) visit(record["@graph"])
		if (record["@type"]) nodes.push(record)
		for (const child of Object.values(record)) visit(child)
	}

	visit(data)
	return nodes
}

export function jsonLdTypeIssues(data: unknown, source = "$"): string[] {
	const issues: string[] = []
	for (const node of collectJsonLdNodes(data)) {
		for (const type of schemaTypes(node["@type"])) {
			if (!allowedJsonLdTypes.has(type))
				issues.push(`${source}: unsupported schema.org type ${type}`)
		}
	}
	return issues
}

export function parseJsonLdScripts(html: string): unknown[] {
	const blocks: unknown[] = []
	const pattern =
		/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
	for (const match of html.matchAll(pattern)) {
		const raw = match[1]
			?.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&amp;/g, "&")
			.replace(/&quot;/g, '"')
			.trim()
		if (!raw) continue
		try {
			blocks.push(JSON.parse(raw))
		} catch {
			blocks.push({ __parseError: true, raw })
		}
	}
	return blocks
}

export function jsonLdParseIssues(blocks: unknown[], source: string): string[] {
	const issues: string[] = []
	for (const [index, block] of blocks.entries()) {
		if (
			block &&
			typeof block === "object" &&
			"__parseError" in (block as JsonLdNode)
		)
			issues.push(`${source}: JSON-LD block ${index} does not parse`)
		else {
			issues.push(...jsonLdTypeIssues(block, `${source}[${index}]`))
			issues.push(...jsonLdRequiredFieldIssues(block, `${source}[${index}]`))
		}
	}
	return issues
}

function hasField(node: JsonLdNode, key: string) {
	const value = node[key]
	if (typeof value === "string") return value.trim().length > 0
	if (typeof value === "number") return Number.isFinite(value)
	if (Array.isArray(value)) return value.length > 0
	return Boolean(value && typeof value === "object")
}

function isStandaloneService(node: JsonLdNode) {
	const id = typeof node["@id"] === "string" ? node["@id"] : ""
	return (
		id.endsWith("#service") ||
		hasField(node, "availableChannel") ||
		hasField(node, "hoursAvailable")
	)
}

/**
 * Required fields for the schema.org types this site publishes. Nested
 * Service nodes inside an OfferCatalog only need a name (the catalog is
 * the listing, not a bookable Service page).
 */
export function jsonLdRequiredFieldIssues(
	data: unknown,
	source = "$",
): string[] {
	const issues: string[] = []

	for (const node of collectJsonLdNodes(data)) {
		const types = schemaTypes(node["@type"])
		const here = `${source}:${types.join("|") || "node"}`

		if (types.includes("Plumber") || types.includes("LocalBusiness")) {
			for (const field of ["name", "telephone", "url", "address"] as const) {
				if (!hasField(node, field)) issues.push(`${here}: missing ${field}`)
			}
			const address = node.address
			if (address && typeof address === "object" && !Array.isArray(address)) {
				const addr = address as JsonLdNode
				for (const field of [
					"streetAddress",
					"addressLocality",
					"addressRegion",
					"postalCode",
				] as const) {
					if (!hasField(addr, field))
						issues.push(`${here}: missing address.${field}`)
				}
			}
		}

		if (types.includes("Service")) {
			if (!hasField(node, "name")) issues.push(`${here}: missing name`)
			if (isStandaloneService(node)) {
				for (const field of [
					"provider",
					"areaServed",
					"description",
				] as const) {
					if (!hasField(node, field)) issues.push(`${here}: missing ${field}`)
				}
			}
		}

		if (types.includes("FAQPage")) {
			const main = node.mainEntity
			if (!Array.isArray(main) || main.length === 0) {
				issues.push(`${here}: missing mainEntity questions`)
			} else {
				main.forEach((item, index) => {
					if (!item || typeof item !== "object") {
						issues.push(`${here}.mainEntity[${index}]: not a Question`)
						return
					}
					const question = item as JsonLdNode
					if (!hasField(question, "name"))
						issues.push(`${here}.mainEntity[${index}]: missing name`)
					const answer = question.acceptedAnswer
					if (!answer || typeof answer !== "object") {
						issues.push(`${here}.mainEntity[${index}]: missing acceptedAnswer`)
						return
					}
					if (!hasField(answer as JsonLdNode, "text"))
						issues.push(
							`${here}.mainEntity[${index}]: missing acceptedAnswer.text`,
						)
				})
			}
		}

		if (types.includes("BlogPosting")) {
			for (const field of [
				"headline",
				"image",
				"datePublished",
				"author",
			] as const) {
				if (!hasField(node, field)) issues.push(`${here}: missing ${field}`)
			}
		}

		if (types.includes("BreadcrumbList")) {
			const items = node.itemListElement
			if (!Array.isArray(items) || items.length === 0) {
				issues.push(`${here}: missing itemListElement`)
			} else {
				items.forEach((item, index) => {
					if (!item || typeof item !== "object") {
						issues.push(`${here}.itemListElement[${index}]: not a ListItem`)
						return
					}
					const entry = item as JsonLdNode
					if (typeof entry.position !== "number")
						issues.push(`${here}.itemListElement[${index}]: missing position`)
					if (!hasField(entry, "name"))
						issues.push(`${here}.itemListElement[${index}]: missing name`)
					if (!hasField(entry, "item") && !hasField(entry, "@id"))
						issues.push(`${here}.itemListElement[${index}]: missing item`)
				})
			}
		}
	}

	return issues
}
