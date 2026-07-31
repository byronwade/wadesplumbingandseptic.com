import { defineTool } from "eve/tools";
import { z } from "zod";
import {
	assertRunDescriptor,
	loadRuntimeSettings,
	resolveRepositoryRoot,
} from "../../src/runtime.mjs";
import { loadConfig } from "../../src/config.mjs";
import { runAuditOnlyWorkflow } from "../../src/workflows/audit";

export default defineTool({
	description:
		"Execute one protected, audit-only SEO runtime work packet. It never publishes, merges, deploys, or edits content.",
	inputSchema: z.object({
		runId: z.string().regex(/^[a-z0-9][a-z0-9-]{2,79}$/),
		idempotencyKey: z.string().regex(/^[a-f0-9]{64}$/),
	}),
	async execute({ runId, idempotencyKey }) {
		const settings = loadRuntimeSettings();
		const descriptor = assertRunDescriptor({ runId, idempotencyKey });
		const config = loadConfig();
		return runAuditOnlyWorkflow({
			descriptor: {
				...descriptor,
				scheduledAt: new Date().toISOString(),
			},
			settings,
			repoRoot: resolveRepositoryRoot(),
			// The model cannot opt in: the exact run identifier and production
			// approval are resolved solely from typed environment configuration.
			executeLiveReads:
				config.environment === "production" &&
				config.liveReads.humanApproved === true &&
				config.liveReads.approvedRunId === descriptor.runId,
		});
	},
});
