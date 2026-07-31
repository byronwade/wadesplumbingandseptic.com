import { sha256 } from "./contracts.mjs";
import { classifyUntrustedText } from "./policy.mjs";

export const SOURCE_TIERS = Object.freeze({
	REPOSITORY_FACT: "REPOSITORY_FACT",
	FIRST_PARTY_ANALYTICS: "FIRST_PARTY_ANALYTICS",
	OFFICIAL_PROVIDER: "OFFICIAL_PROVIDER",
	GOVERNMENT_OR_STANDARD: "GOVERNMENT_OR_STANDARD",
	MANUFACTURER: "MANUFACTURER",
	COMPETITOR: "COMPETITOR_GAP_ANALYSIS_ONLY",
	PUBLIC_WEB: "PUBLIC_WEB_UNTRUSTED",
});

const AUTHORITATIVE_FACT_TIERS = new Set([
	SOURCE_TIERS.REPOSITORY_FACT,
	SOURCE_TIERS.FIRST_PARTY_ANALYTICS,
	SOURCE_TIERS.OFFICIAL_PROVIDER,
	SOURCE_TIERS.GOVERNMENT_OR_STANDARD,
	SOURCE_TIERS.MANUFACTURER,
]);

export function createSourceProvenance({
	url,
	tier,
	accessedAt = new Date().toISOString(),
	sourceId,
} = {}) {
	if (!Object.values(SOURCE_TIERS).includes(tier)) {
		throw new Error("Source provenance requires a recognized source tier.");
	}
	if (typeof url !== "string" || !url.startsWith("https://")) {
		throw new Error("Source provenance requires an HTTPS URL.");
	}
	if (Number.isNaN(Date.parse(accessedAt))) {
		throw new Error("Source provenance requires a valid access date.");
	}
	return Object.freeze({
		source_id: sourceId ?? sha256(url),
		url: new URL(url).toString(),
		tier,
		accessed_at: accessedAt,
	});
}

export function assessUntrustedWebContent(text, provenance) {
	const classification = classifyUntrustedText(text);
	return Object.freeze({
		...provenance,
		untrusted: true,
		content_hash: sha256(text),
		security_state: classification.accepted ? "ACCEPTED_AS_DATA" : "ESCALATED",
		injection_matches: classification.matches,
	});
}

export function assertSourceMaySupportClaim({ tier, claimKind }) {
	if (!Object.values(SOURCE_TIERS).includes(tier)) {
		throw new Error("Claim source has an unrecognized tier.");
	}
	if (
		tier === SOURCE_TIERS.COMPETITOR &&
		["wade_fact", "code", "safety", "law", "manufacturer_claim"].includes(
			claimKind,
		)
	) {
		throw new Error(
			"Competitor sources may inform gap analysis only and cannot support this claim.",
		);
	}
	if (
		!AUTHORITATIVE_FACT_TIERS.has(tier) &&
		["wade_fact", "safety", "law", "manufacturer_claim"].includes(claimKind)
	) {
		throw new Error("This claim requires an authoritative source tier.");
	}
	return true;
}

/**
 * Does not resolve a conflict. The writer/fact checker must obtain an
 * approved primary source or leave the proposed claim unpublished.
 */
export function detectSourceConflicts(claims) {
	if (!Array.isArray(claims)) throw new Error("Claims must be an array.");
	const bySubject = new Map();
	for (const claim of claims) {
		if (
			!claim ||
			typeof claim.subject !== "string" ||
			typeof claim.value !== "string" ||
			!claim.provenance
		) {
			throw new Error("Conflict detection received an invalid claim.");
		}
		const key = `${claim.kind ?? "fact"}:${claim.subject.trim().toLowerCase()}`;
		const values = bySubject.get(key) ?? new Map();
		const entries = values.get(claim.value.trim()) ?? [];
		entries.push({
			source_id: claim.provenance.source_id,
			tier: claim.provenance.tier,
			accessed_at: claim.provenance.accessed_at,
		});
		values.set(claim.value.trim(), entries);
		bySubject.set(key, values);
	}
	return Object.freeze(
		[...bySubject.entries()]
			.filter(([, values]) => values.size > 1)
			.map(([subject, values]) => ({
				subject,
				state: "CONFLICT_REQUIRES_HUMAN_FACT_CHECK",
				values: [...values.entries()].map(([value, sources]) => ({
					value,
					sources,
				})),
			})),
	);
}
