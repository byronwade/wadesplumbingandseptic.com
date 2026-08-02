import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { scanForSecrets } from "../src/policy.mjs";

const root = resolve(import.meta.dirname, "../../..");
const candidates = execFileSync(
	"git",
	[
		"ls-files",
		"automation/seo-agent/src",
		"automation/seo-agent/agent",
		"automation/seo-agent/scripts",
		".github/workflows",
	],
	{ cwd: root, encoding: "utf8" },
)
	.split(/\r?\n/)
	.filter(Boolean)
	.filter((path) => !path.endsWith(".md") && !path.endsWith(".json"));
const existingCandidates = candidates.filter((path) =>
	existsSync(resolve(root, path)),
);
const findings = existingCandidates.filter((path) =>
	scanForSecrets(readFileSync(resolve(root, path), "utf8")),
);
if (findings.length)
	throw new Error(
		`Secret-like executable content detected: ${findings.join(", ")}`,
	);
console.log(
	`Secret scan passed (${existingCandidates.length} tracked executable files).`,
);
