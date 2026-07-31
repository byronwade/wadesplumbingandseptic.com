import { defineAgent } from "eve";
import { model, modelContextWindowTokens } from "../../model";
export default defineAgent({
	description:
		"Independently verifies factual claims, safety language, citations, and approved service-area facts.",
	model,
	modelContextWindowTokens,
});
