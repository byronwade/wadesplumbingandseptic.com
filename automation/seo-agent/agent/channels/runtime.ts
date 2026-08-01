import { GET, defineChannel } from "eve/channels";
import {
	createCircuitBreaker,
	createDispatchLockStore,
	createRunDescriptor,
	dispatchCronRequest,
	loadRuntimeSettings,
	runtimeHealth,
} from "../../src/runtime.mjs";

const locks = createDispatchLockStore();
const circuit = createCircuitBreaker();

function packet(
	descriptor: ReturnType<typeof createRunDescriptor>,
	settings: ReturnType<typeof loadRuntimeSettings>,
) {
	return JSON.stringify({
		type: "SEO_RUNTIME_DISPATCH",
		run_id: descriptor.runId,
		idempotency_key: descriptor.idempotencyKey,
		job: descriptor.job,
		audit_only: descriptor.job === "audit",
		mode: settings.mode,
		mutation_kill_switch: settings.mutationKillSwitch,
		limits: settings.limits,
		instruction:
			descriptor.job === "audit"
				? "Use the orchestrate tool exactly once with job audit. It may only perform this read-only audit and must return a truthful blocked record when a dependency is unavailable."
				: "Use the orchestrate tool exactly once with job proposal. It may create at most one explicitly approved draft PR and must never merge, deploy, or write main.",
	});
}

function json(payload: unknown, status = 200) {
	return Response.json(payload, {
		status,
		headers: { "cache-control": "no-store" },
	});
}

export default defineChannel({
	routes: [
		GET("/api/healthz", async (request) =>
			json(
				runtimeHealth({
					circuit,
					oidcTokenPresent: Boolean(request.headers.get("x-vercel-oidc-token")),
				}),
			),
		),
		GET("/api/readyz", async (request) => {
			const health = runtimeHealth({
				circuit,
				oidcTokenPresent: Boolean(request.headers.get("x-vercel-oidc-token")),
			});
			return json(health, health.ready ? 200 : 503);
		}),
		GET("/api/cron", async (request, { send, resolveActiveSession }) => {
			const result = await dispatchCronRequest({
				request,
				activeRun: (continuationToken: string) =>
					resolveActiveSession({ continuationToken }),
				startRun: async (
					descriptor: ReturnType<typeof createRunDescriptor>,
					settings: ReturnType<typeof loadRuntimeSettings>,
				) =>
					send(packet(descriptor, settings), {
						auth: null,
						continuationToken: descriptor.continuationToken,
						mode: "task",
						title: `Wade SEO ${descriptor.job} ${descriptor.runId}`,
					}),
				locks,
				circuit,
			});
			return json(
				result,
				("http_status" in result ? result.http_status : undefined) ??
					(result.status === "ACCEPTED" ||
					result.status === "DUPLICATE" ||
					result.status === "PAUSED" ||
					result.status === "DISABLED"
						? 202
						: 503),
			);
		}),
	],
	async receive(input, { send }) {
		if (input.target?.source !== "EVE_NATIVE_CRON")
			throw new Error(
				"Runtime channel accepts only the native Eve schedule target.",
			);
		const descriptor = createRunDescriptor();
		const settings = loadRuntimeSettings();
		if (settings.mode === "disabled" || settings.mode === "paused")
			throw new Error(
				`Runtime is ${settings.mode}; native schedule work is not started.`,
			);
		if (!locks.acquire(descriptor.idempotencyKey))
			throw new Error(
				`Duplicate native schedule dispatch denied: ${descriptor.runId}`,
			);
		try {
			return await send(packet(descriptor, settings), {
				auth: input.auth,
				continuationToken: descriptor.continuationToken,
				mode: "task",
				title: `Wade SEO audit ${descriptor.runId}`,
			});
		} finally {
			locks.release(descriptor.idempotencyKey);
		}
	},
});
