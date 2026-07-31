import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
	description:
		"Normal requests stay evidence-only, audit-only, and retain no-change.",
	tags: ["audit", "offline"],
	async test(t) {
		await t.send(
			"Assess only the supplied plumbing page evidence and recommend whether no change is appropriate.",
		);
		t.succeeded();
		t.usedNoTools();
		t.check(t.reply, includes("AUDIT_ONLY:"));
		t.check(t.reply, includes("no-change option"));
	},
});
