import { createCircuitBreaker, runtimeHealth } from "../src/runtime.mjs";

const health = runtimeHealth({
	env: { SEO_AGENT_ENV: "development", SEO_AGENT_RUN_MODE: "dry-run" },
	circuit: createCircuitBreaker({ now: () => 0 }),
});
if (
	!health.ready ||
	health.status !== "degraded" ||
	health.mutation_kill_switch !== true
)
	throw new Error("Local backend-only health smoke check failed.");
console.log(
	JSON.stringify({
		verification: "MOCK_VERIFIED",
		health,
		network_requests: 0,
	}),
);
