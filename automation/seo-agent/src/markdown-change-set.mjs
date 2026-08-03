import { DEFAULT_BUDGETS } from "./constants.mjs";
import { sha256 } from "./contracts.mjs";
import { scanForSecrets } from "./policy.mjs";
import { validateMarkdownDraft } from "./strategy.mjs";

const SAFE_PROPOSAL_ID = /^[a-z0-9][a-z0-9-]{2,79}$/;
const SAFE_MARKDOWN_PATH =
	/^content\/(?:pages|posts|services)\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;
const SAFE_SOURCED_IMAGE_PATH =
	/^public\/images\/sourced\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*\.(?:webp|jpe?g|png|svg)$/;
const SAFE_PROVENANCE_PATH =
	/^public\/images\/sourced\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*\.provenance\.json$/;
const OPERATIONS = new Set(["CREATE", "UPDATE"]);
const MAX_BASE64_CHARS = 3_500_000;

function countLines(content) {
	return content.split("\n").length;
}

function assertMarkdownPath(path) {
	if (typeof path !== "string" || !SAFE_MARKDOWN_PATH.test(path)) {
		throw new Error(
			"Markdown change path must be a safe content/pages, content/posts, or content/services Markdown path",
		);
	}
	return path;
}

function assertImageAssetPath(path) {
	if (typeof path !== "string" || !SAFE_SOURCED_IMAGE_PATH.test(path)) {
		throw new Error(
			"Image asset path must be under public/images/sourced/<slug>/ with an approved extension",
		);
	}
	return path;
}

function assertProvenancePath(path) {
	if (typeof path !== "string" || !SAFE_PROVENANCE_PATH.test(path)) {
		throw new Error(
			"Image provenance path must be a public/images/sourced/<slug>/*.provenance.json file",
		);
	}
	return path;
}

function assertUtf8TextFile(file, path) {
	if (typeof file.content !== "string" || !file.content.trim())
		throw new Error(`Change content is required: ${path}`);
	if (file.content.includes("\r"))
		throw new Error(`Change content must use LF line endings: ${path}`);
	if (scanForSecrets(file.content))
		throw new Error(`Change contains a possible secret: ${path}`);
	return Object.freeze({
		path,
		operation: file.operation,
		content: file.content,
		encoding: "utf8",
		kind: file.kind ?? "markdown",
		line_count: countLines(file.content),
		content_sha256: sha256(file.content),
	});
}

function assertBase64ImageFile(file, path) {
	if (typeof file.content_base64 !== "string" || !file.content_base64.trim())
		throw new Error(`Base64 image content is required: ${path}`);
	if (file.content_base64.length > MAX_BASE64_CHARS)
		throw new Error(`Staged image exceeds size budget: ${path}`);
	if (!/^[A-Za-z0-9+/=\s]+$/.test(file.content_base64))
		throw new Error(`Staged image is not valid base64: ${path}`);
	const compact = file.content_base64.replace(/\s+/g, "");
	return Object.freeze({
		path,
		operation: file.operation,
		content_base64: compact,
		encoding: "base64",
		kind: "image_asset",
		line_count: 0,
		content_sha256: sha256(compact),
	});
}

function assertChangeFile(file) {
	if (!file || typeof file !== "object")
		throw new Error("Markdown change file must be an object");
	if (!OPERATIONS.has(file.operation))
		throw new Error(`Unsupported Markdown change operation: ${file.operation}`);

	if (SAFE_SOURCED_IMAGE_PATH.test(file.path ?? "")) {
		const path = assertImageAssetPath(file.path);
		if (file.encoding === "base64" || typeof file.content_base64 === "string") {
			return assertBase64ImageFile(file, path);
		}
		const normalized = assertUtf8TextFile(file, path);
		if (!path.endsWith(".svg")) {
			throw new Error(
				"Only SVG image assets may use utf8 content; raster images require base64.",
			);
		}
		return Object.freeze({ ...normalized, kind: "image_asset" });
	}

	if (SAFE_PROVENANCE_PATH.test(file.path ?? "")) {
		const path = assertProvenancePath(file.path);
		const normalized = assertUtf8TextFile(file, path);
		try {
			const parsed = JSON.parse(normalized.content);
			if (parsed?.schema_version !== "1.0" || !parsed?.rights_evidence_id) {
				throw new Error("invalid provenance");
			}
		} catch {
			throw new Error(`Image provenance JSON is invalid: ${path}`);
		}
		return Object.freeze({ ...normalized, kind: "image_provenance" });
	}

	const path = assertMarkdownPath(file.path);
	if (typeof file.content !== "string" || !file.content.trim())
		throw new Error(`Markdown change content is required: ${path}`);
	if (file.content.includes("\r"))
		throw new Error(
			`Markdown change content must use LF line endings: ${path}`,
		);
	if (scanForSecrets(file.content))
		throw new Error(`Markdown change contains a possible secret: ${path}`);
	validateMarkdownDraft(file.content);
	return Object.freeze({
		path,
		operation: file.operation,
		content: file.content,
		encoding: "utf8",
		kind: "markdown",
		line_count: countLines(file.content),
		content_sha256: sha256(file.content),
	});
}

/**
 * Builds a bounded, immutable proposal for a future Markdown migration.
 * May include staged sourced images + provenance under public/images/sourced/.
 * This only validates and describes a change set. It never creates a branch,
 * writes a file, or makes a GitHub request.
 */
export function buildMarkdownChangeSet({
	proposalId,
	files,
	budgets = DEFAULT_BUDGETS,
}) {
	if (typeof proposalId !== "string" || !SAFE_PROPOSAL_ID.test(proposalId)) {
		throw new Error("Markdown change set requires a safe proposal ID");
	}
	if (!Array.isArray(files) || files.length === 0)
		throw new Error("Markdown change set requires at least one file");
	if (files.length > budgets.maxChangedFiles)
		throw new Error(
			`Markdown change set exceeds changed-file budget (${files.length}/${budgets.maxChangedFiles})`,
		);

	const paths = new Set();
	let markdownCount = 0;
	const normalizedFiles = files.map((file) => {
		const normalized = assertChangeFile(file);
		if (paths.has(normalized.path))
			throw new Error(
				`Markdown change set contains a duplicate path: ${normalized.path}`,
			);
		paths.add(normalized.path);
		if (normalized.kind === "markdown") markdownCount += 1;
		return normalized;
	});
	if (markdownCount < 1) {
		throw new Error(
			"Draft change set requires at least one Markdown content file",
		);
	}
	const changedLines = normalizedFiles.reduce(
		(total, file) => total + file.line_count,
		0,
	);
	if (changedLines > budgets.maxChangedLines) {
		throw new Error(
			`Markdown change set exceeds changed-line budget (${changedLines}/${budgets.maxChangedLines})`,
		);
	}

	return Object.freeze({
		schema_version: "1.0",
		proposal_id: proposalId,
		source_of_truth: "FUTURE_MARKDOWN_MIGRATION",
		publication_state: "REQUIRES_APPROVED_MIGRATION_AND_HUMAN_APPROVAL",
		write_performed: false,
		required_branch_prefix: "eve/seo/",
		forbidden_branches: ["main"],
		files: Object.freeze(normalizedFiles),
		changed_files: normalizedFiles.length,
		changed_lines: changedLines,
	});
}

export function assertMarkdownChangeSet(changeSet, budgets = DEFAULT_BUDGETS) {
	if (!changeSet || changeSet.schema_version !== "1.0")
		throw new Error("Invalid Markdown change set schema version");
	if (changeSet.source_of_truth !== "FUTURE_MARKDOWN_MIGRATION")
		throw new Error(
			"Markdown change set has an invalid source-of-truth boundary",
		);
	if (
		changeSet.publication_state !==
		"REQUIRES_APPROVED_MIGRATION_AND_HUMAN_APPROVAL"
	) {
		throw new Error(
			"Markdown change set must require migration and human approval",
		);
	}
	if (changeSet.write_performed !== false)
		throw new Error("Markdown change-set planning cannot record a write");
	if (
		changeSet.required_branch_prefix !== "eve/seo/" ||
		!Array.isArray(changeSet.forbidden_branches) ||
		!changeSet.forbidden_branches.includes("main")
	) {
		throw new Error("Markdown change set has invalid branch constraints");
	}
	const rebuilt = buildMarkdownChangeSet({
		proposalId: changeSet.proposal_id,
		files: changeSet.files,
		budgets,
	});
	if (
		changeSet.changed_files !== rebuilt.changed_files ||
		changeSet.changed_lines !== rebuilt.changed_lines
	) {
		throw new Error("Markdown change set has inconsistent change totals");
	}
	for (const [index, file] of rebuilt.files.entries()) {
		if (
			changeSet.files[index]?.content_sha256 !== file.content_sha256 ||
			changeSet.files[index]?.line_count !== file.line_count
		) {
			throw new Error(
				`Markdown change set has inconsistent file digest: ${file.path}`,
			);
		}
	}
	return changeSet;
}
