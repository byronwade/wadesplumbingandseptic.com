import { assertTruthState } from "./policy.mjs";

function assertHttpsUrl(value, label) {
	let url;
	try {
		url = new URL(value);
	} catch {
		throw new Error(`${label} must be a valid HTTPS URL`);
	}
	if (url.protocol !== "https:")
		throw new Error(`${label} must be a valid HTTPS URL`);
	return url.toString();
}

function assertCommitSha(value, label) {
	if (typeof value !== "string" || !/^[a-f0-9]{7,64}$/i.test(value))
		throw new Error(`${label} must be a commit SHA`);
	return value;
}

function assertAuditTimestamp(value) {
	if (typeof value !== "string" || Number.isNaN(Date.parse(value)))
		throw new Error("Preview audit requires a valid timestamp");
	return value;
}

function assessmentClassification(input) {
	const classification = input.classification ?? "MOCK_VERIFIED";
	assertTruthState(classification);
	return classification;
}

function assertFindings(value) {
	if (value !== undefined && !Array.isArray(value))
		throw new Error("Audit findings must be an array");
	return value ?? [];
}

export function assessPreviewAudit(input) {
	if (!input.preview_url)
		return {
			ready: false,
			classification: "BLOCKED_MISSING_CREDENTIALS",
			reason: "Preview URL is unavailable.",
		};
	const previewUrl = assertHttpsUrl(input.preview_url, "Preview URL");
	assertCommitSha(input.commit_sha, "Preview audit commit SHA");
	assertAuditTimestamp(input.audit_timestamp);
	if (input.indexable !== false)
		throw new Error(
			"Preview audit must confirm noindex/non-production crawl protection",
		);
	const classification = assessmentClassification(input);
	const findings = assertFindings(input.critical_findings);
	if (classification === "BLOCKED_MISSING_CREDENTIALS")
		return {
			ready: false,
			classification,
			reason: "Preview evidence is credential-blocked.",
		};
	if (findings.length)
		return {
			ready: false,
			classification,
			reason: "Critical preview findings must be resolved.",
			findings,
		};
	return {
		ready: true,
		classification,
		preview_url: previewUrl,
		commit_sha: input.commit_sha,
		audit_timestamp: input.audit_timestamp,
	};
}

export function assessProductionAudit(input) {
	assertCommitSha(input.human_merge_sha, "Production audit human merge SHA");
	if (!input.production_url || !input.deployment_id)
		return {
			verified: false,
			classification: "BLOCKED_MISSING_CREDENTIALS",
			reason: "Production deployment evidence is unavailable.",
		};
	const productionUrl = assertHttpsUrl(input.production_url, "Production URL");
	if (typeof input.deployment_id !== "string" || !input.deployment_id.trim())
		throw new Error("Production audit requires a deployment ID");
	if (input.write_attempted !== false)
		throw new Error("Production audit must remain read-only");
	if (input.deployment_commit_sha !== input.human_merge_sha)
		throw new Error(
			"Production audit deployment must match the human merge SHA",
		);
	const classification = assessmentClassification(input);
	const findings = assertFindings(input.critical_findings);
	if (classification === "BLOCKED_MISSING_CREDENTIALS")
		return {
			verified: false,
			classification,
			reason: "Production evidence is credential-blocked.",
		};
	if (findings.length)
		return {
			verified: false,
			classification,
			reason: "Critical production findings require human rollback review.",
			findings,
		};
	return {
		verified: true,
		classification,
		production_url: productionUrl,
		deployment_id: input.deployment_id,
		human_merge_sha: input.human_merge_sha,
	};
}
