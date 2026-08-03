import assert from "node:assert/strict";
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import {
	isRepositoryRoot,
	readRepositorySnapshotMetadata,
	stageRepositorySnapshot,
} from "../src/repository-snapshot.mjs";
import { resolveRepositoryState } from "../src/runtime.mjs";
import {
	bundleRepositorySnapshot,
	resolveEveServerRoots,
} from "../scripts/bundle-repository-snapshot.mjs";

test("a build-time repository snapshot supplies a bounded, attributable audit root", () => {
	const temporaryRoot = mkdtempSync(
		resolve(tmpdir(), "eve-repository-snapshot-"),
	);
	try {
		const destinationRoot = resolve(temporaryRoot, "repository-snapshot");
		const snapshot = stageRepositorySnapshot({
			sourceRoot: resolve(import.meta.dirname, "../../.."),
			destinationRoot,
			commitSha: "a".repeat(40),
		});
		assert.equal(isRepositoryRoot(snapshot.root), true);
		assert.equal(existsSync(resolve(snapshot.root, ".env")), false);
		assert.equal(existsSync(resolve(snapshot.root, ".git")), false);
		const metadata = readRepositorySnapshotMetadata(snapshot.root);
		assert.equal(metadata?.commit_sha, "a".repeat(40));
		assert.match(metadata?.content_sha256 ?? "", /^[a-f0-9]{64}$/);
		assert.deepEqual(metadata?.included_roots, [
			"app",
			"content",
			"seo",
			"next.config.ts",
		]);
		assert.deepEqual(
			resolveRepositoryState({ SEO_AGENT_REPOSITORY_ROOT: snapshot.root }),
			{
				repoRoot: snapshot.root,
				source: "BUNDLED_GIT_SNAPSHOT",
				commitSha: "a".repeat(40),
				contentSha256: metadata?.content_sha256,
			},
		);
	} finally {
		rmSync(temporaryRoot, { recursive: true, force: true });
	}
});

test("the snapshot is copied inside Eve Build Output rather than Vercel service config", () => {
	const temporaryRoot = mkdtempSync(resolve(tmpdir(), "eve-build-output-"));
	try {
		const snapshotRoot = resolve(temporaryRoot, "repository-snapshot");
		stageRepositorySnapshot({
			sourceRoot: resolve(import.meta.dirname, "../../.."),
			destinationRoot: snapshotRoot,
			commitSha: "b".repeat(40),
		});
		const serverRoot = resolve(temporaryRoot, ".output/server");
		mkdirSync(serverRoot, { recursive: true });
		writeFileSync(resolve(serverRoot, "index.mjs"), "export {};\n");
		const bundled = bundleRepositorySnapshot({ snapshotRoot, serverRoot });
		assert.equal(bundled.metadata.commit_sha, "b".repeat(40));
		assert.equal(
			readRepositorySnapshotMetadata(resolve(serverRoot, "repository-snapshot"))
				?.content_sha256,
			bundled.metadata.content_sha256,
		);
	} finally {
		rmSync(temporaryRoot, { recursive: true, force: true });
	}
});

test("bundling prefers the Eve-normalized Vercel server function path", () => {
	const temporaryRoot = mkdtempSync(resolve(tmpdir(), "eve-vercel-output-"));
	try {
		const snapshotRoot = resolve(temporaryRoot, "repository-snapshot");
		stageRepositorySnapshot({
			sourceRoot: resolve(import.meta.dirname, "../../.."),
			destinationRoot: snapshotRoot,
			commitSha: "c".repeat(40),
		});
		const vercelServerRoot = resolve(
			temporaryRoot,
			".vercel/output/functions/eve/__server.func",
		);
		const legacyServerRoot = resolve(
			temporaryRoot,
			".vercel/output/functions/__server.func",
		);
		const localServerRoot = resolve(temporaryRoot, ".output/server");
		for (const root of [vercelServerRoot, legacyServerRoot, localServerRoot]) {
			mkdirSync(root, { recursive: true });
			writeFileSync(resolve(root, "index.mjs"), "export {};\n");
		}
		assert.deepEqual(resolveEveServerRoots(temporaryRoot), [
			vercelServerRoot,
			legacyServerRoot,
			localServerRoot,
		]);
		const bundled = bundleRepositorySnapshot({
			snapshotRoot,
			packageRoot: temporaryRoot,
		});
		assert.equal(bundled.roots.length, 3);
		for (const root of [vercelServerRoot, legacyServerRoot, localServerRoot]) {
			assert.equal(
				readRepositorySnapshotMetadata(resolve(root, "repository-snapshot"))
					?.commit_sha,
				"c".repeat(40),
			);
		}
	} finally {
		rmSync(temporaryRoot, { recursive: true, force: true });
	}
});

test("bundling fails closed when no Eve server output exists", () => {
	const temporaryRoot = mkdtempSync(resolve(tmpdir(), "eve-missing-output-"));
	try {
		const snapshotRoot = resolve(temporaryRoot, "repository-snapshot");
		stageRepositorySnapshot({
			sourceRoot: resolve(import.meta.dirname, "../../.."),
			destinationRoot: snapshotRoot,
			commitSha: "d".repeat(40),
		});
		assert.throws(
			() =>
				bundleRepositorySnapshot({
					snapshotRoot,
					packageRoot: temporaryRoot,
				}),
			/Eve Build Output server directory is missing/,
		);
	} finally {
		rmSync(temporaryRoot, { recursive: true, force: true });
	}
});
