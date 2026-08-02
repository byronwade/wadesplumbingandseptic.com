import { defineSchedule } from "eve/schedules";
import runtime from "../channels/runtime";

export default defineSchedule({
	// 16:17 UTC every Monday. Human setup must keep this schedule disabled until
	// the first manually initiated audit-only run has been reviewed.
	cron: "17 16 * * 1",
	run({ receive, waitUntil, appAuth }) {
		// Native Eve/Vercel schedules are platform-authenticated. The external
		// /api/cron fallback separately verifies CRON_SECRET before dispatch.
		// Eve schedule handlers must register the detached durable handoff with
		// waitUntil. This allows the Cron task to return promptly while Vercel
		// continues the receive operation and records the Agent Run.
		waitUntil(
			receive(runtime, {
				auth: appAuth,
				message: "Start the bounded audit-only runtime schedule.",
				target: { source: "EVE_NATIVE_CRON" },
			}),
		);
	},
});
