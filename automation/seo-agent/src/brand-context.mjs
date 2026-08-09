import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

export const BRAND_CONTEXT_RELATIVE = "seo/manifests/brand-context.json";

function readManifest(repoRoot, relativePath) {
	if (!repoRoot) return null;
	const path = join(repoRoot, relativePath);
	if (!statSync(path, { throwIfNoEntry: false })?.isFile()) return null;
	return JSON.parse(readFileSync(path, "utf8"));
}

/**
 * Validates the Git-backed brand context registry.
 * Brand context is durable repository state, never Blob-first.
 */
export function assertBrandContext(registry) {
	if (!registry || typeof registry !== "object") {
		throw new Error("Brand context registry is missing.");
	}
	if (registry.schema_version !== "1.0") {
		throw new Error("Unsupported brand context schema version");
	}
	if (!registry.product?.name || !registry.product?.one_liner) {
		throw new Error("Brand context is missing product identity fields.");
	}
	if (!registry.positioning?.primary) {
		throw new Error("Brand context is missing primary positioning.");
	}
	if (
		!Array.isArray(registry.voice?.tone) ||
		registry.voice.tone.length === 0
	) {
		throw new Error("Brand context voice.tone must be a non-empty array.");
	}
	if (!Array.isArray(registry.banned_phrases)) {
		throw new Error("Brand context banned_phrases must be an array.");
	}
	if (!registry.cta?.primary) {
		throw new Error("Brand context is missing primary CTA.");
	}
	if (!registry.geo?.primary_market) {
		throw new Error("Brand context is missing primary_market.");
	}
	if (!Array.isArray(registry.pending_review)) {
		throw new Error("Brand context pending_review must be an array.");
	}
	return registry;
}

/**
 * Loads brand context from the repository checkout or snapshot.
 */
export function loadBrandContext({ repoRoot } = {}) {
	const registry = readManifest(repoRoot, BRAND_CONTEXT_RELATIVE);
	if (!registry) return null;
	return Object.freeze(assertBrandContext(registry));
}

/**
 * Builds a compact brief suitable for specialist packets and PR notes.
 */
export function brandContextBrief(registry) {
	const brand = assertBrandContext(registry);
	return Object.freeze({
		name: brand.product.name,
		one_liner: brand.product.one_liner,
		audience: brand.product.audience,
		positioning: brand.positioning.primary,
		differentiators: Object.freeze([
			...(brand.positioning.differentiators ?? []),
		]),
		tone: Object.freeze([...(brand.voice.tone ?? [])]),
		prefer: Object.freeze([...(brand.voice.prefer ?? [])]),
		avoid: Object.freeze([...(brand.voice.avoid ?? [])]),
		banned_phrases: Object.freeze([...(brand.banned_phrases ?? [])]),
		cta_primary: brand.cta.primary,
		primary_market: brand.geo.primary_market,
		required_local_hooks: Object.freeze([
			...(brand.geo.required_local_hooks ?? []),
		]),
	});
}

const EM_DASH = /\u2014/;
const EN_DASH = /\u2013/;
// Spaced hyphen asides only (word - word). Do not match Markdown list markers (`\n- item`).
const SPACED_HYPHEN_ASIDE = /(?<=\S) - (?=\S)/;

/**
 * Deterministic writing-quality + brand-voice lint for draft Markdown.
 * Returns ok:false with a stable reason code when style or brand rules fail.
 */
export function lintDraftAgainstBrand(markdown, registry) {
	if (typeof markdown !== "string" || !markdown.trim()) {
		return Object.freeze({ ok: false, reason: "EMPTY_DRAFT", matches: [] });
	}
	const brand = assertBrandContext(registry);
	const text = markdown;
	const lower = text.toLowerCase();

	if (
		EM_DASH.test(text) ||
		EN_DASH.test(text) ||
		SPACED_HYPHEN_ASIDE.test(text)
	) {
		return Object.freeze({
			ok: false,
			reason: "BANNED_DASH_PUNCTUATION",
			matches: ["dash punctuation"],
		});
	}

	const phraseHits = [];
	for (const phrase of brand.banned_phrases ?? []) {
		if (typeof phrase !== "string" || !phrase.trim()) continue;
		if (lower.includes(phrase.toLowerCase())) phraseHits.push(phrase);
	}
	if (phraseHits.length > 0) {
		return Object.freeze({
			ok: false,
			reason: "BANNED_BRAND_PHRASE",
			matches: Object.freeze(phraseHits),
		});
	}

	const hooks = brand.geo?.required_local_hooks ?? [];
	for (const hook of hooks) {
		if (typeof hook !== "string" || !hook.trim()) continue;
		if (
			!new RegExp(hook.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(text)
		) {
			return Object.freeze({
				ok: false,
				reason: "MISSING_BRAND_LOCAL_HOOK",
				matches: [hook],
			});
		}
	}

	return Object.freeze({ ok: true, reason: null, matches: Object.freeze([]) });
}

/**
 * Propose a brand-context patch for human review via draft PR.
 * Does not write the Git working tree; callers must publish through Connect.
 */
export function proposeBrandContextPatch(current, patch) {
	const base = assertBrandContext(current);
	if (!patch || typeof patch !== "object") {
		throw new Error("Brand context patch must be an object.");
	}
	const next = {
		...base,
		...patch,
		schema_version: "1.0",
		product: { ...base.product, ...(patch.product ?? {}) },
		positioning: { ...base.positioning, ...(patch.positioning ?? {}) },
		voice: { ...base.voice, ...(patch.voice ?? {}) },
		cta: { ...base.cta, ...(patch.cta ?? {}) },
		geo: { ...base.geo, ...(patch.geo ?? {}) },
		banned_phrases: Array.isArray(patch.banned_phrases)
			? patch.banned_phrases
			: base.banned_phrases,
		pending_review: Array.isArray(patch.pending_review)
			? patch.pending_review
			: [
					...(base.pending_review ?? []),
					{
						id: `brand-patch-${new Date().toISOString().slice(0, 10)}`,
						review_status: "PENDING_HUMAN_APPROVAL",
						reason:
							"Agent proposed brand-context update; human must merge via draft PR.",
					},
				],
	};
	return Object.freeze(assertBrandContext(next));
}
