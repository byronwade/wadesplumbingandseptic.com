import assert from "node:assert/strict";
import test from "node:test";
import {
	SANDBOX_SMOKE_COMMAND,
	runSandboxIntegration,
	sandboxIntegrationReadiness,
} from "../src/sandbox-integration.mjs";

const approvedEnv = Object.freeze({
	SEO_AGENT_ENV: "production",
	SEO_AGENT_SANDBOX_INTEGRATION_APPROVED: "true",
	VERCEL_OIDC_TOKEN: "fixture-oidc-token",
});

test("sandbox integration remains blocked without production approval and a credential", () => {
	assert.equal(
		sandboxIntegrationReadiness({ SEO_AGENT_ENV: "development" })
			.classification,
		"BLOCKED_MISSING_CREDENTIALS",
	);
	assert.equal(
		sandboxIntegrationReadiness({ SEO_AGENT_ENV: "production" }).classification,
		"BLOCKED_MISSING_CREDENTIALS",
	);
	assert.equal(
		sandboxIntegrationReadiness({
			SEO_AGENT_ENV: "production",
			SEO_AGENT_SANDBOX_INTEGRATION_APPROVED: "true",
		}).classification,
		"BLOCKED_MISSING_CREDENTIALS",
	);
});

test("sandbox smoke fixtures require node24, deny-all egress, a benign command, and cleanup", async () => {
	const seen = [];
	const result = await runSandboxIntegration({
		env: approvedEnv,
		classification: "MOCK_VERIFIED",
		SandboxFactory: {
			async create(options) {
				seen.push(options);
				return {
					async runCommand(command, args, options) {
						seen.push({ command, args, options });
						return { exitCode: 0 };
					},
					async stop() {
						seen.push("stopped");
					},
				};
			},
		},
	});
	assert.equal(result.classification, "MOCK_VERIFIED");
	assert.deepEqual(seen[0], {
		runtime: "node24",
		timeout: 60000,
		networkPolicy: "deny-all",
	});
	assert.deepEqual(seen[1], {
		command: SANDBOX_SMOKE_COMMAND.command,
		args: SANDBOX_SMOKE_COMMAND.args,
		options: { timeoutMs: 15000 },
	});
	assert.equal(seen[2], "stopped");
});
