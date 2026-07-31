import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
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
const findings = candidates.filter((path) =>
	scanForSecrets(readFileSync(resolve(root, path), "utf8")),
);
if (findings.length)
	throw new Error(
		`Secret-like executable content detected: ${findings.join(", ")}`,
	);
console.log(
	`Secret scan passed (${candidates.length} tracked executable files).`,
);
