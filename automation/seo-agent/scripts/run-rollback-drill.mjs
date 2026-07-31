import { createHumanRollbackDrill } from "../src/rollback.mjs";

const record = createHumanRollbackDrill();
console.log(
	JSON.stringify({
		verification: record.classification,
		drill_type: record.payload.drill_type,
		automated_action_attempted: record.payload.automated_action_attempted,
		human_approval_required: record.payload.human_approval_required,
		record_hash: record.sha256,
	}),
);
