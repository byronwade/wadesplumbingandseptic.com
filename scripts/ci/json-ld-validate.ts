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
		else issues.push(...jsonLdTypeIssues(block, `${source}[${index}]`))
	}
	return issues
}
