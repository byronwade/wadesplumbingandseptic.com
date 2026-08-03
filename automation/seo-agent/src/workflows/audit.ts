import { executeOrchestratedAudit } from "../runtime.mjs";

export type RuntimeWorkflowInput = {
	descriptor: {
		job: string;
		runId: string;
		idempotencyKey: string;
		continuationToken: string;
		scheduledAt: string;
		cron: string | null;
	};
	settings: Record<string, unknown>;
	repoRoot?: string | null;
	treeHash?: string;
	executeLiveReads?: boolean;
	config?: Record<string, unknown>;
};

// Eve invokes this from a durable task session. The request handler only starts
// that session and receives its ID; audit execution never runs inline in HTTP.
export async function runAuditOnlyWorkflow(input: RuntimeWorkflowInput) {
	"use workflow";
	return buildAuditReport(input);
}

async function buildAuditReport(input: RuntimeWorkflowInput) {
	"use step";
	return executeOrchestratedAudit({
		descriptor: input.descriptor,
		// Runtime settings are constructed by the protected dispatcher, never by model text.
		settings: input.settings as Parameters<
			typeof executeOrchestratedAudit
		>[0]["settings"],
		repoRoot: input.repoRoot,
		treeHash: input.treeHash,
		executeLiveReads: input.executeLiveReads === true,
	});
}
