import {
	createOperationalEvent,
	createSafeAuditLog,
	evaluateOperationalState,
} from "../src/operational-observability.mjs";

const event = createOperationalEvent({
	run_id: "audit-2099-01-01",
	workflow_id: "workflow-fixture-001",
	job_type: "audit",
	phase: "health",
	status: "SUCCEEDED",
	duration_ms: 12,
	source_count: 0,
});
const state = evaluateOperationalState({
	now: "2099-01-02T00:00:00.000Z",
	events: [event],
});
if (state.health !== "HEALTHY" || state.readiness !== "READY")
	throw new Error("Operational fixture did not remain healthy");
console.log(JSON.stringify(createSafeAuditLog(event)));
