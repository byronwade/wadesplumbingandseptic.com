import { defineSchedule } from "eve/schedules";
import runtime from "../channels/runtime";

export default defineSchedule({
	// 16:17 UTC every Monday. Human setup must keep this schedule disabled until
	// the first manually initiated audit-only run has been reviewed.
	cron: "17 16 * * 1",
	async run({ receive, appAuth }) {
		// Native Eve/Vercel schedules are platform-authenticated. The external
		// /api/cron fallback separately verifies CRON_SECRET before dispatch.
		await receive(runtime, {
			auth: appAuth,
			message: "Start the bounded audit-only runtime schedule.",
			target: { source: "EVE_NATIVE_CRON" },
		});
	},
});
