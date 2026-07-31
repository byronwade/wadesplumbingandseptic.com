import test from "node:test";
import assert from "node:assert/strict";
import {
	archiveGitBackedArtifacts,
	BLOB_ARCHIVE_LIMITS,
	createBlobArtifactArchivePlan,
} from "../src/blob-artifacts.mjs";
import { buildRunArtifactBundle } from "../src/artifacts.mjs";
import { loadConfig } from "../src/config.mjs";
import { makeEvidence, sha256 } from "../src/contracts.mjs";

const RUN_ID = "blob-fixture-audit-001";
const COMMIT_SHA = "a".repeat(40);

function bundle(payload = { redacted: true }) {
	const manifest = {
		schema_version: "1.0",
		semantic_version: "0.1.0",
		run_id: RUN_ID,
		collected_at: new Date(0).toISOString(),
		source: "fixture",
		source_url_or_tool: "fixture",
		scope: "audit-only",
		classification: "MOCK_VERIFIED",
		redaction: "NO_SECRETS_OR_PERSONAL_DATA",
		retention_class: "VERSIONED_NON_SECRET",
		audit_only: true,
		draft_prs_created: 0,
		content_files_changed: 0,
		tree_hash: "fixture-tree",
		state: "CLOSED",
		observability: {
			correlation_id: "blob:fixture",
			prompt_hash: sha256("fixture"),
			skill_hash: sha256("fixture"),
			tool_calls: 0,
			model_tokens: 0,
			model_cost_usd: 0,
			model_latency_ms: 0,
			tool_latency_ms: {},
			tool_approvals: [],
			denial_reason: null,
			error_classification: null,
			audit_outcome: "NO_CHANGE",
			draft_pr_url: null,
			preview_url: null,
			budget_usage: {},
			budget_limits: {},
			source_code_sha: "fixture-tree",
		},
		evidence: [
			makeEvidence({
				runId: RUN_ID,
				source: "fixture",
				scope: "fixture",
				payload,
			}),
		],
	};
	return buildRunArtifactBundle(manifest);
}

function config(env = {}) {
	return loadConfig({
		SEO_AGENT_ENV: "production",
		SEO_AGENT_BLOB_ENABLED: "true",
		SEO_AGENT_BLOB_ARCHIVE_APPROVED: "true",
		SEO_AGENT_BLOB_APPROVED_RUN_ID: RUN_ID,
		SEO_AGENT_BLOB_PREFIX: "wades-eve-seo-agent/v1",
		BLOB_READ_WRITE_TOKEN: "blob-fixture-token-value",
		...env,
	});
}

function receipt() {
	return { commit_sha: COMMIT_SHA };
}

function committedReader(artifactBundle, overrides = {}) {
	const files = new Map(
		artifactBundle.files.map((file) => [file.path, file.content]),
	);
	const manifestPath = `seo/runs/${RUN_ID}/manifest.json`;
	const planFiles = artifactBundle.files.map((file) => ({
		git_path: file.path,
		sha256: sha256(file.content),
	}));
	const approval = JSON.stringify({
		schema_version: "1.0",
		run_id: RUN_ID,
		archive_approved: true,
		approved_at: new Date(0).toISOString(),
		review_reference: "human-review:fixture",
		manifest_sha256: sha256(files.get(manifestPath)),
		bundle_sha256: sha256(planFiles),
		...overrides,
	});
	files.set(`seo/runs/${RUN_ID}/blob-archive-approval.json`, approval);
	return async ({ commitSha, path }) => {
		assert.equal(commitSha, COMMIT_SHA);
		return files.get(path);
	};
}

test("Blob archive remains disabled unless the reviewed Eve service opts in", () => {
	const plan = createBlobArtifactArchivePlan({
		bundle: bundle(),
		config: loadConfig({}),
	});
	assert.equal(plan.classification, "BLOCKED_MISSING_CREDENTIALS");
	assert.equal(plan.write_performed, false);
});

test("Blob plans are truthfully blocked until committed approval is verified", () => {
	const plan = createBlobArtifactArchivePlan({
		bundle: bundle(),
		config: config(),
	});
	assert.equal(plan.classification, "BLOCKED_MISSING_CREDENTIALS");
	assert.equal(plan.access, "private");
	assert.equal(plan.canonical_state, "git");
	assert.equal(plan.requires_human_approval, undefined);
	assert.ok(plan.total_bytes <= BLOB_ARCHIVE_LIMITS.max_total_bytes);
	assert.ok(
		plan.files.every((file) =>
			file.blob_path.startsWith(`wades-eve-seo-agent/v1/${RUN_ID}/`),
		),
	);
	assert.equal(
		JSON.stringify(plan).includes("blob-fixture-token-value"),
		false,
	);
	assert.equal(JSON.stringify(plan).includes("https://"), false);
});

test("Blob refuses unredacted payload shapes and invalid credential configuration", async () => {
	const unsafeBundle = bundle({
		raw_response: "not an allowed archive payload",
	});
	await assert.rejects(
		archiveGitBackedArtifacts({
			bundle: unsafeBundle,
			config: config(),
			gitManifestReceipt: receipt(),
			readCommittedFile: committedReader(unsafeBundle),
		}),
		/prohibited field/,
	);
	assert.throws(
		() => config({ BLOB_READ_WRITE_TOKEN: "" }),
		/BLOB_READ_WRITE_TOKEN/,
	);
});

test("Blob writes require production, exact approval, committed artifacts, and a Git approval record", async () => {
	const calls = [];
	const artifactBundle = bundle();
	const put = async (...args) => {
		calls.push(args);
		return { pathname: args[0] };
	};
	await assert.rejects(
		archiveGitBackedArtifacts({
			bundle: artifactBundle,
			config: config({ SEO_AGENT_BLOB_ARCHIVE_APPROVED: "false" }),
			gitManifestReceipt: receipt(),
			readCommittedFile: committedReader(artifactBundle),
			put,
		}),
		/ARCHIVE_APPROVED/,
	);
	await assert.rejects(
		archiveGitBackedArtifacts({
			bundle: artifactBundle,
			config: config(),
			gitManifestReceipt: { commit_sha: "abcdef1234567" },
			readCommittedFile: committedReader(artifactBundle),
			put,
		}),
		/exact full Git manifest commit SHA/,
	);
	await assert.rejects(
		archiveGitBackedArtifacts({
			bundle: artifactBundle,
			config: config(),
			gitManifestReceipt: receipt(),
			readCommittedFile: committedReader(artifactBundle, {
				bundle_sha256: "tampered",
			}),
			put,
		}),
		/does not bind/,
	);
	await assert.rejects(
		archiveGitBackedArtifacts({
			bundle: artifactBundle,
			config: config(),
			gitManifestReceipt: receipt(),
			readCommittedFile: async () => "tampered",
			put,
		}),
		/does not match/,
	);
	assert.equal(calls.length, 0);
});

test("fixture Blob writer remains mock-verified and records no provider URL", async () => {
	const calls = [];
	const artifactBundle = bundle();
	const result = await archiveGitBackedArtifacts({
		bundle: artifactBundle,
		config: config(),
		gitManifestReceipt: receipt(),
		readCommittedFile: committedReader(artifactBundle),
		put: async (pathname, body, options) => {
			calls.push({ pathname, body, options });
			return { pathname, url: "https://private.example.test/not-returned" };
		},
	});
	assert.equal(result.classification, "MOCK_VERIFIED");
	assert.equal(result.access, "private");
	assert.equal(result.canonical_state, "git");
	assert.equal(result.source_url_or_tool, "vercel-blob:private-archive");
	assert.equal(result.git_commit_sha, COMMIT_SHA);
	assert.equal(calls.length, 2);
	assert.ok(calls.every((call) => call.options.access === "private"));
	assert.ok(calls.every((call) => call.options.addRandomSuffix === false));
	assert.ok(calls.every((call) => call.options.allowOverwrite === false));
	assert.equal(JSON.stringify(result).includes("private.example.test"), false);
});

test("Blob records a partial archive as failed without automatic retry", async () => {
	const artifactBundle = bundle();
	let calls = 0;
	const result = await archiveGitBackedArtifacts({
		bundle: artifactBundle,
		config: config(),
		gitManifestReceipt: receipt(),
		readCommittedFile: committedReader(artifactBundle),
		put: async (pathname) => {
			calls += 1;
			if (calls === 2) throw new Error("provider outage");
			return { pathname };
		},
	});
	assert.equal(result.classification, "FAILED");
	assert.equal(result.write_performed, true);
	assert.equal(result.error_code, "BLOB_ARCHIVE_WRITE_FAILED");
	assert.equal(result.retryable, false);
	assert.equal(result.completed_files.length, 1);
});
