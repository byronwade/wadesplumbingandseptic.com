import { GET, defineChannel } from "eve/channels";
import {
	createCircuitBreaker,
	createDispatchLockStore,
	createNativeScheduleDescriptor,
	createRunDescriptor,
	dispatchCronRequest,
	loadRuntimeSettings,
	assertProposalRunAuthorization,
	runtimeHealth,
} from "../../src/runtime.mjs";
import { loadConfig } from "../../src/config.mjs";

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
				: "Use the orchestrate tool exactly once with job proposal. Research, write one bounded post, and open at most one draft PR through Vercel Connect GitHub. Never merge, deploy, or write main.",
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
		const settings = loadRuntimeSettings();
		const config = loadConfig();
		// Observe Cron stays audit-only. Propose mode uses the same Monday Cron
		// to research and open one draft PR through Vercel Connect GitHub.
		const nativeScheduleJob =
			settings.mode === "propose" ? "proposal" : "audit";
		const descriptor = createNativeScheduleDescriptor({
			source:
				typeof input.target?.source === "string"
					? input.target.source
					: undefined,
			job: nativeScheduleJob,
		});
		if (settings.mode === "disabled" || settings.mode === "paused")
			throw new Error(
				`Runtime is ${settings.mode}; native schedule work is not started.`,
			);
		if (descriptor.job === "proposal")
			assertProposalRunAuthorization({ descriptor, settings, config });
		if (!locks.acquire(descriptor.idempotencyKey))
			throw new Error(
				`Duplicate native schedule dispatch denied: ${descriptor.runId}`,
			);
		try {
			return await send(packet(descriptor, settings), {
				auth: input.auth,
				continuationToken: descriptor.continuationToken,
				mode: "task",
				title: `Wade SEO ${descriptor.job} ${descriptor.runId}`,
			});
		} finally {
			locks.release(descriptor.idempotencyKey);
		}
	},
});
