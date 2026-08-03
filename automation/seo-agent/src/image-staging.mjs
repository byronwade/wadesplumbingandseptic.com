/**
 * Stage online image candidates into draft-PR asset files under
 * public/images/sourced/<slug>/ with provenance sidecars.
 *
 * Staging is for human-reviewed draft PRs only. It does not publish.
 */
import { createHash } from "node:crypto";
import {
	rankExternalImageCandidates,
	tokenizeImageText,
} from "./image-selection.mjs";

const MAX_BYTES = 2_500_000;
const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMAGE_MIME = Object.freeze({
	"image/jpeg": "jpg",
	"image/jpg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
	"image/svg+xml": "svg",
});

function assertSlug(slug) {
	if (typeof slug !== "string" || !SAFE_SLUG.test(slug))
		throw new Error("Image staging requires a safe opportunity slug.");
	return slug;
}

function extensionFor(candidate, contentType, bytes) {
	if (
		candidate.inline_svg ||
		candidate.generation_style === "technical_line_art"
	)
		return "svg";
	const mime = String(contentType ?? "")
		.split(";")[0]
		.trim()
		.toLowerCase();
	if (IMAGE_MIME[mime]) return IMAGE_MIME[mime];
	const fromUrl = String(candidate.asset_url ?? "")
		.toLowerCase()
		.match(/\.(jpe?g|png|webp|svg)(?:\?|$)/);
	if (fromUrl) return fromUrl[1] === "jpeg" ? "jpg" : fromUrl[1];
	// sniff
	if (bytes?.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8)
		return "jpg";
	if (
		bytes?.length >= 8 &&
		bytes[0] === 0x89 &&
		bytes[1] === 0x50 &&
		bytes[2] === 0x4e &&
		bytes[3] === 0x47
	)
		return "png";
	if (
		bytes?.length >= 12 &&
		bytes[0] === 0x52 &&
		bytes[8] === 0x57 &&
		bytes[9] === 0x45 &&
		bytes[10] === 0x42 &&
		bytes[11] === 0x50
	)
		return "webp";
	throw new Error("Staged image type is not an approved raster or SVG format.");
}

function publicUrlFor(assetPath) {
	return `/${assetPath.replace(/^public\//, "")}`;
}

function buildProvenance(candidate, { assetPath, contentSha256, stagedAt }) {
	return Object.freeze({
		schema_version: "1.0",
		asset_path: assetPath,
		provider: candidate.provider,
		source_url: candidate.source_url,
		asset_url: candidate.asset_url,
		usage_rights: candidate.usage_rights_provisional,
		rights_evidence_id: candidate.rights_evidence_id,
		license_name: candidate.license_name,
		license_url: candidate.license_url,
		attribution_required: candidate.attribution_required === true,
		photographer: candidate.photographer,
		generation_style: candidate.generation_style,
		title: candidate.title,
		description: candidate.description,
		content_sha256: contentSha256,
		staged_at: stagedAt,
		publication_state: "REQUIRES_HUMAN_PR_REVIEW",
	});
}

function rankedCandidates(opportunity, candidates, limit) {
	return rankExternalImageCandidates({
		opportunity,
		candidates,
		limit,
	}).candidates;
}

/**
 * Download or materialize one candidate into change-set file descriptors.
 */
export async function stageImageCandidate({
	candidate,
	opportunity,
	slug,
	role = "featured",
	fetchImpl = fetch,
	budget = { consume() {} },
	stagedAt = new Date().toISOString(),
} = {}) {
	if (!candidate || typeof candidate !== "object")
		throw new Error("stageImageCandidate requires a candidate.");
	if (!opportunity || typeof opportunity !== "object")
		throw new Error("stageImageCandidate requires an opportunity.");
	const safeSlug = assertSlug(slug ?? opportunity.slug);
	if (
		!candidate.usage_rights_provisional ||
		!["LICENSED", "PUBLIC_DOMAIN", "EXPLICIT_PERMISSION"].includes(
			candidate.usage_rights_provisional,
		)
	) {
		throw new Error(
			"Only LICENSED, PUBLIC_DOMAIN, or EXPLICIT_PERMISSION candidates may be staged.",
		);
	}
	if (
		typeof candidate.rights_evidence_id !== "string" ||
		!/^[a-z0-9][a-z0-9._:-]{2,127}$/i.test(candidate.rights_evidence_id)
	) {
		throw new Error("Staged candidate requires traceable rights evidence.");
	}

	let bytes;
	let contentType = null;
	if (typeof candidate.inline_svg === "string" && candidate.inline_svg.trim()) {
		bytes = Buffer.from(candidate.inline_svg, "utf8");
		contentType = "image/svg+xml";
	} else {
		budget.consume("maxExternalRequests");
		const response = await fetchImpl(candidate.asset_url, {
			redirect: "follow",
			headers: { Accept: "image/*,*/*" },
		});
		if (!response.ok)
			throw new Error(
				`Image download failed with HTTP ${response.status} from ${candidate.provider}.`,
			);
		contentType = response.headers.get("content-type");
		const buffer = Buffer.from(await response.arrayBuffer());
		if (buffer.byteLength === 0 || buffer.byteLength > MAX_BYTES) {
			throw new Error(
				`Staged image must be between 1 byte and ${MAX_BYTES} bytes.`,
			);
		}
		bytes = buffer;
	}

	const ext = extensionFor(candidate, contentType, bytes);
	const tokenHint =
		tokenizeImageText(opportunity.query_cluster ?? opportunity.slug ?? "topic")
			.slice(0, 4)
			.join("-") || "topic";
	const shortHash = createHash("sha256")
		.update(bytes)
		.digest("hex")
		.slice(0, 10);
	const baseName = `${role}-${tokenHint}-${shortHash}`.replace(
		/[^a-z0-9-]+/g,
		"-",
	);
	const assetPath = `public/images/sourced/${safeSlug}/${baseName}.${ext}`;
	const provenancePath = `public/images/sourced/${safeSlug}/${baseName}.provenance.json`;
	const contentSha256 = createHash("sha256").update(bytes).digest("hex");
	const provenance = buildProvenance(candidate, {
		assetPath,
		contentSha256,
		stagedAt,
	});
	const provenanceJson = `${JSON.stringify(provenance, null, 2)}\n`;

	const imageFile =
		ext === "svg"
			? Object.freeze({
					path: assetPath,
					operation: "CREATE",
					content: bytes.toString("utf8"),
					encoding: "utf8",
					kind: "image_asset",
				})
			: Object.freeze({
					path: assetPath,
					operation: "CREATE",
					content_base64: bytes.toString("base64"),
					encoding: "base64",
					kind: "image_asset",
				});

	const provenanceFile = Object.freeze({
		path: provenancePath,
		operation: "CREATE",
		content: provenanceJson,
		encoding: "utf8",
		kind: "image_provenance",
	});

	const plan = Object.freeze({
		role,
		asset_path: assetPath,
		public_url: publicUrlFor(assetPath),
		source_url: candidate.source_url,
		usage_rights: candidate.usage_rights_provisional,
		rights_evidence_id: candidate.rights_evidence_id,
		alt_text: (
			candidate.alt ||
			candidate.title ||
			`${opportunity.query_cluster} illustration`
		).slice(0, 160),
		relevance_rationale: (
			`Staged from ${candidate.provider} for "${opportunity.query_cluster}" after license-safe online sourcing. ` +
			`Provisional rights ${candidate.usage_rights_provisional} with evidence ${candidate.rights_evidence_id}. ` +
			(candidate.generation_style === "technical_line_art"
				? "Rendered as professional technical line art (not photoreal AI)."
				: "Photographic or diagrammatic stock/Commons asset with recorded provenance.")
		).slice(0, 600),
		relevance_score: candidate.relevance_score ?? null,
		matched_tokens: candidate.matched_tokens ?? Object.freeze([]),
		local_claim: false,
		publication_eligible: true,
		provider: candidate.provider,
		generation_style: candidate.generation_style,
		attribution_required: candidate.attribution_required === true,
		photographer: candidate.photographer,
		license_name: candidate.license_name,
		provenance_path: provenancePath,
	});

	return Object.freeze({
		classification: "MOCK_VERIFIED",
		plan,
		files: Object.freeze([imageFile, provenanceFile]),
		provenance,
	});
}

/**
 * Pick the best online candidate and stage it when relevance clears the bar.
 */
export async function stageBestOnlineImage({
	opportunity,
	candidates = [],
	role = "featured",
	minScore = 10,
	fetchImpl = fetch,
	budget = { consume() {} },
	preferProviders = null,
} = {}) {
	const ranked = rankedCandidates(opportunity, candidates, 12).filter(
		(candidate) => (candidate.relevance_score ?? 0) >= minScore,
	);
	const ordered =
		Array.isArray(preferProviders) && preferProviders.length > 0
			? [...ranked].sort((left, right) => {
					const leftRank = preferProviders.indexOf(left.provider);
					const rightRank = preferProviders.indexOf(right.provider);
					const leftScore =
						(leftRank === -1 ? 99 : leftRank) * 1000 -
						(left.relevance_score ?? 0);
					const rightScore =
						(rightRank === -1 ? 99 : rightRank) * 1000 -
						(right.relevance_score ?? 0);
					return leftScore - rightScore;
				})
			: ranked;

	for (const candidate of ordered) {
		if (
			!["LICENSED", "PUBLIC_DOMAIN", "EXPLICIT_PERMISSION"].includes(
				candidate.usage_rights_provisional,
			)
		) {
			continue;
		}
		try {
			return await stageImageCandidate({
				candidate,
				opportunity,
				role,
				fetchImpl,
				budget,
			});
		} catch {
			// try next candidate
		}
	}
	return Object.freeze({
		classification: "FAILED",
		plan: null,
		files: Object.freeze([]),
		reason:
			"No license-safe online candidate cleared relevance and download/staging checks.",
		next_action:
			"Add first-party work photos, configure Unsplash/Pexels keys, or enable AI technical line-art fallback.",
	});
}
