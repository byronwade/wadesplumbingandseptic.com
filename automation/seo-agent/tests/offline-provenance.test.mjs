import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = resolve(import.meta.dirname, "../../..");
const script = resolve(
	root,
	"automation/seo-agent/scripts/record-offline-provenance.mjs",
);

test("offline provenance records the verifier result without a credential", () => {
	const runnerTemp = mkdtempSync(resolve(tmpdir(), "wades-seo-offline-"));
	try {
		const result = spawnSync(
			process.execPath,
			[script, "--exit-code=7", "--duration-seconds=12"],
			{
				cwd: root,
				encoding: "utf8",
				env: { ...process.env, RUNNER_TEMP: runnerTemp },
			},
		);
		assert.equal(result.status, 0, result.stderr);
		const record = JSON.parse(
			readFileSync(
				resolve(runnerTemp, "seo-agent-offline-provenance.json"),
				"utf8",
			),
		);
		assert.equal(record.classification, "MOCK_VERIFIED");
		assert.equal(record.verification_command, "npm run seo-agent:verify");
		assert.equal(record.exit_code, 7);
		assert.equal(record.duration_seconds, 12);
		assert.match(record.fixture_revision, /^[a-f0-9]{40}$/);
		assert.match(record.sidecar_lock_sha256, /^[a-f0-9]{40}$/);
	} finally {
		rmSync(runnerTemp, { force: true, recursive: true });
	}
});

test("offline provenance rejects missing or malformed verifier results", () => {
	const runnerTemp = mkdtempSync(resolve(tmpdir(), "wades-seo-offline-"));
	try {
		const result = spawnSync(process.execPath, [script, "--exit-code=256"], {
			cwd: root,
			encoding: "utf8",
			env: { ...process.env, RUNNER_TEMP: runnerTemp },
		});
		assert.notEqual(result.status, 0);
		assert.match(result.stderr, /exit code from 0 through 255/);
	} finally {
		rmSync(runnerTemp, { force: true, recursive: true });
	}
});
