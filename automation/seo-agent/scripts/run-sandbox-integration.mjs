import { Sandbox } from "@vercel/sandbox";
import { runSandboxIntegration } from "../src/sandbox-integration.mjs";

const result = await runSandboxIntegration({ SandboxFactory: Sandbox });
console.log(JSON.stringify(result));
if (result.classification === "LIVE_VERIFIED" && result.command_exit_code !== 0)
	process.exitCode = 1;
