import { defineAgent } from "eve";
import { model, modelContextWindowTokens, modelOptions } from "./model";
import { EVE_SESSION_LIMITS } from "../src/constants.mjs";

export default defineAgent({
	description:
		"Orchestrates Wade's audit-first, draft-PR-only SEO operations sidecar.",
	model,
	modelOptions,
	modelContextWindowTokens,
	limits: EVE_SESSION_LIMITS,
});
