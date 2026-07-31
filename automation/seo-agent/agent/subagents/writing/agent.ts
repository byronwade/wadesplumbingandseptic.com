import { defineAgent } from "eve";
import {
	modelContextWindowTokens,
	modelForRole,
	modelOptionsForRole,
} from "../../model";
export default defineAgent({
	description:
		"Drafts Markdown-only content proposals after strategy and human approval; never publishes.",
	model: modelForRole("writing"),
	modelOptions: modelOptionsForRole("writing"),
	modelContextWindowTokens,
});
