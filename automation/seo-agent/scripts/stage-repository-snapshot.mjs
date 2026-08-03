import { fileURLToPath } from "node:url";
import { stageRepositorySnapshot } from "../src/repository-snapshot.mjs";

export function run() {
	const snapshot = stageRepositorySnapshot();
	console.log(
		`Repository snapshot staged (${snapshot.metadata.commit_sha}; ${snapshot.metadata.content_sha256}; ${snapshot.metadata.included_roots.join(", ")}).`,
	);
	return snapshot;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) run();
