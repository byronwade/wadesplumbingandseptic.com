import { defineTool } from "eve/tools";
import { z } from "zod";
import {
	assertRunDescriptor,
	loadRuntimeSettings,
	resolveRepositoryState,
} from "../../src/runtime.mjs";
import { loadConfig } from "../../src/config.mjs";
import { runAuditOnlyWorkflow } from "../../src/workflows/audit";
import { runDraftProposalWorkflow } from "../../src/workflows/proposal";

export default defineTool({
	description:
		"Execute one protected SEO runtime work packet. Audit jobs are read-only. A proposal job can create one human-approved draft PR only; it never merges, deploys, or writes main.",
	inputSchema: z.object({
		runId: z.string().regex(/^[a-z0-9][a-z0-9-]{2,79}$/),
		idempotencyKey: z.string().regex(/^[a-f0-9]{64}$/),
		job: z.enum(["audit", "proposal"]),
	}),
	async execute({ runId, idempotencyKey, job }) {
		const settings = loadRuntimeSettings();
		const descriptor = assertRunDescriptor({ runId, idempotencyKey, job });
		const config = loadConfig();
		const repository = resolveRepositoryState();
		const workflowInput = {
			descriptor: {
				...descriptor,
				scheduledAt: new Date().toISOString(),
			},
			settings,
			repoRoot: repository?.repoRoot ?? null,
			treeHash: repository?.commitSha,
			config,
		};
		if (descriptor.job === "proposal") {
			return runDraftProposalWorkflow(workflowInput);
		}
		return runAuditOnlyWorkflow({
			...workflowInput,
			// The model cannot opt in: the exact run identifier and production
			// approval are resolved solely from typed environment configuration.
			executeLiveReads:
				config.environment === "production" &&
				config.liveReads.humanApproved === true &&
				config.liveReads.approvedRunId === descriptor.runId,
		});
	},
});
