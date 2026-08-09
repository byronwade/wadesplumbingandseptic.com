import { defineTool } from "eve/tools";
import { z } from "zod";

import {
	loadBrandContext,
	proposeBrandContextPatch,
} from "../../src/brand-context.mjs";
import { resolveRepositoryState } from "../../src/runtime.mjs";

export default defineTool({
	description:
		"Propose a brand-context JSON patch for human review. Returns a patched document and change-set path; does not write Git, Blob, or main. Publishing requires a draft PR and human merge.",
	inputSchema: z.object({
		patch: z
			.record(z.string(), z.unknown())
			.describe("Partial brand-context fields to merge for human review."),
		rationale: z
			.string()
			.min(12)
			.max(500)
			.describe("Why this brand-context change is needed."),
	}),
	async execute({ patch, rationale }) {
		const repository = resolveRepositoryState();
		const repoRoot = repository?.repoRoot ?? null;
		const current = loadBrandContext({ repoRoot });
		if (!current) {
			return {
				ok: false,
				error: "Brand context manifest is missing; cannot propose a patch.",
			};
		}
		const proposed = proposeBrandContextPatch(current, patch);
		return {
			ok: true,
			path: "seo/manifests/brand-context.json",
			rationale,
			requires_human_draft_pr: true,
			proposed,
		};
	},
});
