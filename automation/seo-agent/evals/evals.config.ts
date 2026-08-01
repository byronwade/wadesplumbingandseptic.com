import { defineEvalConfig } from "eve/evals";

// All current evals are deterministic and use no judge or external provider.
// Local Eve worlds can need more than fifteen seconds to compile and start on a
// cold Windows worker. This remains bounded and matches the CLI override.
export default defineEvalConfig({ maxConcurrency: 1, timeoutMs: 30000 });
