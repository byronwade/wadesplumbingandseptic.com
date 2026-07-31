import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_BUDGETS } from "../src/constants.mjs";
import {
	assertAuditWorkPackets,
	AUDIT_ROLE_ORDER,
	createAuditWorkPackets,
} from "../src/work-packets.mjs";

const descriptor = Object.freeze({
	runId: "audit-2026-07-30",
	idempotencyKey: "a".repeat(64),
});

test("the audit work plan gives every specialist a typed, deterministic, mutation-free packet", () => {
	const first = createAuditWorkPackets({
		descriptor,
		mode: "observe",
		firstRunAuditOnly: true,
	});
	const second = createAuditWorkPackets({
		descriptor,
		mode: "observe",
		firstRunAuditOnly: true,
	});
	assert.equal(first.length, 9);
	assert.deepEqual(
		first.map((packet) => packet.role),
		AUDIT_ROLE_ORDER,
	);
	assert.deepEqual(
		first.map((packet) => packet.packet_id),
		second.map((packet) => packet.packet_id),
	);
	assert.equal(
		first.every((packet) => packet.audit_only),
		true,
	);
	assert.equal(
		first.every(
			(packet) => packet.output_contract.allow_content_mutation === false,
		),
		true,
	);
	assert.equal(
		first.every(
			(packet) => packet.output_contract.allow_pull_request === false,
		),
		true,
	);
	assert.equal(assertAuditWorkPackets(first), first);
});

test("the packet planner rejects missing roles, unsafe modes, and aggregate-budget overruns", () => {
	assert.throws(
		() => createAuditWorkPackets({ descriptor, mode: "paused" }),
		/active audit runtime mode/,
	);
	assert.throws(
		() =>
			createAuditWorkPackets({
				descriptor,
				mode: "observe",
				budgets: { ...DEFAULT_BUDGETS, maxWorkflowSteps: 8 },
			}),
		/every required audit role/,
	);
	const packets = createAuditWorkPackets({ descriptor, mode: "dry-run" });
	assert.throws(
		() => assertAuditWorkPackets(packets.slice(1)),
		/every required specialist role/,
	);
	assert.throws(
		() =>
			assertAuditWorkPackets(packets, {
				budgets: { ...DEFAULT_BUDGETS, maxModelTokens: 1 },
			}),
		/aggregate runtime budget/,
	);
});
