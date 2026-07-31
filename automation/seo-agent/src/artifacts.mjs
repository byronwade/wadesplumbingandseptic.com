import { assertEvidence, assertRunManifest, sha256 } from "./contracts.mjs";

const SAFE_RUN_ID = /^[a-z0-9][a-z0-9-]{2,79}$/;
const SAFE_ARTIFACT_PATH =
	/^seo\/(?:runs\/[a-z0-9][a-z0-9-]{2,79}\/manifest\.json|evidence\/[a-z0-9][a-z0-9-]{2,79}-[a-z0-9-]+-[a-f0-9]{12}\.json)$/;

function slug(value) {
	return (
		String(value)
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "")
			.slice(0, 48) || "evidence"
	);
}

function stringify(value) {
	return `${JSON.stringify(value, null, 2)}\n`;
}

export function buildRunArtifactBundle(manifest) {
	assertRunManifest(manifest);
	if (!SAFE_RUN_ID.test(manifest.run_id))
		throw new Error(
			"Run ID cannot be safely mapped to a versioned artifact path",
		);

	const files = [
		{
			path: `seo/runs/${manifest.run_id}/manifest.json`,
			content: stringify(manifest),
			kind: "run_manifest",
		},
	];
	const paths = new Set(files.map((file) => file.path));
	for (const [index, evidence] of (manifest.evidence ?? []).entries()) {
		assertEvidence(evidence);
		const fingerprint = sha256(evidence.payload).slice(0, 12);
		const path = `seo/evidence/${manifest.run_id}-${String(index + 1).padStart(2, "0")}-${slug(evidence.source)}-${fingerprint}.json`;
		if (paths.has(path)) throw new Error(`Duplicate artifact path: ${path}`);
		paths.add(path);
		files.push({ path, content: stringify(evidence), kind: "evidence" });
	}
	return assertArtifactBundle({
		schema_version: "1.0",
		run_id: manifest.run_id,
		files,
	});
}

export function assertArtifactBundle(bundle) {
	if (bundle?.schema_version !== "1.0" || !SAFE_RUN_ID.test(bundle.run_id))
		throw new Error("Invalid artifact bundle");
	const paths = new Set();
	for (const file of bundle.files ?? []) {
		if (!SAFE_ARTIFACT_PATH.test(file.path) || paths.has(file.path))
			throw new Error(`Unsafe or duplicate artifact path: ${file.path}`);
		if (typeof file.content !== "string" || !file.content.endsWith("\n"))
			throw new Error(`Artifact content is not canonical JSON: ${file.path}`);
		const parsed = JSON.parse(file.content);
		if (file.kind === "run_manifest") assertRunManifest(parsed);
		else if (file.kind === "evidence") assertEvidence(parsed);
		else throw new Error(`Unsupported artifact kind: ${file.kind}`);
		paths.add(file.path);
	}
	if (!paths.has(`seo/runs/${bundle.run_id}/manifest.json`))
		throw new Error("Artifact bundle is missing its run manifest");
	return bundle;
}

export function createArtifactProposal(manifest) {
	const artifactBundle = buildRunArtifactBundle(manifest);
	return {
		classification: manifest.classification,
		write_performed: false,
		requires_human_approval: true,
		required_branch_prefix: "feat/",
		forbidden_branches: ["main"],
		artifact_bundle: artifactBundle,
	};
}
