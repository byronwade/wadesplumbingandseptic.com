/**
 * Content-relevant image selection for Eve blog drafts.
 *
 * Featured images are fail-closed and first-party only until a human-approved
 * licensed asset path exists. External research candidates may be listed for
 * review but never become publication-eligible on their own.
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const IMAGE_EXTENSIONS = new Set([".avif", ".webp", ".jpg", ".jpeg", ".png"]);
const FEATURED_MIN_SCORE = 18;
const INLINE_MIN_SCORE = 10;
const MAX_INLINE_CANDIDATES = 5;
const MAX_EXTERNAL_CANDIDATES = 5;

/** Paths that must never be blog featured images. */
const FEATURED_BLOCKED_PREFIXES = Object.freeze([
	"public/images/brand/",
	"public/images/partners/",
	"public/images/team/",
]);

/** Filename tokens that indicate low-relevance or brand-only assets. */
const FEATURED_BLOCKED_TOKENS = Object.freeze([
	"logo",
	"cropped-wadeslogo",
	"apple-touch-icon",
	"wades-mark",
	"bolivia", // known misleading geo filename in legacy wordpress set
]);

const STOP_WORDS = new Set([
	"a",
	"an",
	"and",
	"for",
	"from",
	"in",
	"of",
	"on",
	"or",
	"the",
	"to",
	"with",
	"your",
	"you",
	"home",
	"homes",
	"county",
	"santa",
	"cruz", // too common alone; still scored via bigrams / compound tokens
	"guide",
	"tips",
	"what",
	"when",
	"how",
	"why",
	"that",
	"this",
	"into",
	"over",
	"under",
]);

function normalizeToken(token) {
	return token.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function tokenizeImageText(value) {
	if (typeof value !== "string" || !value.trim()) return Object.freeze([]);
	const parts = value
		.toLowerCase()
		.split(/[^a-z0-9]+/g)
		.map(normalizeToken)
		.filter((token) => token.length >= 3 && !STOP_WORDS.has(token));
	return Object.freeze([...new Set(parts)]);
}

function pathTokens(relativePath) {
	const base = relativePath.replace(/^public\/images\//, "");
	return tokenizeImageText(base.replace(/[/.]/g, " "));
}

function publicUrlForAsset(assetPath) {
	return `/${assetPath.replace(/^public\//, "")}`;
}

function isFeaturedBlockedPath(assetPath) {
	const normalized = assetPath.replaceAll("\\", "/");
	if (FEATURED_BLOCKED_PREFIXES.some((prefix) => normalized.startsWith(prefix)))
		return true;
	const lower = normalized.toLowerCase();
	return FEATURED_BLOCKED_TOKENS.some((token) => lower.includes(token));
}

function walkImageFiles(rootDir, baseDir = rootDir, acc = []) {
	if (!existsSync(rootDir)) return acc;
	for (const entry of readdirSync(rootDir, { withFileTypes: true })) {
		const full = join(rootDir, entry.name);
		if (entry.isDirectory()) {
			walkImageFiles(full, baseDir, acc);
			continue;
		}
		if (!entry.isFile()) continue;
		const lower = entry.name.toLowerCase();
		const ext = lower.includes(".") ? `.${lower.split(".").pop()}` : "";
		if (!IMAGE_EXTENSIONS.has(ext)) continue;
		acc.push(full);
	}
	return acc;
}

/**
 * Index first-party images under public/images for offline relevance matching.
 */
export function indexFirstPartyImages({ repoRoot } = {}) {
	if (typeof repoRoot !== "string" || !repoRoot)
		throw new Error("First-party image index requires repoRoot.");
	const imagesRoot = join(repoRoot, "public", "images");
	const files = walkImageFiles(imagesRoot);
	return Object.freeze(
		files.map((absolutePath) => {
			const assetPath = relative(repoRoot, absolutePath).split(sep).join("/");
			const tokens = pathTokens(assetPath);
			const stats = statSync(absolutePath);
			return Object.freeze({
				asset_path: assetPath,
				public_url: publicUrlForAsset(assetPath),
				tokens,
				bytes: stats.size,
				featured_blocked: isFeaturedBlockedPath(assetPath),
				usage_rights: "OWNED",
				rights_evidence_id: `repository-asset:${assetPath}`,
				source_url: `https://www.wadesplumbingandseptic.com${publicUrlForAsset(assetPath)}`,
			});
		}),
	);
}

function opportunityTokens(opportunity) {
	const bags = [
		opportunity?.query_cluster,
		opportunity?.slug,
		opportunity?.click_title,
		opportunity?.title_hint,
		opportunity?.unique_value,
		opportunity?.angle,
		opportunity?.image_alt,
		...(opportunity?.tags ?? []),
		...(opportunity?.must_cover ?? []),
	];
	const tokens = new Set();
	for (const value of bags) {
		for (const token of tokenizeImageText(value)) tokens.add(token);
	}
	return Object.freeze([...tokens]);
}

/**
 * Score how directly an image relates to a blog opportunity.
 * Higher is better. Featured selection requires FEATURED_MIN_SCORE.
 */
export function scoreImageRelevance({ asset, opportunity } = {}) {
	if (!asset || typeof asset !== "object")
		throw new Error("scoreImageRelevance requires an asset.");
	if (!opportunity || typeof opportunity !== "object")
		throw new Error("scoreImageRelevance requires an opportunity.");
	const needed = opportunityTokens(opportunity);
	const have = new Set(asset.tokens ?? []);
	if (needed.length === 0 || have.size === 0) {
		return Object.freeze({
			score: 0,
			matched_tokens: Object.freeze([]),
			reasons: Object.freeze(["No overlapping content tokens."]),
		});
	}
	const matched = needed.filter((token) => have.has(token));
	let score = matched.length * 4;
	const reasons = [];
	if (matched.length > 0) {
		reasons.push(`Matched tokens: ${matched.slice(0, 8).join(", ")}.`);
	}
	const slug = tokenizeImageText(opportunity.slug ?? "");
	const slugHits = slug.filter((token) => have.has(token));
	if (slugHits.length > 0) {
		score += slugHits.length * 3;
		reasons.push("Filename/path aligns with the post slug.");
	}
	const query = tokenizeImageText(opportunity.query_cluster ?? "");
	const queryHits = query.filter((token) => have.has(token));
	if (queryHits.length >= 2) {
		score += 6;
		reasons.push("Path captures multiple query-cluster terms.");
	}
	if ((asset.asset_path ?? "").includes("/services/")) {
		score += 2;
		reasons.push("Service-library asset (first-party).");
	}
	if ((asset.asset_path ?? "").includes("/work/")) {
		score += 4;
		reasons.push("Work-photo library asset (first-party field context).");
	}
	// Prefer concrete subject nouns over pure lifestyle filler.
	for (const token of [
		"tankless",
		"septic",
		"drain",
		"waterheater",
		"heater",
		"toilet",
		"backflow",
		"excavation",
		"pipe",
		"plumbing",
	]) {
		if (needed.includes(token) && have.has(token)) {
			score += 3;
			reasons.push(`Strong subject token: ${token}.`);
		}
	}
	if (asset.featured_blocked) {
		score = Math.min(score, INLINE_MIN_SCORE - 1);
		reasons.push("Asset class blocked for featured use.");
	}
	return Object.freeze({
		score,
		matched_tokens: Object.freeze(matched),
		reasons: Object.freeze(reasons),
	});
}

function buildAltText(opportunity, asset, role) {
	const subject =
		opportunity.click_title ??
		opportunity.title_hint ??
		opportunity.query_cluster ??
		"Plumbing topic";
	const place = /santa cruz/i.test(subject) ? "" : " in Santa Cruz County";
	if (role === "featured") {
		return `${subject}${place}`.slice(0, 160);
	}
	return `Supporting photo for ${opportunity.query_cluster ?? "this post"}${place}`.slice(
		0,
		160,
	);
}

function buildRationale(opportunity, scored) {
	const base = `Selected for the query cluster "${opportunity.query_cluster}" because the asset path and tokens relate directly to the post subject.`;
	const detail = scored.reasons.slice(0, 3).join(" ");
	return `${base} ${detail}`.trim().slice(0, 600);
}

/**
 * Strict featured-image selection: first-party OWNED assets only, high
 * relevance threshold, blocked brand/partner/team/logo classes.
 */
export function selectFeaturedImagePlan({
	opportunity,
	repoRoot,
	library = null,
} = {}) {
	if (!opportunity || typeof opportunity !== "object")
		throw new Error("Featured image selection requires an opportunity.");
	const assets = library ?? indexFirstPartyImages({ repoRoot });
	const ranked = assets
		.filter((asset) => !asset.featured_blocked)
		.map((asset) => {
			const scored = scoreImageRelevance({ asset, opportunity });
			return { asset, scored };
		})
		.sort((left, right) => right.scored.score - left.scored.score);
	const best = ranked[0] ?? null;
	if (!best || best.scored.score < FEATURED_MIN_SCORE) {
		return Object.freeze({
			classification: "BLOCKED_MISSING_CREDENTIALS",
			role: "featured",
			plan: null,
			reason:
				best == null
					? "No first-party image library was available."
					: `Best first-party candidate scored ${best.scored.score}, below featured minimum ${FEATURED_MIN_SCORE}.`,
			candidates_considered: ranked.slice(0, 5).map((entry) =>
				Object.freeze({
					asset_path: entry.asset.asset_path,
					score: entry.scored.score,
					matched_tokens: entry.scored.matched_tokens,
				}),
			),
			next_action:
				"Add a clearly related first-party work/service photo, or supply a human-approved licensed asset path before publishing a featured image.",
		});
	}
	const plan = Object.freeze({
		role: "featured",
		asset_path: best.asset.asset_path,
		public_url: best.asset.public_url,
		source_url: best.asset.source_url,
		usage_rights: "OWNED",
		rights_evidence_id: best.asset.rights_evidence_id,
		alt_text: buildAltText(opportunity, best.asset, "featured"),
		relevance_rationale: buildRationale(opportunity, best.scored),
		relevance_score: best.scored.score,
		matched_tokens: best.scored.matched_tokens,
		local_claim: false,
		publication_eligible: true,
	});
	return Object.freeze({
		classification: "MOCK_VERIFIED",
		role: "featured",
		plan,
		reason: null,
		candidates_considered: ranked.slice(0, 5).map((entry) =>
			Object.freeze({
				asset_path: entry.asset.asset_path,
				score: entry.scored.score,
				matched_tokens: entry.scored.matched_tokens,
			}),
		),
		next_action: null,
	});
}

/**
 * Rank additional first-party illustrations for optional in-body use.
 * Still first-party only; does not download or mutate assets.
 */
export function selectIllustrationCandidates({
	opportunity,
	repoRoot,
	library = null,
	featuredAssetPath = null,
	limit = MAX_INLINE_CANDIDATES,
} = {}) {
	const assets = library ?? indexFirstPartyImages({ repoRoot });
	const ranked = assets
		.filter((asset) => asset.asset_path !== featuredAssetPath)
		.filter((asset) => !asset.featured_blocked)
		.map((asset) => {
			const scored = scoreImageRelevance({ asset, opportunity });
			return { asset, scored };
		})
		.filter((entry) => entry.scored.score >= INLINE_MIN_SCORE)
		.sort((left, right) => right.scored.score - left.scored.score)
		.slice(0, limit)
		.map((entry) =>
			Object.freeze({
				role: "illustration_candidate",
				asset_path: entry.asset.asset_path,
				public_url: entry.asset.public_url,
				source_url: entry.asset.source_url,
				usage_rights: "OWNED",
				rights_evidence_id: entry.asset.rights_evidence_id,
				alt_text: buildAltText(opportunity, entry.asset, "illustration"),
				relevance_rationale: buildRationale(opportunity, entry.scored),
				relevance_score: entry.scored.score,
				matched_tokens: entry.scored.matched_tokens,
				publication_eligible: true,
			}),
		);
	return Object.freeze({
		classification: "MOCK_VERIFIED",
		candidates: Object.freeze(ranked),
	});
}

/**
 * Filter external research candidates to those with content-token overlap.
 * Never marks them publication-eligible.
 */
export function rankExternalImageCandidates({
	opportunity,
	candidates = [],
	limit = MAX_EXTERNAL_CANDIDATES,
} = {}) {
	const needed = new Set(opportunityTokens(opportunity));
	const ranked = (Array.isArray(candidates) ? candidates : [])
		.map((candidate) => {
			const textTokens = tokenizeImageText(
				[
					candidate.title,
					candidate.description,
					candidate.alt,
					candidate.asset_url,
				]
					.filter(Boolean)
					.join(" "),
			);
			const matched = textTokens.filter((token) => needed.has(token));
			return Object.freeze({
				...candidate,
				usage_rights: "UNVERIFIED",
				publication_eligible: false,
				relevance_score: matched.length * 4,
				matched_tokens: Object.freeze(matched),
				required_next_action:
					"Obtain rights evidence, download into an approved public/ path, write descriptive alt text, and get human approval before featured or body use.",
			});
		})
		.filter((candidate) => candidate.relevance_score >= INLINE_MIN_SCORE)
		.sort((left, right) => right.relevance_score - left.relevance_score)
		.slice(0, limit);
	return Object.freeze({
		classification: ranked.length > 0 ? "MOCK_VERIFIED" : "FAILED",
		candidates: Object.freeze(ranked),
		publication_permitted: false,
	});
}

/**
 * End-to-end image package for a blog opportunity.
 */
export function buildBlogImagePackage({
	opportunity,
	repoRoot,
	externalCandidates = [],
	library = null,
} = {}) {
	const assets = library ?? indexFirstPartyImages({ repoRoot });
	const featured = selectFeaturedImagePlan({
		opportunity,
		repoRoot,
		library: assets,
	});
	const illustrations = selectIllustrationCandidates({
		opportunity,
		repoRoot,
		library: assets,
		featuredAssetPath: featured.plan?.asset_path ?? null,
	});
	const external = rankExternalImageCandidates({
		opportunity,
		candidates: externalCandidates,
	});
	return Object.freeze({
		featured,
		illustrations,
		external_research: external,
		policy: Object.freeze({
			featured_min_score: FEATURED_MIN_SCORE,
			inline_min_score: INLINE_MIN_SCORE,
			featured_requires_first_party_owned: true,
			external_never_auto_publishes: true,
		}),
	});
}

/**
 * Overlay a selected featured plan onto a blog opportunity for writer prompts
 * and Markdown front matter. Leaves the opportunity unchanged when no plan.
 */
export function applyFeaturedImageToOpportunity(opportunity, featuredResult) {
	if (!opportunity || typeof opportunity !== "object")
		throw new Error("applyFeaturedImageToOpportunity requires an opportunity.");
	const plan = featuredResult?.plan;
	if (!plan?.public_url || !plan?.alt_text) return opportunity;
	return Object.freeze({
		...opportunity,
		image: plan.public_url,
		image_alt: plan.alt_text,
		image_plan: plan,
	});
}

export const IMAGE_SELECTION_THRESHOLDS = Object.freeze({
	featured_min_score: FEATURED_MIN_SCORE,
	inline_min_score: INLINE_MIN_SCORE,
	max_inline_candidates: MAX_INLINE_CANDIDATES,
	max_external_candidates: MAX_EXTERNAL_CANDIDATES,
});
