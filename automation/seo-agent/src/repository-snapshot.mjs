import {
	cpSync,
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	rmSync,
	statSync,
	writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { join, relative, resolve } from "node:path";

export const REPOSITORY_SNAPSHOT_FILE = ".eve-seo-agent-snapshot.json";
export const REPOSITORY_SNAPSHOT_SCHEMA_VERSION = "1.0";

const SNAPSHOT_DIRECTORIES = Object.freeze([
	"actions",
	"app",
	"content",
	"seo",
]);
const REQUIRED_SNAPSHOT_PATHS = Object.freeze([
	"app",
	"content",
	"seo/manifests/pages.json",
	"seo/manifests/approved-facts.json",
	"seo/manifests/brand-context.json",
	"seo/manifests/query-ownership.json",
]);

function isDirectory(path) {
	return statSync(path, { throwIfNoEntry: false })?.isDirectory() === true;
}

function isFile(path) {
	return statSync(path, { throwIfNoEntry: false })?.isFile() === true;
}

function resolveNextConfig(sourceRoot) {
	for (const name of ["next.config.ts", "next.config.mjs", "next.config.js"]) {
		if (isFile(join(sourceRoot, name))) return name;
	}
	throw new Error(
		"Repository snapshot requires a supported Next configuration file.",
	);
}

function gitCommit(sourceRoot) {
	const configured = process.env.VERCEL_GIT_COMMIT_SHA;
	if (/^[a-f0-9]{40}$/i.test(configured ?? "")) return configured;
	try {
		const value = execFileSync("git", ["rev-parse", "HEAD"], {
			cwd: sourceRoot,
			encoding: "utf8",
			stdio: ["ignore", "pipe", "ignore"],
		}).trim();
		if (/^[a-f0-9]{40}$/i.test(value)) return value;
	} catch {
		// A local fixture may not live in a Git checkout. Callers must then pass a SHA.
	}
	return null;
}

function snapshotDigest(destinationRoot) {
	const files = [];
	const visit = (directory) => {
		for (const entry of readdirSync(directory, { withFileTypes: true })) {
			const path = join(directory, entry.name);
			if (entry.isDirectory()) visit(path);
			else if (entry.isFile()) files.push(path);
		}
	};
	visit(destinationRoot);
	return createHash("sha256")
		.update(
			files
				.sort()
				.map(
					(path) => `${relative(destinationRoot, path)}\0${readFileSync(path)}`,
				)
				.join("\n"),
		)
		.digest("hex");
}

export function isRepositoryRoot(root) {
	return (
		typeof root === "string" &&
		isDirectory(root) &&
		REQUIRED_SNAPSHOT_PATHS.every((path) => existsSync(join(root, path))) &&
		["next.config.ts", "next.config.mjs", "next.config.js"].some((name) =>
			isFile(join(root, name)),
		)
	);
}

export function readRepositorySnapshotMetadata(root) {
	if (!isRepositoryRoot(root)) return null;
	const path = join(root, REPOSITORY_SNAPSHOT_FILE);
	if (!isFile(path)) return null;
	const metadata = JSON.parse(readFileSync(path, "utf8"));
	if (
		metadata?.schema_version !== REPOSITORY_SNAPSHOT_SCHEMA_VERSION ||
		!/^[a-f0-9]{40}$/i.test(metadata?.commit_sha ?? "") ||
		!/^[a-f0-9]{64}$/i.test(metadata?.content_sha256 ?? "")
	) {
		throw new Error("Repository snapshot metadata is invalid.");
	}
	return Object.freeze(metadata);
}

export function stageRepositorySnapshot({
	sourceRoot = resolve(import.meta.dirname, "../../.."),
	destinationRoot = resolve(import.meta.dirname, "../repository-snapshot"),
	commitSha = gitCommit(sourceRoot),
} = {}) {
	if (!/^[a-f0-9]{40}$/i.test(commitSha ?? ""))
		throw new Error("Repository snapshot requires the exact Git commit SHA.");
	if (!isRepositoryRoot(sourceRoot))
		throw new Error("Repository snapshot source is incomplete.");
	const normalizedSource = resolve(sourceRoot);
	const normalizedDestination = resolve(destinationRoot);
	if (normalizedSource === normalizedDestination)
		throw new Error(
			"Repository snapshot destination must be separate from source.",
		);
	rmSync(normalizedDestination, { recursive: true, force: true });
	mkdirSync(normalizedDestination, { recursive: true });
	const includedDirectories = SNAPSHOT_DIRECTORIES.filter((directory) =>
		isDirectory(join(normalizedSource, directory)),
	);
	for (const directory of includedDirectories) {
		cpSync(
			join(normalizedSource, directory),
			join(normalizedDestination, directory),
			{
				recursive: true,
				dereference: false,
			},
		);
	}
	const nextConfig = resolveNextConfig(normalizedSource);
	cpSync(
		join(normalizedSource, nextConfig),
		join(normalizedDestination, nextConfig),
	);
	const contentSha256 = snapshotDigest(normalizedDestination);
	const metadata = Object.freeze({
		schema_version: REPOSITORY_SNAPSHOT_SCHEMA_VERSION,
		commit_sha: commitSha,
		content_sha256: contentSha256,
		included_roots: Object.freeze([...includedDirectories, nextConfig]),
	});
	writeFileSync(
		join(normalizedDestination, REPOSITORY_SNAPSHOT_FILE),
		`${JSON.stringify(metadata, null, 2)}\n`,
	);
	return Object.freeze({ root: normalizedDestination, metadata });
}
