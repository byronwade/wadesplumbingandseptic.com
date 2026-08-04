import { defineTool } from "eve/tools";
import { z } from "zod";

import {
	brandContextBrief,
	loadBrandContext,
} from "../../src/brand-context.mjs";
import { resolveRepositoryState } from "../../src/runtime.mjs";

export default defineTool({
	description:
		"Read Wade's Git-backed brand context (positioning, voice, banned phrases, CTA, local hooks) from seo/manifests/brand-context.json. Read-only; never writes Blob or the working tree.",
	inputSchema: z.object({
		full: z
			.boolean()
			.optional()
			.describe(
				"When true, return the full registry. Default is a compact brief.",
			),
	}),
	async execute({ full = false }) {
		const repository = resolveRepositoryState();
		const repoRoot = repository?.repoRoot ?? null;
		const registry = loadBrandContext({ repoRoot });
		if (!registry) {
			return {
				found: false,
				path: "seo/manifests/brand-context.json",
				error:
					"Brand context manifest is missing from the repository snapshot.",
			};
		}
		return {
			found: true,
			path: "seo/manifests/brand-context.json",
			classification: registry.classification,
			brand: full ? registry : brandContextBrief(registry),
		};
	},
});
