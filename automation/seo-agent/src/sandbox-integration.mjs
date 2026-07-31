export const SANDBOX_SMOKE_COMMAND = Object.freeze({
	command: "node",
	args: ["-e", 'process.stdout.write("wades-sandbox-smoke-ok")'],
});

export function sandboxIntegrationReadiness(env = process.env) {
	if (env.SEO_AGENT_ENV !== "production") {
		return Object.freeze({
			classification: "BLOCKED_MISSING_CREDENTIALS",
			reason:
				"Sandbox smoke checks may run only in the approved production sidecar environment.",
		});
	}
	if (env.SEO_AGENT_SANDBOX_INTEGRATION_APPROVED !== "true") {
		return Object.freeze({
			classification: "BLOCKED_MISSING_CREDENTIALS",
			reason:
				"A human must explicitly approve the sandbox integration smoke check.",
		});
	}
	if (!env.VERCEL_OIDC_TOKEN && !env.VERCEL_TOKEN) {
		return Object.freeze({
			classification: "BLOCKED_MISSING_CREDENTIALS",
			reason:
				"Vercel OIDC or a scoped Vercel token is required for a Sandbox smoke check.",
		});
	}
	return Object.freeze({
		classification: "CONFIGURED_UNVERIFIED",
		reason: null,
	});
}

/**
 * Runs only a benign Node stdout command in a newly created deny-all Sandbox.
 * Callers must retain the returned redacted record rather than sandbox logs.
 */
export async function runSandboxIntegration({
	env = process.env,
	SandboxFactory,
	classification = "LIVE_VERIFIED",
} = {}) {
	const readiness = sandboxIntegrationReadiness(env);
	if (readiness.classification !== "CONFIGURED_UNVERIFIED") return readiness;
	if (!SandboxFactory?.create)
		throw new TypeError(
			"SandboxFactory.create is required after readiness passes.",
		);

	let sandbox;
	try {
		sandbox = await SandboxFactory.create({
			runtime: "node24",
			timeout: 60000,
			networkPolicy: "deny-all",
		});
		const result = await sandbox.runCommand(
			SANDBOX_SMOKE_COMMAND.command,
			SANDBOX_SMOKE_COMMAND.args,
			{ timeoutMs: 15000 },
		);
		if (result.exitCode !== 0) {
			return Object.freeze({
				classification: "BLOCKED_MISSING_CREDENTIALS",
				reason: "Sandbox smoke command did not complete successfully.",
				exit_code: result.exitCode ?? null,
			});
		}
		return Object.freeze({
			classification,
			runtime: "node24",
			network_policy: "deny-all",
			command_exit_code: result.exitCode,
			persistent_workspace: false,
		});
	} catch (error) {
		return Object.freeze({
			classification: "BLOCKED_MISSING_CREDENTIALS",
			reason: "Sandbox creation or command execution was unavailable.",
			error_class: error instanceof Error ? error.name : "UnknownError",
		});
	} finally {
		if (sandbox?.stop) await sandbox.stop();
	}
}
