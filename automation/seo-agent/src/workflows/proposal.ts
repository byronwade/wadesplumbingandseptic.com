import { executeDraftProposal } from "../proposal.mjs";
import type { RuntimeWorkflowInput } from "./audit";

export async function runDraftProposalWorkflow(input: RuntimeWorkflowInput) {
	"use workflow";
	return buildDraftProposal(input);
}

async function buildDraftProposal(input: RuntimeWorkflowInput) {
	"use step";
	return executeDraftProposal({
		descriptor: input.descriptor,
		settings: input.settings,
		repoRoot: input.repoRoot,
		config: input.config,
	} as never);
}
