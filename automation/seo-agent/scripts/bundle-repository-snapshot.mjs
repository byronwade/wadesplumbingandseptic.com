import { cpSync, existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
	REPOSITORY_SNAPSHOT_FILE,
	isRepositoryRoot,
	readRepositorySnapshotMetadata,
} from "../src/repository-snapshot.mjs";

export function bundleRepositorySnapshot({
	snapshotRoot = resolve(import.meta.dirname, "../repository-snapshot"),
	serverRoot = resolve(import.meta.dirname, "../.output/server"),
} = {}) {
	if (!isRepositoryRoot(snapshotRoot))
		throw new Error("Repository snapshot must be staged before Eve is built.");
	if (!existsSync(serverRoot))
		throw new Error("Eve Build Output server directory is missing.");
	const metadata = readRepositorySnapshotMetadata(snapshotRoot);
	if (!metadata)
		throw new Error("Repository snapshot requires attributable metadata.");
	const destinationRoot = resolve(serverRoot, "repository-snapshot");
	rmSync(destinationRoot, { recursive: true, force: true });
	cpSync(snapshotRoot, destinationRoot, {
		recursive: true,
		dereference: false,
	});
	const bundled = readRepositorySnapshotMetadata(destinationRoot);
	if (bundled?.content_sha256 !== metadata.content_sha256)
		throw new Error(
			"Bundled repository snapshot digest does not match the staged input.",
		);
	if (!existsSync(resolve(destinationRoot, REPOSITORY_SNAPSHOT_FILE)))
		throw new Error("Bundled repository snapshot receipt is missing.");
	return Object.freeze({ root: destinationRoot, metadata: bundled });
}

function run() {
	const snapshot = bundleRepositorySnapshot();
	console.log(
		`Repository snapshot bundled into Eve Build Output (${snapshot.metadata.commit_sha}; ${snapshot.metadata.content_sha256}).`,
	);
	return snapshot;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) run();
