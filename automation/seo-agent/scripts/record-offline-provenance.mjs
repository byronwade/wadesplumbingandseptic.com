import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "../../..");
const outputRoot = process.env.RUNNER_TEMP;
if (!outputRoot)
	throw new Error("RUNNER_TEMP is required to write offline CI provenance.");
const args = new Map(
	process.argv.slice(2).map((argument) => {
		const [name, value] = argument.split("=", 2);
		return [name, value];
	}),
);
const exitCode = Number(args.get("--exit-code"));
const durationSeconds = Number(args.get("--duration-seconds"));
const verificationCommand =
	args.get("--verification-command") ?? "npm run seo-agent:verify";
if (!Number.isInteger(exitCode) || exitCode < 0 || exitCode > 255)
	throw new Error(
		"Offline CI provenance requires an exit code from 0 through 255.",
	);
if (!Number.isInteger(durationSeconds) || durationSeconds < 0)
	throw new Error(
		"Offline CI provenance requires a non-negative whole duration.",
	);
if (!/^npm run [a-z0-9:-]+$/i.test(verificationCommand))
	throw new Error(
		"Offline CI provenance requires a safe npm verification command.",
	);
const npmCliCandidates = [
	process.env.npm_execpath,
	resolve(dirname(process.execPath), "../lib/node_modules/npm/bin/npm-cli.js"),
	resolve(dirname(process.execPath), "node_modules/npm/bin/npm-cli.js"),
].filter(Boolean);
const npmCli = npmCliCandidates.find((candidate) => existsSync(candidate));
if (!existsSync(npmCli))
	throw new Error("npm CLI entry point is unavailable for CI provenance.");

const git = (args) =>
	execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
const npmVersion = execFileSync(process.execPath, [npmCli, "--version"], {
	encoding: "utf8",
}).trim();
const outputPath = resolve(outputRoot, "seo-agent-offline-provenance.json");

mkdirSync(outputRoot, { recursive: true });
writeFileSync(
	outputPath,
	`${JSON.stringify(
		{
			schema_version: "1.0",
			classification: "MOCK_VERIFIED",
			scope: "self_hosted_offline_ci",
			verification_command: verificationCommand,
			exit_code: exitCode,
			duration_seconds: durationSeconds,
			commit: git(["rev-parse", "HEAD"]),
			tree_hash: git(["rev-parse", "HEAD^{tree}"]),
			fixture_revision: git([
				"rev-parse",
				"HEAD:automation/seo-agent/fixtures",
			]),
			node_version: process.version.replace(/^v/, ""),
			npm_version: npmVersion,
			sidecar_lock_sha256: git([
				"hash-object",
				"automation/seo-agent/package-lock.json",
			]),
			generated_at: new Date().toISOString(),
		},
		null,
		2,
	)}\n`,
	"utf8",
);

console.log(`Offline CI provenance written to ${outputPath}.`);
