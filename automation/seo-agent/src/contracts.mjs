import { createHash } from "node:crypto";
import { RUN_STATES, TRUTH_STATES } from "./constants.mjs";
import { assertTruthState, scanForSecrets } from "./policy.mjs";

const ALLOWED_TRANSITIONS = Object.freeze({
	PLANNED: ["COLLECTING", "BLOCKED_MISSING_CREDENTIALS", "REJECTED"],
	COLLECTING: [
		"ANALYZING",
		"BUDGET_EXHAUSTED",
		"SECURITY_ESCALATED",
		"BLOCKED_MISSING_CREDENTIALS",
	],
	ANALYZING: [
		"AWAITING_HUMAN_APPROVAL",
		"CLOSED",
		"REJECTED",
		"BUDGET_EXHAUSTED",
	],
	AWAITING_HUMAN_APPROVAL: ["DRAFTING", "REJECTED", "CLOSED"],
	DRAFTING: ["REVIEWING", "REJECTED", "BUDGET_EXHAUSTED"],
	REVIEWING: ["QA", "REJECTED"],
	QA: ["DRAFT_PR_OPEN", "REJECTED"],
	DRAFT_PR_OPEN: ["HUMAN_REVIEW", "REJECTED"],
	HUMAN_REVIEW: ["MERGED_BY_HUMAN", "REJECTED"],
	MERGED_BY_HUMAN: ["PRODUCTION_AUDIT"],
	PRODUCTION_AUDIT: ["CLOSED", "REJECTED"],
});

export function sha256(value) {
	return createHash("sha256")
		.update(typeof value === "string" ? value : JSON.stringify(value))
		.digest("hex");
}

export function assertRecord(record, type = "record") {
	for (const field of [
		"schema_version",
		"run_id",
		"collected_at",
		"source",
		"scope",
		"classification",
		"redaction",
		"retention_class",
	]) {
		if (!record?.[field]) throw new Error(`${type} missing ${field}`);
	}
	assertTruthState(record.classification);
	if (Number.isNaN(Date.parse(record.collected_at)))
		throw new Error(`${type} has an invalid collected_at timestamp`);
	if (scanForSecrets(record))
		throw new Error(`${type} contains a secret-like value`);
	return record;
}

export function assertPageInventory(inventory) {
	if (inventory.schema_version !== "1.0")
		throw new Error("Unsupported pages schema version");
	const urls = new Set();
	for (const page of inventory.pages ?? []) {
		if (!page.url?.startsWith("/"))
			throw new Error(`Invalid page URL: ${page.url}`);
		if (urls.has(page.url)) throw new Error(`Duplicate page URL: ${page.url}`);
		if (!page.source_path || !page.canonical_url || !page.lifecycle)
			throw new Error(`Incomplete page record: ${page.url}`);
		urls.add(page.url);
	}
	return inventory;
}

export function assertRouteMap(routeMap) {
	if (routeMap.schema_version !== "1.0")
		throw new Error("Unsupported route map schema version");
	assertTruthState(routeMap.classification);
	const patterns = new Set();
	for (const route of routeMap.routes ?? []) {
		if (
			!route.route_pattern?.startsWith("/") ||
			patterns.has(route.route_pattern)
		)
			throw new Error(
				`Invalid or duplicate route pattern: ${route.route_pattern}`,
			);
		if (
			!route.source_path ||
			!["STATIC_ROUTE", "DYNAMIC_RUNTIME_DATA"].includes(route.kind) ||
			!Array.isArray(route.parameters) ||
			!Array.isArray(route.materialized_routes) ||
			!Array.isArray(route.data_source_paths)
		) {
			throw new Error(`Incomplete route map record: ${route.route_pattern}`);
		}
		assertTruthState(route.classification);
		if (
			route.kind === "STATIC_ROUTE" &&
			(route.parameters.length !== 0 ||
				route.materialization_state !== "REPOSITORY_ROUTE_DECLARED" ||
				route.materialized_routes.length !== 1 ||
				route.materialized_routes[0] !== route.route_pattern ||
				route.classification !== "MOCK_VERIFIED")
		) {
			throw new Error(
				`Static route map record is inconsistent: ${route.route_pattern}`,
			);
		}
		if (
			route.kind === "DYNAMIC_RUNTIME_DATA" &&
			(route.parameters.length === 0 ||
				route.materialization_state !== "BLOCKED_MISSING_CREDENTIALS" ||
				route.materialized_routes.length !== 0 ||
				route.classification !== "BLOCKED_MISSING_CREDENTIALS")
		) {
			throw new Error(
				`Dynamic route map record is inconsistent: ${route.route_pattern}`,
			);
		}
		patterns.add(route.route_pattern);
	}
	return routeMap;
}

export function assertQueryOwnership(manifest) {
	if (manifest.schema_version !== "1.0")
		throw new Error("Unsupported query ownership schema version");
	const clusters = new Set();
	for (const item of manifest.ownership ?? []) {
		if (clusters.has(item.query_cluster))
			throw new Error(`Duplicate query cluster: ${item.query_cluster}`);
		if (!item.owner_url?.startsWith("/"))
			throw new Error(`Missing owner URL: ${item.query_cluster}`);
		if (
			![
				"emergency",
				"service",
				"comparison",
				"maintenance",
				"cost_financing",
				"local",
				"informational",
			].includes(item.intent)
		) {
			throw new Error(`Invalid intent: ${item.intent}`);
		}
		clusters.add(item.query_cluster);
	}
	return manifest;
}

export function assertFactRegistry(registry) {
	if (registry.schema_version !== "1.0")
		throw new Error("Unsupported facts schema version");
	for (const fact of registry.facts ?? []) {
		if (
			!fact.source_path ||
			!fact.excerpt ||
			fact.review_status !== "APPROVED" ||
			!fact.revalidate_by
		) {
			throw new Error(`Invalid approved fact: ${fact.id ?? "unknown"}`);
		}
	}
	return registry;
}

export function assertIntegrationInventory(inventory) {
	if (inventory.schema_version !== "1.0")
		throw new Error("Unsupported integration inventory schema version");
	assertTruthState(inventory.classification);
	const ids = new Set();
	for (const integration of inventory.integrations ?? []) {
		if (!integration.id || ids.has(integration.id))
			throw new Error(
				`Invalid or duplicate integration id: ${integration.id ?? "unknown"}`,
			);
		if (!["required", "optional"].includes(integration.category))
			throw new Error(`Invalid integration category: ${integration.id}`);
		assertTruthState(integration.state);
		if (
			!integration.minimum_scope ||
			!integration.setup_reference?.startsWith("docs/seo-agent/")
		)
			throw new Error(`Incomplete integration record: ${integration.id}`);
		ids.add(integration.id);
	}
	return inventory;
}

export function makeEvidence({
	runId,
	source,
	scope,
	classification = "MOCK_VERIFIED",
	payload,
	sourceUrlOrTool = "fixture",
	collectedAt = new Date().toISOString(),
}) {
	assertTruthState(classification);
	const canonicalPayload = JSON.stringify(payload);
	return {
		schema_version: "1.0",
		run_id: runId,
		collected_at: collectedAt,
		source,
		source_url_or_tool: sourceUrlOrTool,
		scope,
		classification,
		redaction: "NO_SECRETS_OR_PERSONAL_DATA",
		retention_class: "VERSIONED_NON_SECRET",
		sha256: sha256(canonicalPayload),
		payload,
	};
}

export function assertEvidence(record) {
	assertRecord(record, "evidence");
	if (!record.source_url_or_tool || !record.sha256)
		throw new Error("evidence missing source_url_or_tool or sha256");
	if (record.sha256 !== sha256(record.payload))
		throw new Error("evidence payload hash does not match payload");
	return record;
}

export function assertOpportunityBacklog(backlog) {
	if (backlog.schema_version !== "1.0")
		throw new Error("Unsupported opportunity backlog schema version");
	assertTruthState(backlog.classification);
	const ids = new Set();
	for (const opportunity of backlog.opportunities ?? []) {
		if (!opportunity.id || ids.has(opportunity.id))
			throw new Error(
				`Invalid or duplicate opportunity id: ${opportunity.id ?? "unknown"}`,
			);
		if (opportunity.state !== "RESEARCH_ONLY_PENDING_HUMAN_APPROVAL")
			throw new Error(`Unexpected opportunity state: ${opportunity.id}`);
		if (
			!Array.isArray(opportunity.intent_hypotheses) ||
			opportunity.intent_hypotheses.length === 0
		)
			throw new Error(`Opportunity lacks intent hypotheses: ${opportunity.id}`);
		if (
			!Array.isArray(opportunity.evidence_ids) ||
			opportunity.evidence_ids.length === 0
		)
			throw new Error(`Opportunity lacks evidence: ${opportunity.id}`);
		if (
			opportunity.query_owner !== null ||
			opportunity.new_url_allowed !== false ||
			!opportunity.publication_blocker
		)
			throw new Error(
				`Opportunity is not safely publication-blocked: ${opportunity.id}`,
			);
		ids.add(opportunity.id);
	}
	return backlog;
}

export function assertNoUnsupportedServiceArea(proposal, approvedFacts) {
	const approvedAreas = new Set(
		(approvedFacts.facts ?? [])
			.filter((fact) => fact.kind === "service_area")
			.map((fact) => fact.value),
	);
	for (const area of proposal.service_areas ?? []) {
		if (!approvedAreas.has(area))
			throw new Error(`Unsupported service area: ${area}`);
	}
	return true;
}

export function assertStateTransition(from, to) {
	if (!(ALLOWED_TRANSITIONS[from] ?? []).includes(to))
		throw new Error(`Invalid run state transition: ${from} -> ${to}`);
	return true;
}

export function assertRunManifest(manifest) {
	assertRecord(manifest, "run manifest");
	for (const field of [
		"semantic_version",
		"audit_only",
		"draft_prs_created",
		"content_files_changed",
		"tree_hash",
		"state",
		"observability",
	]) {
		if (manifest[field] === undefined || manifest[field] === null)
			throw new Error(`run manifest missing ${field}`);
	}
	if (!RUN_STATES.includes(manifest.state))
		throw new Error(`run manifest has invalid state: ${manifest.state}`);
	if (
		manifest.audit_only &&
		(manifest.draft_prs_created !== 0 || manifest.content_files_changed !== 0)
	) {
		throw new Error(
			"audit-only manifest records a prohibited content or PR write",
		);
	}
	for (const field of [
		"correlation_id",
		"prompt_hash",
		"skill_hash",
		"tool_calls",
		"model_tokens",
		"model_cost_usd",
		"model_latency_ms",
		"tool_latency_ms",
		"tool_approvals",
		"audit_outcome",
		"budget_usage",
		"budget_limits",
		"source_code_sha",
	]) {
		if (
			manifest.observability[field] === undefined ||
			manifest.observability[field] === null
		)
			throw new Error(`observability missing ${field}`);
	}
	if (
		typeof manifest.observability.budget_usage !== "object" ||
		typeof manifest.observability.budget_limits !== "object"
	)
		throw new Error("observability budget records must be objects");
	if (
		!Number.isFinite(manifest.observability.model_latency_ms) ||
		manifest.observability.model_latency_ms < 0
	) {
		throw new Error(
			"observability model latency must be a non-negative number",
		);
	}
	if (
		!manifest.observability.tool_latency_ms ||
		typeof manifest.observability.tool_latency_ms !== "object" ||
		Array.isArray(manifest.observability.tool_latency_ms)
	) {
		throw new Error("observability tool latency must be an object");
	}
	for (const [tool, latency] of Object.entries(
		manifest.observability.tool_latency_ms,
	)) {
		if (!tool || !Number.isFinite(latency) || latency < 0) {
			throw new Error("observability tool latency contains an invalid value");
		}
	}
	if (!Array.isArray(manifest.observability.tool_approvals)) {
		throw new Error("observability tool approvals must be an array");
	}
	for (const approval of manifest.observability.tool_approvals) {
		if (
			!approval ||
			typeof approval.tool !== "string" ||
			!["APPROVED", "DENIED", "NOT_REQUIRED"].includes(approval.outcome)
		) {
			throw new Error("observability tool approval contains an invalid value");
		}
	}
	for (const field of ["denial_reason", "error_classification"]) {
		if (!Object.hasOwn(manifest.observability, field)) {
			throw new Error(`observability missing ${field}`);
		}
		if (
			manifest.observability[field] !== null &&
			(typeof manifest.observability[field] !== "string" ||
				manifest.observability[field].length > 500)
		) {
			throw new Error(
				`observability ${field} must be null or a bounded string`,
			);
		}
	}
	if (
		![
			"NO_CHANGE",
			"AUDIT_COMPLETE",
			"BLOCKED_MISSING_CREDENTIALS",
			"BUDGET_EXHAUSTED",
			"SECURITY_ESCALATED",
			"REJECTED",
		].includes(manifest.observability.audit_outcome)
	) {
		throw new Error("observability audit outcome is invalid");
	}
	for (const field of ["draft_pr_url", "preview_url"]) {
		const value = manifest.observability[field];
		if (!Object.hasOwn(manifest.observability, field)) {
			throw new Error(`observability missing ${field}`);
		}
		if (
			value !== null &&
			(typeof value !== "string" || !value.startsWith("https://"))
		) {
			throw new Error(`observability ${field} must be null or an HTTPS URL`);
		}
	}
	if (scanForSecrets(manifest.observability))
		throw new Error("observability contains a secret-like value");
	return manifest;
}

export { ALLOWED_TRANSITIONS, TRUTH_STATES };
