import { defineAgent } from "eve";
import { model, modelContextWindowTokens } from "../../model";
export default defineAgent({
	description:
		"Audits crawlability, metadata, canonical, robots, sitemap, redirects, schema, and performance evidence.",
	model,
	modelContextWindowTokens,
});
