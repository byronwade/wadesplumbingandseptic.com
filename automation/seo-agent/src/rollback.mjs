import { assertRecord, sha256 } from "./contracts.mjs";

const ROLLBACK_TARGETS = new Set([
	"revert_merged_pull_request",
	"vercel_rollback_known_good_deployment",
]);

function drillPayload({
	humanMergeSha,
	deploymentId,
	rollbackTarget,
	incidentId,
}) {
	return {
		drill_type: "HUMAN_ONLY_ROLLBACK_PROCEDURE",
		simulation: true,
		incident_id: incidentId,
		human_merge_sha: humanMergeSha,
		deployment_id: deploymentId,
		rollback_target: rollbackTarget,
		automated_action_attempted: false,
		human_approval_required: true,
		required_human_steps: [
			"disable_sidecar_cron_in_vercel",
			"detach_or_revoke_affected_connector_if_needed",
			rollbackTarget,
			"record_outcome_in_linked_run_or_experiment_manifest",
			"add_regression_fixture_before_reenable",
		],
		follow_up_evidence_required: true,
	};
}

export function createHumanRollbackDrill({
	runId = "rollback-drill-fixture-0001",
	humanMergeSha = "0123456789abcdef0123456789abcdef01234567",
	deploymentId = "dpl_fixture_001",
	rollbackTarget = "revert_merged_pull_request",
	incidentId = "fixture-rollback-001",
	collectedAt = new Date(0).toISOString(),
} = {}) {
	const payload = drillPayload({
		humanMergeSha,
		deploymentId,
		rollbackTarget,
		incidentId,
	});
	return assertHumanRollbackDrill({
		schema_version: "1.0",
		run_id: runId,
		collected_at: collectedAt,
		source: "rollback-runbook-drill",
		source_url_or_tool: "docs/seo-agent/OPERATIONS.md",
		scope: "human-only-rollback",
		classification: "MOCK_VERIFIED",
		redaction: "NO_SECRETS_OR_PERSONAL_DATA",
		retention_class: "VERSIONED_NON_SECRET",
		sha256: sha256(payload),
		payload,
	});
}

export function assertHumanRollbackDrill(record) {
	assertRecord(record, "rollback drill");
	const payload = record.payload;
	if (
		record.source !== "rollback-runbook-drill" ||
		record.scope !== "human-only-rollback"
	)
		throw new Error("Rollback drill has an invalid source or scope");
	if (record.classification !== "MOCK_VERIFIED")
		throw new Error("Offline rollback drill must be MOCK_VERIFIED");
	if (
		payload?.drill_type !== "HUMAN_ONLY_ROLLBACK_PROCEDURE" ||
		payload.simulation !== true
	)
		throw new Error("Rollback drill must be a human-only simulation");
	if (
		payload.automated_action_attempted !== false ||
		payload.human_approval_required !== true ||
		payload.follow_up_evidence_required !== true
	)
		throw new Error("Rollback drill must prohibit autonomous rollback");
	if (
		!/^[a-f0-9]{7,64}$/i.test(payload.human_merge_sha) ||
		!payload.deployment_id ||
		!payload.incident_id
	)
		throw new Error("Rollback drill has invalid provenance");
	if (!ROLLBACK_TARGETS.has(payload.rollback_target))
		throw new Error("Rollback drill has an unsupported rollback target");
	if (
		!Array.isArray(payload.required_human_steps) ||
		payload.required_human_steps.length < 5
	)
		throw new Error("Rollback drill is missing required human steps");
	if (record.sha256 !== sha256(payload))
		throw new Error("Rollback drill payload hash does not match payload");
	return Object.freeze(record);
}
