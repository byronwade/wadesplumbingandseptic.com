export type HtmlLink = {
	href: string
	text: string
}

export type HtmlImage = {
	src: string
	alt: string | null
	width: string | null
	height: string | null
	fill: boolean
}

function attr(openTag: string, name: string) {
	const match = openTag.match(
		new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"),
	)
	return match?.[1] ?? match?.[2] ?? null
}

export function stripNonMarkup(html: string) {
	return html
		.replace(/<script[\s\S]*?<\/script>/gi, " ")
		.replace(/<style[\s\S]*?<\/style>/gi, " ")
		.replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
}

export function pageTitle(html: string) {
	return html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? ""
}

export function metaDescription(html: string) {
	return (
		html.match(
			/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i,
		)?.[1] ??
		html.match(
			/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i,
		)?.[1] ??
		""
	)
}

export function canonicalHref(html: string) {
	return (
		html.match(
			/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i,
		)?.[1] ??
		html.match(
			/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i,
		)?.[1]
	)
}

export function extractIds(html: string) {
	const ids = new Set<string>()
	const markup = stripNonMarkup(html)
	for (const match of markup.matchAll(
		/\b(?:id|name)\s*=\s*(?:"([^"]+)"|'([^']+)')/gi,
	)) {
		const value = match[1] ?? match[2]
		if (value) ids.add(value)
	}
	return ids
}

export function extractLinks(html: string): HtmlLink[] {
	const links: HtmlLink[] = []
	const markup = stripNonMarkup(html)
	for (const match of markup.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
		const href = attr(match[1] ?? "", "href")
		if (href === null) continue
		const text = (match[2] ?? "")
			.replace(/<[^>]+>/g, " ")
			.replace(/\s+/g, " ")
			.trim()
		links.push({ href, text })
	}
	return links
}

export function extractImages(html: string): HtmlImage[] {
	const images: HtmlImage[] = []
	const markup = stripNonMarkup(html)
	for (const match of markup.matchAll(/<img\b([^>]*)>/gi)) {
		const open = match[1] ?? ""
		const src = attr(open, "src")
		if (!src) continue
		const nimg = attr(open, "data-nimg")
		const style = attr(open, "style") ?? ""
		images.push({
			src,
			alt: attr(open, "alt"),
			width: attr(open, "width"),
			height: attr(open, "height"),
			fill:
				nimg === "fill" ||
				/position:\s*absolute/i.test(style) ||
				/\binset-0\b/.test(open),
		})
	}
	return images
}

export function headingCount(html: string) {
	return [...stripNonMarkup(html).matchAll(/<h1\b/gi)].length
}

export function visiblePageText(html: string) {
	return stripNonMarkup(html)
		.replace(/<[^>]+>/g, " ")
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&apos;|&#39;|&#x27;/gi, "'")
		.replace(/&quot;/g, '"')
		.replace(/\s+/g, " ")
		.trim()
}

export function visibleLead(html: string) {
	return visiblePageText(html).slice(0, 4000)
}

const skipHref = /^(?:mailto:|javascript:|data:|blob:|#$)/i

export function classifyHref(href: string) {
	const trimmed = href.trim()
	if (!trimmed) return { kind: "empty" as const }
	if (skipHref.test(trimmed)) return { kind: "skip" as const }
	if (trimmed.toLowerCase().startsWith("tel:")) return { kind: "tel" as const }
	if (trimmed.startsWith("#"))
		return { kind: "fragment" as const, href: trimmed }
	if (/^https?:\/\//i.test(trimmed))
		return { kind: "absolute" as const, href: trimmed }
	if (trimmed.startsWith("//"))
		return { kind: "protocol-relative" as const, href: trimmed }
	if (trimmed.startsWith("/"))
		return { kind: "internal" as const, href: trimmed }
	return { kind: "relative" as const, href: trimmed }
}

export function resolveInternalHref(
	href: string,
	pagePathname: string,
	origin: string,
) {
	const classified = classifyHref(href)
	if (
		classified.kind === "skip" ||
		classified.kind === "tel" ||
		classified.kind === "empty"
	)
		return null
	if (classified.kind === "fragment") {
		return { pathname: pagePathname, hash: classified.href.slice(1) }
	}

	const base = `${origin}${pagePathname === "/" ? "/" : pagePathname}`
	let url: URL
	try {
		if (classified.kind === "absolute") url = new URL(classified.href)
		else if (classified.kind === "protocol-relative")
			url = new URL(`http:${classified.href}`)
		else url = new URL(classified.href, base)
	} catch {
		return { pathname: href, hash: "", invalid: true as const }
	}

	if (url.origin !== origin && classified.kind === "absolute") {
		return { pathname: url.pathname, hash: url.hash.slice(1), external: true }
	}

	return {
		pathname: url.pathname || "/",
		hash: url.hash.slice(1),
		search: url.search,
	}
}

export function decodeFragment(hash: string) {
	try {
		return decodeURIComponent(hash)
	} catch {
		return hash
	}
}
