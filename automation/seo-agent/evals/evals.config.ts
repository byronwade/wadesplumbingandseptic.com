import { defineEvalConfig } from "eve/evals";

// All current evals are deterministic and use no judge or external provider.
export default defineEvalConfig({ maxConcurrency: 1, timeoutMs: 15000 });
