import { spawn } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const eveCli = resolve(root, "node_modules/eve/bin/eve.js");
const child = spawn(
	process.execPath,
	[eveCli, "eval", "--strict", "--max-concurrency", "1", "--timeout", "15000"],
	{
		cwd: root,
		env: {
			...process.env,
			SEO_AGENT_ENV: "development",
			SEO_AGENT_EVAL_FIXTURE: "true",
		},
		stdio: "inherit",
	},
);
child.once("exit", (code, signal) => {
	if (signal) process.kill(process.pid, signal);
	else process.exitCode = code ?? 1;
});
