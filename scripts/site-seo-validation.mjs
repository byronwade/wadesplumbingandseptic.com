import { npmExecutable, runCommand } from "./verification-core.mjs"

const result = runCommand({
  name: npmExecutable(),
  args: ["run", "seo:check"],
})
process.stdout.write(result.stdout)
process.stderr.write(result.stderr)
if (result.exit_code !== 0) process.exit(result.exit_code)
