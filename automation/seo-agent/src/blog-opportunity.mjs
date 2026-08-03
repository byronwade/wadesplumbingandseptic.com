/**
 * Inventory-aware blog opportunity selection and draft quality gates for the
 * Cron → Connect draft-PR path. Topics are curated for Santa Cruz County
 * plumbing and septic intent; selection skips URLs that already exist.
 */

const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MIN_BODY_WORDS = 850;
const MIN_H2 = 5;
const MIN_INTERNAL_LINKS = 3;

/**
 * Curated CREATE candidates. Stable slugs (no date suffix). Each topic must
 * prove a distinct homeowner intent not already covered by an existing post.
 */
export const BLOG_TOPIC_CATALOG = Object.freeze([
	Object.freeze({
		id: "garbage-disposal-care-santa-cruz",
		slug: "garbage-disposal-care-santa-cruz",
		query_cluster: "garbage disposal care Santa Cruz County",
		title_hint: "Garbage Disposal Care for Santa Cruz County Homes",
		angle:
			"Kitchen disposal habits that protect pipes and septic systems in Santa Cruz County homes, plus clear signs to stop DIY and call a pro.",
		category: "Plumbing Tips",
		tags: Object.freeze([
			"santa cruz",
			"garbage disposal",
			"plumbing maintenance",
			"kitchen drains",
		]),
		image: "/images/services/drain-clearing.webp",
		image_alt: "Kitchen plumbing and drain clearing equipment",
		preferred_links: Object.freeze([
			"/service-offerings/garbage-disposal-installation",
			"/service-offerings/drain-cleaning",
			"/service-offerings/commercial-drain-cleaning",
			"/contact",
			"/how-to-properly-clear-a-clogged-drain-a-step-by-step-guide",
		]),
		demand: 4,
		intent_fit: 5,
		cannibalization_risk: 1,
	}),
	Object.freeze({
		id: "tankless-water-heater-maintenance-santa-cruz",
		slug: "tankless-water-heater-maintenance-santa-cruz",
		query_cluster: "tankless water heater maintenance Santa Cruz",
		title_hint: "Tankless Water Heater Maintenance in Santa Cruz County",
		angle:
			"Coastal and hard-water realities that affect tankless units locally, safe homeowner upkeep limits, and when professional service protects the system.",
		category: "Plumbing Tips",
		tags: Object.freeze([
			"santa cruz",
			"tankless water heater",
			"water heater",
			"plumbing maintenance",
		]),
		image: "/images/services/water-heater-service.webp",
		image_alt: "Tankless water heater service context",
		preferred_links: Object.freeze([
			"/service-offerings/tankless-water-heater-installation",
			"/service-offerings/water-heater-installation",
			"/should-you-repair-or-replace-your-water-heater",
			"/what-is-hard-water-why-does-it-matter-for-your-home",
			"/contact",
		]),
		demand: 5,
		intent_fit: 5,
		cannibalization_risk: 1,
	}),
	Object.freeze({
		id: "hose-bib-winterizing-santa-cruz",
		slug: "hose-bib-winterizing-santa-cruz",
		query_cluster: "winterize outdoor faucet Santa Cruz County",
		title_hint: "Winterizing Outdoor Faucets in Santa Cruz County",
		angle:
			"Coastal winters still freeze exposed hose bibs in colder pockets of the county. Cover safe shutoff steps and damage signs without DIY pipe surgery.",
		category: "Plumbing Tips",
		tags: Object.freeze([
			"santa cruz",
			"hose bib",
			"winter plumbing",
			"frozen pipes",
		]),
		image: "/images/services/drain-clearing.webp",
		image_alt: "Outdoor plumbing fixture and pipe context",
		preferred_links: Object.freeze([
			"/how-to-prevent-frozen-pipes-this-winter",
			"/service-offerings/pipe-repair-and-replacement",
			"/service-offerings/leak-detection",
			"/contact",
			"/plumbing-maintenance-and-repairs-in-santa-cruz-county-ca",
		]),
		demand: 4,
		intent_fit: 4,
		cannibalization_risk: 2,
	}),
	Object.freeze({
		id: "backflow-prevention-homeowners-santa-cruz",
		slug: "backflow-prevention-homeowners-santa-cruz",
		query_cluster: "backflow prevention homeowners Santa Cruz",
		title_hint: "Backflow Prevention Basics for Santa Cruz Homeowners",
		angle:
			"Explain why backflow devices matter for irrigation and potable water, what homeowners can check visually, and when testing or installation needs a professional.",
		category: "Plumbing Tips",
		tags: Object.freeze([
			"santa cruz",
			"backflow prevention",
			"water safety",
			"irrigation",
		]),
		image: "/images/services/commercial-plumbing.webp",
		image_alt: "Backflow prevention assembly",
		preferred_links: Object.freeze([
			"/service-offerings/backflow-prevention-testing",
			"/service-offerings/backflow-prevention-installation",
			"/contact",
			"/faq",
		]),
		demand: 4,
		intent_fit: 5,
		cannibalization_risk: 1,
	}),
	Object.freeze({
		id: "washing-machine-hose-failures-santa-cruz",
		slug: "washing-machine-hose-failures-santa-cruz",
		query_cluster: "washing machine hose leak prevention Santa Cruz",
		title_hint: "Prevent Washing Machine Hose Failures at Home",
		angle:
			"Burst supply hoses cause major indoor flooding. Give a practical inspection checklist, replacement cadence guidance, and local urgency cues without inventing prices.",
		category: "Plumbing Tips",
		tags: Object.freeze([
			"santa cruz",
			"leak prevention",
			"washing machine",
			"home plumbing",
		]),
		image: "/images/services/drain-clearing.webp",
		image_alt: "Leak detection tools for home plumbing",
		preferred_links: Object.freeze([
			"/service-offerings/leak-detection",
			"/6-signs-you-have-a-hidden-water-leak",
			"/service-offerings/pipe-repair-and-replacement",
			"/contact",
		]),
		demand: 4,
		intent_fit: 4,
		cannibalization_risk: 1,
	}),
	Object.freeze({
		id: "septic-kitchen-habits-santa-cruz",
		slug: "septic-friendly-kitchen-habits-santa-cruz",
		query_cluster: "septic friendly kitchen habits Santa Cruz County",
		title_hint: "Septic-Friendly Kitchen Habits for Santa Cruz Homes",
		angle:
			"Help septic homeowners avoid grease, wipes, and disposer misuse that stress tanks and drainfields common across Santa Cruz County parcels.",
		category: "Septic Issues in Santa Cruz County",
		tags: Object.freeze([
			"santa cruz",
			"septic",
			"kitchen drains",
			"drain field",
		]),
		image: "/images/services/septic-pumping-illustration.webp",
		image_alt: "Septic system maintenance context",
		preferred_links: Object.freeze([
			"/service-offerings/septic-tank-cleaning-and-pumping",
			"/the-complete-guide-to-septic-system-maintenance",
			"/signs-your-drain-field-needs-professional-repair",
			"/service-offerings/grease-trap-cleaning",
			"/contact",
		]),
		demand: 5,
		intent_fit: 5,
		cannibalization_risk: 2,
	}),
]);

function inventoryUrls(inventory) {
	return new Set((inventory?.pages ?? []).map((page) => page.url));
}

function resolveLinkPlan(topic, urls) {
	const links = [];
	for (const to of topic.preferred_links) {
		if (!urls.has(to)) continue;
		const anchor =
			to.split("/").filter(Boolean).at(-1)?.replaceAll("-", " ") ??
			"related page";
		links.push(
			Object.freeze({
				to,
				anchor: anchor.slice(0, 48),
				reader_rationale: `Helps readers act on ${topic.query_cluster}.`,
			}),
		);
		if (links.length >= 5) break;
	}
	if (urls.has("/") && !links.some((link) => link.to === "/")) {
		links.push(
			Object.freeze({
				to: "/",
				anchor: "Wade's Plumbing & Septic",
				reader_rationale: "Gives readers a clear path back to the home site.",
			}),
		);
	}
	return Object.freeze(links.slice(0, 5));
}

function topicScore(topic) {
	return topic.demand * topic.intent_fit - topic.cannibalization_risk;
}

function similarExistingPost(urls, slug) {
	if (urls.has(`/${slug}`)) return `/${slug}`;
	const stem = slug.replace(/-santa-cruz(?:-county)?$/, "");
	for (const url of urls) {
		if (!url.startsWith("/") || url.split("/").length !== 2) continue;
		const existing = url.slice(1);
		if (
			existing.includes(stem) ||
			stem.includes(existing.replace(/-santa-cruz(?:-county)?$/, ""))
		) {
			if (existing.length > 12 && stem.length > 12) return url;
		}
	}
	return null;
}

/**
 * Picks the highest-scoring unused blog topic that can resolve enough
 * internal links from the repository inventory.
 */
export function selectBlogOpportunity({
	inventory,
	catalog = BLOG_TOPIC_CATALOG,
	runId,
} = {}) {
	if (!runId || typeof runId !== "string")
		throw new Error("Blog opportunity selection requires a run ID.");
	const urls = inventoryUrls(inventory);
	const considered = [];
	for (const topic of catalog) {
		if (!SAFE_SLUG.test(topic.slug))
			throw new Error(`Unsafe blog topic slug: ${topic.slug}`);
		const conflict = similarExistingPost(urls, topic.slug);
		const links = resolveLinkPlan(topic, urls);
		const viable =
			!conflict &&
			links.length >= MIN_INTERNAL_LINKS &&
			!urls.has(`/${topic.slug}`);
		considered.push(
			Object.freeze({
				id: topic.id,
				slug: topic.slug,
				score: topicScore(topic),
				viable,
				conflict,
				link_count: links.length,
			}),
		);
		if (!viable) continue;
	}
	const ranked = considered
		.filter((item) => item.viable)
		.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
	if (ranked.length === 0) {
		return Object.freeze({
			decision: "NO_ACTION",
			reason: "NO_VIABLE_DISTINCT_BLOG_TOPIC",
			considered: Object.freeze(considered),
		});
	}
	const chosen = catalog.find((topic) => topic.id === ranked[0].id);
	const links = resolveLinkPlan(chosen, urls);
	return Object.freeze({
		decision: "PROPOSE_FOR_HUMAN_REVIEW",
		selection_reason: "DISTINCT_LOCAL_BLOG_INTENT",
		considered: Object.freeze(considered),
		opportunity: Object.freeze({
			id: `proposal-${runId}`,
			slug: chosen.slug,
			owner_url: `/${chosen.slug}`,
			content_path: `content/posts/${chosen.slug}.md`,
			query_cluster: chosen.query_cluster,
			title_hint: chosen.title_hint,
			angle: chosen.angle,
			category: chosen.category,
			tags: chosen.tags,
			image: chosen.image,
			image_alt: chosen.image_alt,
			existing_page_assessment: "EXISTING_INSUFFICIENT",
			existing_page_decision: "CREATE_JUSTIFIED",
			evidence_ids: Object.freeze([
				"repository-inventory",
				`topic-catalog:${chosen.id}`,
			]),
			internal_links: links,
			internal_link: links[0].to,
		}),
	});
}

function wordCount(text) {
	return (text.trim().match(/\b[\w'-]+\b/g) ?? []).length;
}

function markdownLinks(text) {
	return [...text.matchAll(/\[[^\]]+\]\((\/[^)\s]+)\)/g)].map(
		(match) => match[1],
	);
}

/**
 * Fail-closed draft quality checks for Connect publication.
 */
export function assertPublishableBlogDraft(markdown, opportunity) {
	if (typeof markdown !== "string" || !markdown.trim()) {
		return Object.freeze({
			ok: false,
			reason: "EMPTY_DRAFT",
		});
	}
	const text = markdown.trim();
	if (!text.startsWith("---")) {
		return Object.freeze({ ok: false, reason: "MISSING_FRONTMATTER" });
	}
	if (!text.includes(`canonical: ${opportunity.owner_url}`)) {
		return Object.freeze({ ok: false, reason: "CANONICAL_MISMATCH" });
	}
	if (!/santa cruz/i.test(text)) {
		return Object.freeze({ ok: false, reason: "MISSING_LOCAL_CONTEXT" });
	}
	const h1 = (text.match(/^#\s+/gm) ?? []).length;
	const h2 = (text.match(/^##\s+/gm) ?? []).length;
	if (h1 !== 1) {
		return Object.freeze({ ok: false, reason: "INVALID_H1_COUNT" });
	}
	if (h2 < MIN_H2) {
		return Object.freeze({ ok: false, reason: "INSUFFICIENT_SECTIONS" });
	}
	if (!/^##\s+FAQ\b/im.test(text) && !/^###?\s+FAQ\b/im.test(text)) {
		return Object.freeze({ ok: false, reason: "MISSING_FAQ" });
	}
	const links = markdownLinks(text);
	const planned = new Set(opportunity.internal_links.map((link) => link.to));
	const matched = [...new Set(links.filter((href) => planned.has(href)))];
	if (matched.length < MIN_INTERNAL_LINKS) {
		return Object.freeze({
			ok: false,
			reason: "INSUFFICIENT_INTERNAL_LINKS",
			matched,
		});
	}
	if (wordCount(text) < MIN_BODY_WORDS) {
		return Object.freeze({ ok: false, reason: "TOO_THIN" });
	}
	if (
		/\b(?:serving|available in)\s+[A-Z][a-z]+/i.test(text) ||
		/\b(?:licensed|insured|bonded)\b/i.test(text) ||
		/\b24\s*\/\s*7\b/i.test(text) ||
		/\$\d/.test(text)
	) {
		return Object.freeze({ ok: false, reason: "UNSUPPORTED_MARKETING_CLAIM" });
	}
	return Object.freeze({
		ok: true,
		reason: null,
		word_count: wordCount(text),
		internal_links: matched,
	});
}

export function buildWriterPrompt({ opportunity, date }) {
	const linkLines = opportunity.internal_links
		.map((link) => `- [${link.anchor}](${link.to}): ${link.reader_rationale}`)
		.join("\n");
	const tagLines = opportunity.tags.map((tag) => `  - ${tag}`).join("\n");
	return `You write for Wade's Plumbing & Septic, a real Santa Cruz County plumbing and septic company website.

Return ONLY Markdown with YAML front matter. No code fences.

Topic angle (follow closely):
${opportunity.angle}

Query cluster to satisfy: ${opportunity.query_cluster}
Suggested title: ${opportunity.title_hint}

Required front matter (use these exact keys; improve title/description copy):
title: ${opportunity.title_hint}
description: <one useful sentence, under 160 characters, mention Santa Cruz County when natural>
category: ${opportunity.category}
date: "${date}"
tags:
${tagLines}
image: ${opportunity.image}
imageAlt: "${opportunity.image_alt}"
canonical: ${opportunity.owner_url}
query_cluster: ${opportunity.query_cluster}
evidence_ids: [${opportunity.evidence_ids.join(", ")}]

Required structure:
1. Exactly one H1 matching the title.
2. A short "Quick Answer for Santa Cruz County Homeowners" H2 with 3 to 5 concrete bullets.
3. At least ${MIN_H2} total H2 sections with practical homeowner guidance.
4. An H2 or H3 named exactly "FAQ" with at least 3 question/answer pairs.
5. A short closing CTA that links to /contact without inventing response times.
6. At least ${MIN_INTERNAL_LINKS} contextual Markdown links using these approved destinations (use the paths exactly; vary anchor text naturally):
${linkLines}

Local SEO requirements:
- Mention Santa Cruz County as the homeowner context in the intro and at least one later section.
- You may name common local conditions in plain language (coastal moisture, older housing stock, septic parcels) without inventing statistics.
- Do NOT write doorway city pages or keyword stuffing.
- Do NOT claim the company is "serving", "available in", licensed, insured, bonded, 24/7, same-day, guaranteed, or quote prices.
- Do NOT invent reviews, jobs, case studies, permits, or competitor content.
- Do NOT give dangerous DIY steps (no torch work, no trench digging, no electrical panel work, no chemical drain bombing). Prefer stop-and-call-a-pro guidance when risk rises.

Length: ${MIN_BODY_WORDS} to 1,600 words. Useful and specific beats fluffy filler.`;
}
