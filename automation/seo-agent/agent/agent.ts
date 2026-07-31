import { defineAgent } from "eve";
import { model, modelContextWindowTokens, modelOptions } from "./model";

export default defineAgent({
	description:
		"Orchestrates Wade's audit-first, draft-PR-only SEO operations sidecar.",
	model,
	modelOptions,
	modelContextWindowTokens,
	build: { externalDependencies: ["@vercel/connect"] },
});
