import { cpSync, existsSync, rmSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
	REPOSITORY_SNAPSHOT_FILE,
	isRepositoryRoot,
	readRepositorySnapshotMetadata,
} from "../src/repository-snapshot.mjs";

const PACKAGE_ROOT = resolve(import.meta.dirname, "..");

/**
 * Eve writes `.output/server` for local Nitro hosts and
 * `.vercel/output/functions/...` for Vercel. After Eve normalizes a Services
 * build, the durable shared function lives at `eve/__server.func`; the
 * pre-normalization `__server.func` path is retained when still present.
 */
export function resolveEveServerRoots(packageRoot = PACKAGE_ROOT) {
	const candidates = [
		resolve(packageRoot, ".vercel/output/functions/eve/__server.func"),
		resolve(packageRoot, ".vercel/output/functions/__server.func"),
		resolve(packageRoot, ".output/server"),
	];
	const roots = candidates.filter((path) => isEveServerRoot(path));
	return Object.freeze([...new Set(roots)]);
}

function isEveServerRoot(path) {
	if (statSync(path, { throwIfNoEntry: false })?.isDirectory() !== true)
		return false;
	return (
		existsSync(resolve(path, "index.mjs")) ||
		existsSync(resolve(path, ".vc-config.json"))
	);
}

export function bundleRepositorySnapshot({
	snapshotRoot = resolve(PACKAGE_ROOT, "repository-snapshot"),
	serverRoot,
	serverRoots,
	packageRoot = PACKAGE_ROOT,
} = {}) {
	if (!isRepositoryRoot(snapshotRoot))
		throw new Error("Repository snapshot must be staged before Eve is built.");
	const metadata = readRepositorySnapshotMetadata(snapshotRoot);
	if (!metadata)
		throw new Error("Repository snapshot requires attributable metadata.");

	const explicitRoots = [
		...(Array.isArray(serverRoots) ? serverRoots : []),
		...(serverRoot ? [serverRoot] : []),
	].map((path) => resolve(path));
	const resolvedRoots = Object.freeze(
		(explicitRoots.length > 0
			? explicitRoots
			: [...resolveEveServerRoots(packageRoot)]
		).filter((path, index, all) => all.indexOf(path) === index),
	);
	if (resolvedRoots.length === 0)
		throw new Error(
			"Eve Build Output server directory is missing. Expected .vercel/output/functions/eve/__server.func, .vercel/output/functions/__server.func, or .output/server after eve build.",
		);

	const bundledRoots = [];
	for (const root of resolvedRoots) {
		if (!isEveServerRoot(root) && !existsSync(root))
			throw new Error(`Eve Build Output server directory is missing: ${root}`);
		const destinationRoot = resolve(root, "repository-snapshot");
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
		bundledRoots.push(destinationRoot);
	}

	return Object.freeze({
		roots: Object.freeze(bundledRoots),
		root: bundledRoots[0],
		metadata,
	});
}

function run() {
	const snapshot = bundleRepositorySnapshot();
	console.log(
		`Repository snapshot bundled into Eve Build Output (${snapshot.metadata.commit_sha}; ${snapshot.metadata.content_sha256}; ${snapshot.roots.length} server root${snapshot.roots.length === 1 ? "" : "s"}).`,
	);
	return snapshot;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) run();
