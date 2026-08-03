/**
 * Proposal-side image + open-research orchestration.
 * Keeps draft PR packaging coherent without scattering provider logic in proposal.mjs.
 */
import { createConfiguredImageResearchAdapter } from "./image-research.mjs";
import { createOpenResearchAdapter } from "./open-research.mjs";
import {
	IMAGE_SELECTION_THRESHOLDS,
	buildBlogImagePackage,
	rankExternalImageCandidates,
} from "./image-selection.mjs";
import { stageBestOnlineImage, stageImageCandidate } from "./image-staging.mjs";
import { createRunBudget } from "./run-controls.mjs";

export const DEFAULT_PROVIDER_PREFERENCE = Object.freeze([
	"openverse",
	"unsplash",
	"pexels",
	"pixabay",
	"wikimedia",
	"flickr",
	"nasa",
	"europeana",
	"metmuseum",
	"artic",
	"ai-lineart",
]);

export function formatAttributionLine(plan) {
	if (!plan || typeof plan !== "object") return null;
	if (plan.usage_rights === "OWNED") {
		return "Wade Plumbing & Septic first-party asset.";
	}
	const parts = [];
	if (plan.photographer) parts.push(plan.photographer);
	if (plan.provider) parts.push(`via ${plan.provider}`);
	if (plan.license_name) parts.push(plan.license_name);
	if (plan.attribution_required) parts.push("attribution required");
	if (plan.generation_style === "technical_line_art") {
		parts.push("technical line art");
	}
	return parts.length > 0 ? parts.join(" · ") : null;
}

/**
 * Run open research + multi-provider image search/staging for one opportunity.
 */
export async function collectProposalMediaContext({
	opportunity,
	repoRoot,
	config,
	budget = createRunBudget(),
	fetchImpl = fetch,
} = {}) {
	if (!opportunity || typeof opportunity !== "object")
		throw new Error("collectProposalMediaContext requires an opportunity.");

	let openResearchSummary = null;
	if (config?.integrationFlags?.openResearch === true) {
		const openResearch = createOpenResearchAdapter({
			enabled: true,
			budget,
			fetchImpl,
		});
		try {
			const researchedOpen = await openResearch.researchOpportunity({
				opportunity,
			});
			openResearchSummary = Object.freeze({
				classification: researchedOpen.classification,
				wikidata_count: researchedOpen.wikidata?.results?.length ?? 0,
				nominatim_count: researchedOpen.nominatim?.results?.length ?? 0,
				wikidata_labels: Object.freeze(
					(researchedOpen.wikidata?.results ?? [])
						.slice(0, 3)
						.map((item) => item.label),
				),
				place_names: Object.freeze(
					(researchedOpen.nominatim?.results ?? [])
						.slice(0, 2)
						.map((item) => item.display_name),
				),
			});
		} catch (error) {
			openResearchSummary = Object.freeze({
				classification: "FAILED",
				reason:
					error instanceof Error
						? error.message.slice(0, 240)
						: "Open research failed.",
			});
		}
	}

	let externalCandidates = [];
	let onlineResearchSummary = null;
	let stagedFeatured = null;
	let stagedIllustrations = Object.freeze([]);

	if (config?.integrationFlags?.imageSourcing === true) {
		const includeAi = config?.integrationFlags?.imageAiLineArt === true;
		const imageResearch = createConfiguredImageResearchAdapter({
			config,
			budget,
			fetchImpl,
			includeAiLineArt: includeAi,
		});
		const researched = await imageResearch.searchForOpportunity({
			opportunity,
			limit: 20,
		});
		onlineResearchSummary = Object.freeze({
			classification: researched.classification,
			count: (researched.candidates ?? []).length,
			reason: researched.reason ?? null,
			provider_summaries: researched.provider_summaries ?? null,
			queries: researched.queries ?? null,
		});
		externalCandidates = researched.candidates ?? [];

		const firstPartyProbe = buildBlogImagePackage({
			opportunity,
			repoRoot,
			externalCandidates,
		});
		const preferProviders = includeAi
			? DEFAULT_PROVIDER_PREFERENCE
			: DEFAULT_PROVIDER_PREFERENCE.filter((id) => id !== "ai-lineart");

		if (
			!firstPartyProbe.featured.plan &&
			externalCandidates.length > 0 &&
			researched.classification === "MOCK_VERIFIED"
		) {
			stagedFeatured = await stageBestOnlineImage({
				opportunity,
				candidates: externalCandidates,
				role: "featured",
				minScore: IMAGE_SELECTION_THRESHOLDS.online_featured_min_score,
				budget,
				fetchImpl,
				preferProviders,
			});
		}

		// Stage up to two high-relevance online illustrations for human review.
		const illustrationPool = rankExternalImageCandidates({
			opportunity,
			candidates: externalCandidates.filter(
				(candidate) =>
					candidate.asset_url !== stagedFeatured?.plan?.source_url &&
					candidate.source_url !== stagedFeatured?.plan?.source_url,
			),
			limit: 8,
		}).candidates.filter(
			(candidate) =>
				(candidate.relevance_score ?? 0) >=
					IMAGE_SELECTION_THRESHOLDS.inline_min_score &&
				["LICENSED", "PUBLIC_DOMAIN"].includes(
					candidate.usage_rights_provisional,
				),
		);
		const staged = [];
		for (const candidate of illustrationPool.slice(0, 2)) {
			try {
				const result = await stageImageCandidate({
					candidate,
					opportunity,
					role: "illustration",
					budget,
					fetchImpl,
				});
				if (result.plan && result.files?.length) staged.push(result);
			} catch {
				// keep trying next illustration candidate
			}
		}
		stagedIllustrations = Object.freeze(staged);
	}

	const basePackage = buildBlogImagePackage({
		opportunity,
		repoRoot,
		externalCandidates,
		stagedFeatured,
		stagedIllustrations,
	});

	const featuredPlan = basePackage.featured?.plan;
	const imagePackage = Object.freeze({
		...basePackage,
		open_research: openResearchSummary,
		attribution_line: formatAttributionLine(featuredPlan),
	});

	return Object.freeze({
		imagePackage,
		onlineResearchSummary,
		openResearchSummary,
		externalCandidates,
	});
}
