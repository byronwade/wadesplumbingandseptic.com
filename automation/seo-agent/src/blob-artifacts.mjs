import { put as vercelBlobPut } from "@vercel/blob";
import { assertArtifactBundle } from "./artifacts.mjs";
import { assertEvidence, sha256 } from "./contracts.mjs";

const MAX_ARCHIVE_FILES = 128;
const MAX_ARCHIVE_BYTES = 5 * 1024 * 1024;
const MAX_ARCHIVE_FILE_BYTES = 1024 * 1024;
const SAFE_PREFIX = /^[a-z0-9][a-z0-9/_-]{2,95}$/;
const SAFE_COMMIT = /^[a-f0-9]{40}$/;
const PROHIBITED_ARCHIVE_KEYS =
	/(?:authorization|cookie|customer|email|html|password|phone|prompt|query|raw|response|rows|screenshot|secret|token)/i;

function byteLength(value) {
	return new TextEncoder().encode(value).byteLength;
}

function archivePath({ prefix, runId, content }) {
	return `${prefix}/${runId}/${sha256(content)}.json`;
}

function approvalPath(runId) {
	return `seo/runs/${runId}/blob-archive-approval.json`;
}

function bundleDigest(files) {
	return sha256(
		files.map(({ git_path, sha256: contentSha }) => ({
			git_path,
			sha256: contentSha,
		})),
	);
}

function blocked(reason, nextAction, details = {}) {
	return Object.freeze({
		classification: "BLOCKED_MISSING_CREDENTIALS",
		write_performed: false,
		reason,
		next_action: nextAction,
		...details,
	});
}

function assertArchiveLimits(bundle) {
	if (bundle.files.length > MAX_ARCHIVE_FILES) {
		throw new Error(`Blob archive exceeds ${MAX_ARCHIVE_FILES} files.`);
	}
	let total = 0;
	for (const file of bundle.files) {
		const bytes = byteLength(file.content);
		if (bytes > MAX_ARCHIVE_FILE_BYTES) {
			throw new Error(
				`Blob archive file exceeds ${MAX_ARCHIVE_FILE_BYTES} bytes: ${file.path}`,
			);
		}
		total += bytes;
	}
	if (total > MAX_ARCHIVE_BYTES) {
		throw new Error(`Blob archive exceeds ${MAX_ARCHIVE_BYTES} bytes.`);
	}
	return total;
}

function assertRedactedArchivePayload(value, path = "payload") {
	if (Array.isArray(value)) {
		value.forEach((item, index) =>
			assertRedactedArchivePayload(item, `${path}[${index}]`),
		);
		return;
	}
	if (!value || typeof value !== "object") return;
	for (const [key, child] of Object.entries(value)) {
		if (PROHIBITED_ARCHIVE_KEYS.test(key)) {
			throw new Error(
				`Blob archive payload contains prohibited field: ${path}.${key}`,
			);
		}
		assertRedactedArchivePayload(child, `${path}.${key}`);
	}
}

/**
 * Limits Blob content to summaries and hashes that passed the evidence contract.
 * Raw provider responses, customer data, prompts, and browser captures are never
 * eligible merely because they happened not to match a secret scanner pattern.
 */
export function assertBlobArchivableArtifactBundle(bundle) {
	const validated = assertArtifactBundle(bundle);
	for (const file of validated.files) {
		const record = JSON.parse(file.content);
		if (file.kind === "evidence") {
			assertEvidence(record);
			if (
				!["VERSIONED_NON_SECRET", "VERSIONED_MINIMAL_PUBLIC_SUMMARY"].includes(
					record.retention_class,
				) ||
				record.redaction !== "NO_SECRETS_OR_PERSONAL_DATA"
			) {
				throw new Error(
					`Blob archive evidence is not approved for redacted retention: ${file.path}`,
				);
			}
			assertRedactedArchivePayload(record.payload);
		}
	}
	return validated;
}

function buildArchivePlan(bundle, config) {
	const validated = assertArtifactBundle(bundle);
	const totalBytes = assertArchiveLimits(validated);
	if (!SAFE_PREFIX.test(config.blob.prefix)) {
		throw new Error("Blob artifact prefix is invalid.");
	}
	const files = Object.freeze(
		validated.files.map((file) =>
			Object.freeze({
				kind: file.kind,
				git_path: file.path,
				blob_path: archivePath({
					prefix: config.blob.prefix,
					runId: validated.run_id,
					content: file.content,
				}),
				sha256: sha256(file.content),
				bytes: byteLength(file.content),
			}),
		),
	);
	return Object.freeze({
		storage: "vercel-blob",
		access: "private",
		canonical_state: "git",
		run_id: validated.run_id,
		total_bytes: totalBytes,
		max_total_bytes: MAX_ARCHIVE_BYTES,
		files,
		approval_record_path: approvalPath(validated.run_id),
	});
}

/**
 * Produces a no-write, truthfully blocked archive plan. A plan is not provider
 * verification; it remains blocked until the committed Git evidence and human
 * approval record are independently read and validated by the archive caller.
 */
export function createBlobArtifactArchivePlan({ bundle, config }) {
	if (!config?.blob?.enabled) {
		return blocked(
			"Vercel Blob artifact archiving is disabled.",
			"Set SEO_AGENT_BLOB_ENABLED=true only for the reviewed Eve service runtime after review.",
		);
	}
	if (!config.credentials?.blobReadWriteToken) {
		return blocked(
			"The reviewed Eve service Blob token is unavailable.",
			"Attach Blob only after approving the shared Vercel Services environment scope; never copy a token into Git or NEXT_PUBLIC_ variables.",
		);
	}
	const plan = buildArchivePlan(bundle, config);
	return blocked(
		"Blob archival requires a committed Git bundle and human approval record.",
		"Commit and review the exact manifest, evidence, and Blob approval record before invoking the private archive path.",
		plan,
	);
}

function assertArchiveAuthorization({ plan, config, gitManifestReceipt }) {
	if (config.environment !== "production") {
		throw new Error(
			"Blob archival is permitted only from the production sidecar.",
		);
	}
	if (!config.blob.archiveApproved) {
		throw new Error(
			"Blob archival requires SEO_AGENT_BLOB_ARCHIVE_APPROVED=true.",
		);
	}
	if (config.blob.approvedRunId !== plan.run_id) {
		throw new Error("Blob archival requires an exact approved run ID.");
	}
	if (!SAFE_COMMIT.test(gitManifestReceipt?.commit_sha ?? "")) {
		throw new Error(
			"Blob archival requires an exact full Git manifest commit SHA.",
		);
	}
}

function parseApprovalRecord(content, plan, manifestContent) {
	let approval;
	try {
		approval = JSON.parse(content);
	} catch {
		throw new Error("Blob archival approval record must be valid JSON.");
	}
	if (
		approval?.schema_version !== "1.0" ||
		approval.run_id !== plan.run_id ||
		approval.archive_approved !== true ||
		Number.isNaN(Date.parse(approval.approved_at ?? "")) ||
		typeof approval.review_reference !== "string" ||
		approval.review_reference.length < 3 ||
		approval.manifest_sha256 !== sha256(manifestContent) ||
		approval.bundle_sha256 !== bundleDigest(plan.files)
	) {
		throw new Error(
			"Blob archival approval record does not bind the exact committed bundle.",
		);
	}
}

async function assertCommittedBundle({
	bundle,
	plan,
	gitManifestReceipt,
	readCommittedFile,
}) {
	if (typeof readCommittedFile !== "function") {
		throw new Error(
			"Blob archival requires a server-side committed Git artifact reader.",
		);
	}
	const byGitPath = new Map(bundle.files.map((file) => [file.path, file]));
	for (const item of plan.files) {
		const committedContent = await readCommittedFile({
			commitSha: gitManifestReceipt.commit_sha,
			path: item.git_path,
		});
		const file = byGitPath.get(item.git_path);
		if (
			typeof committedContent !== "string" ||
			committedContent !== file.content
		) {
			throw new Error(
				`Committed Git artifact does not match the archive bundle: ${item.git_path}`,
			);
		}
	}
	const manifestContent = byGitPath.get(
		`seo/runs/${plan.run_id}/manifest.json`,
	).content;
	const approvalContent = await readCommittedFile({
		commitSha: gitManifestReceipt.commit_sha,
		path: plan.approval_record_path,
	});
	parseApprovalRecord(approvalContent, plan, manifestContent);
}

function archiveFailure({ plan, archived, error }) {
	return Object.freeze({
		classification: "FAILED",
		write_performed: archived.length > 0,
		storage: "vercel-blob",
		access: "private",
		canonical_state: "git",
		run_id: plan.run_id,
		collected_at: new Date().toISOString(),
		source_url_or_tool: "vercel-blob:private-archive",
		scope: "private redacted Git-backed artifact archive",
		error_code: "BLOB_ARCHIVE_WRITE_FAILED",
		retryable: false,
		completed_files: Object.freeze(archived),
		next_action:
			"Do not retry automatically. Review the partial immutable archive against the committed Git receipt before a human-approved recovery.",
		error_name: error instanceof Error ? error.name : "UnknownError",
	});
}

/**
 * Uploads only committed, approved, redacted JSON payloads. There is no list,
 * delete, overwrite, public URL, or automatic invocation path. The caller must
 * supply a server-side Git reader that proves every file and approval record at
 * the exact commit before the first provider request can occur.
 */
export async function archiveGitBackedArtifacts({
	bundle,
	config,
	gitManifestReceipt,
	readCommittedFile,
	put = vercelBlobPut,
}) {
	if (!config?.blob?.enabled || !config.credentials?.blobReadWriteToken) {
		return createBlobArtifactArchivePlan({ bundle, config });
	}
	const archivable = assertBlobArchivableArtifactBundle(bundle);
	const plan = buildArchivePlan(archivable, config);
	assertArchiveAuthorization({ plan, config, gitManifestReceipt });
	await assertCommittedBundle({
		bundle: archivable,
		plan,
		gitManifestReceipt,
		readCommittedFile,
	});

	const providerClassification =
		put === vercelBlobPut ? "LIVE_VERIFIED" : "MOCK_VERIFIED";
	const byGitPath = new Map(archivable.files.map((file) => [file.path, file]));
	const archived = [];
	try {
		for (const item of plan.files) {
			const file = byGitPath.get(item.git_path);
			const result = await put(item.blob_path, file.content, {
				access: "private",
				addRandomSuffix: false,
				allowOverwrite: false,
				contentType: "application/json; charset=utf-8",
				token: config.credentials.blobReadWriteToken,
			});
			if (result.pathname !== item.blob_path) {
				throw new Error(
					"Blob response pathname did not match the immutable archive plan.",
				);
			}
			archived.push(
				Object.freeze({
					kind: item.kind,
					git_path: item.git_path,
					blob_path: item.blob_path,
					sha256: item.sha256,
					bytes: item.bytes,
				}),
			);
		}
	} catch (error) {
		return archiveFailure({ plan, archived, error });
	}
	return Object.freeze({
		classification: providerClassification,
		write_performed: true,
		storage: "vercel-blob",
		access: "private",
		canonical_state: "git",
		run_id: plan.run_id,
		collected_at: new Date().toISOString(),
		source_url_or_tool: "vercel-blob:private-archive",
		scope: "private redacted Git-backed artifact archive",
		git_commit_sha: gitManifestReceipt.commit_sha,
		approval_record_path: plan.approval_record_path,
		files: Object.freeze(archived),
	});
}

export const BLOB_ARCHIVE_LIMITS = Object.freeze({
	max_files: MAX_ARCHIVE_FILES,
	max_file_bytes: MAX_ARCHIVE_FILE_BYTES,
	max_total_bytes: MAX_ARCHIVE_BYTES,
});
