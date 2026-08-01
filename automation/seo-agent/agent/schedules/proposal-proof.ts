import { defineSchedule } from "eve/schedules";
import runtime from "../channels/runtime";

export default defineSchedule({
	// A leap-day calendar anchor keeps this schedule out of normal operation.
	// Vercel administrators may invoke this named schedule manually with
	// `vercel crons run <compiled-path>` for one exact, human-approved proof.
	// It still fails closed unless every proposal gate matches its derived run ID.
	cron: "0 0 29 2 *",
	async run({ receive, appAuth }) {
		await receive(runtime, {
			auth: appAuth,
			message: "Start one exact-gated draft proposal proof.",
			target: { source: "EVE_NATIVE_PROPOSAL_PROOF" },
		});
	},
});
