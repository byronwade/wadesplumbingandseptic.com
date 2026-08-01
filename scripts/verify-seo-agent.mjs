import { npmExecutable, runCommand } from "./verification-core.mjs";

const result = runCommand({
  name: npmExecutable(),
  args: ["--prefix", "automation/seo-agent", "run", "verify:offline"],
});
process.stdout.write(result.stdout);
process.stderr.write(result.stderr);
if (result.exit_code !== 0) process.exit(result.exit_code);
