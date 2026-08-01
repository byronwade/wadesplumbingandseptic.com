# Self-Hosted Offline CI Runner

This repository includes `.github/workflows/seo-agent-offline.yml`; it is a source contract, not evidence that a runner exists. The credential-free workflow executes `npm run seo-agent:verify` after this preparation:

1. Use an ephemeral/reverted checkout of the feature branch.
2. Select the approved runner-installed Node `24.18.0` and npm `11.16.0` versions in `self-hosted-runner-policy.json` and record both versions. The offline workflow prepends that pinned Node 24 runtime to `GITHUB_PATH` before executing any check.
3. Run `npm ci --offline --ignore-scripts --omit=peer` in `automation/seo-agent` from the committed lockfile. Workflow is an unused optional peer of GitHub Tools in this Eve sidecar; omitting optional peers prevents the SDK's unused CLI/framework bundle from entering the production dependency tree.
4. Use a host firewall that disables outbound networking except the GitHub Actions control plane. Supply no Vercel, GitHub, Google, browser, production, or personal credentials.
5. With outbound networking disabled, run `npm run seo-agent:verify` at repository root. It runs every deterministic sidecar check, including the Eve build, without a registry advisory request.
6. Run `npm --prefix automation/seo-agent run audit:dependencies` only as a separately labelled advisory job when a reviewed network path is available. It receives no credentials and must report high/critical findings without changing the offline classification.
7. Archive only redacted logs, package-lock SHA-256, git commit/tree hash, test output, and the generated audit evidence JSON.

The workflow records the deterministic command, fixture-tree revision, elapsed seconds, and the verifier's original exit code before returning that same exit code. This preserves failure evidence without turning a failed verification into a green job.

The workflow intentionally does not respond to `pull_request` or `pull_request_target`: it accepts only trusted repository pushes to `feat/**`/`fix/**` and manual dispatch. It is `contents: read`, checks out with credentials disabled, passes no secrets, pins each third-party action to a full commit SHA, and has no cache or deployment step. Human runner provisioning must apply the `wades-seo-offline` label only after it proves the host controls above. Until then, the workflow and policy are `MOCK_VERIFIED`; runner operation is `BLOCKED_MISSING_CREDENTIALS`.

The runner must not execute deployment commands, Vercel CLI login, connector setup, GitHub write operations, browser-profile access, or production tests. A nonzero result blocks the trusted-branch gate. Networked adapter probes and preview/production audits are separate human-authorized jobs.
