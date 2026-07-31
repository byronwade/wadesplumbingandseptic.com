# Eve SEO Agent Operations Runbook

The operational pause/resume, incident, rollback, troubleshooting, and first-30-day procedures are maintained as checklists in [HUMAN_REVIEW_AND_DEPLOYMENT.md](HUMAN_REVIEW_AND_DEPLOYMENT.md).

## Deterministic Verification

Run `npm run verify:all` from a clean feature branch. It runs the control-plane check, sidecar contracts, policy/eval tests (including `automation/seo-agent/fixtures/adversarial-policy.json`), audit-only fixture workflow, and human-only rollback drill, then emits a JSON evidence line bound to `HEAD^{tree}`. The command fails on tracked working-tree changes so it cannot claim a stale tree hash.

The self-hosted runner must run this command with Node 24 or newer, `npm ci --ignore-scripts --omit=peer` in `automation/seo-agent`, no credentials, no browser profile, and no network for the offline job. The unused optional Workflow peer of GitHub Tools is deliberately excluded from this Eve sidecar's production dependency tree. Archive redacted output, the lock hash, Node/npm versions, git tree hash, generated audit report, and manifest budget limits/usage. Do not treat the fixture report as a live deployment or customer-data audit.

## Scheduled Audit

`automation/seo-agent/agent/schedules/audit.ts` declares the native Eve/Vercel schedule at 16:17 UTC every Monday. Do not deploy the sidecar, or otherwise enable its schedule, until all of the following are true:

1. The single Vercel Services project is linked and both `site` and `eve_seo_agent` services are deployed from the reviewed root configuration.
2. Read-only tool scopes, rate limits, and the first audit-only production run are approved.
3. The Vercel Cron job is visible in project settings and the owner has recorded its disable path.

The schedule prompt permits research and reporting only. The compiled Eve tool surface has no generic shell, file-write, unrestricted web fetch/search, deployment, or merge tool, and GitHub is `repo-explorer` only. Disable the schedule in Vercel first during an incident, then detach connectors. Vercel Cron delivery can be duplicated, so configured audits read and validate canonical `seo/runs/<run-id>/manifest.json` records before collection; a matching recorded run ID is denied before any integration probe.

## AI Gateway Route and Cost Boundary

Every declared Eve agent resolves its model through `agent/model.ts`, which allows only the versioned route in `src/constants.mjs`. The Gateway tool repeats that route check, requires a safe audit run ID, and atomically reserves tool-call, token, and cost budget for that run before provider dispatch. A rejected reservation leaves the run ledger unchanged. This is ephemeral execution accounting: the returned usage belongs in the terminal Git-backed run manifest, while a worker restart safely loses only the cache. The reservation is a policy cap, not a statement of provider pricing or live aggregate-billing proof. Provider fallback evidence and trace correlation remain `BLOCKED_MISSING_CREDENTIALS` until the approved AI Gateway sidecar integration is configured.

## PR, Preview, and Production Controls

- The model receives only read-only GitHub Tools (`repo-explorer`).
- A separate human-approved publisher may create a draft PR only; its policy rejects default or ref-qualified branch names, incomplete PR packets, non-draft responses, malformed PR metadata, merges, deployments, settings/secrets changes, and auto-rollback.
- A draft cannot be ready until preview evidence includes a valid HTTPS URL, exact commit SHA, valid timestamp, non-indexability, and no critical findings. Credential-blocked preview evidence is never ready.
- Production audit is read-only and requires an explicit human merge SHA, a deployment ID, and a matching deployment commit SHA. Credential-blocked production evidence is never verified. A human alone reverts a PR or rolls back Vercel.

## Live Adapter Triage

| Adapter          | Required evidence before `LIVE_VERIFIED`                    | Safe degraded behavior                                 |
| ---------------- | ----------------------------------------------------------- | ------------------------------------------------------ |
| GitHub / Connect | Connector ID, repository scope, read probe, approval policy | Repository fixture and no PR write.                    |
| Vercel / MCP     | Project scope, OAuth setup, deployment/preview probe        | `BLOCKED_MISSING_CREDENTIALS`; no deployment action.   |
| Search Console   | Read-only property, OAuth scope, redacted query probe       | Fixture-only demand evidence; no ownership assignment. |
| PageSpeed        | Approved API key, target URL, timestamped response          | Fixture-only performance result.                       |
| Browser research | Allowed domain and rate policy, redacted source capture     | Disabled; no public web claim.                         |
| Sandbox          | Eve service OIDC, allowed commands/network/mount policy     | Disabled; no command execution.                        |

## Incident Response

1. Disable Cron and detach the relevant Vercel Connect connector.
2. Revoke exposed provider credentials at the provider; never add a replacement secret to Git.
3. Preserve redacted workflow correlation IDs, deployment IDs, and evidence hashes.
4. If published content is implicated, a human reverts the merged PR or rolls back to a known-good Vercel deployment.
5. Open a follow-up evidence record and add a regression fixture before re-enabling automation.

## Operational Telemetry and Alerting

The sidecar records only safe, schema-checked event fields: run/workflow correlation, job/phase/attempt/status, duration, model/provider identifiers, bounded token/cost counters, source/file counts, branch/PR/preview reference, and error/retry classification. It never logs prompts, raw web content, request/response bodies, query dimensions, credentials, email addresses, phone numbers, cookies, or connection URLs. `npm --prefix automation/seo-agent run observability:fixture` and its tests prove the redaction and alert contract without sending telemetry.

The deterministic alert evaluator reports missed Cron, stale runs, repeated failures, budget cost threshold, preview regression, and production regression. It also emits success, failure, retry, duration, cost, draft-PR, no-op, and policy-block metrics. Alert delivery, a trace sink, and provider-visible end-to-end correlation remain `BLOCKED_MISSING_CREDENTIALS` until a human approves a redacted observability destination and records a live probe. See `THREAT_MODEL.md` for response ownership.

## Human Rollback Drill

Run `npm --prefix automation/seo-agent run rollback:drill` as part of the deterministic offline gate. It emits a fixed-time `MOCK_VERIFIED` drill record that proves the operational sequence is human-only: disable the Vercel Cron, detach or revoke the affected connector as appropriate, either revert the human-merged PR or select a known-good Vercel deployment, record the result in the linked run or experiment record, and add a regression fixture before re-enabling automation.

The command makes no provider, GitHub, Vercel, repository, or filesystem write. It does not test a production rollback and cannot authorize one. A live incident still requires a human to choose and execute the rollback target, preserve redacted evidence, and record the result after the fact.

## Optional Private Blob Archive

Git is the authoritative run record. The optional Blob archive is only a private copy of the canonical, redacted `seo/runs/<run-id>/manifest.json` and its referenced redacted evidence. Before invoking it, a human must confirm that the Git manifest is committed, add a reviewed `seo/runs/<run-id>/blob-archive-approval.json` binding that manifest/bundle digests to the exact run, and use a read-only Git reader to prove every bundle byte at the pinned full commit SHA. Then set `SEO_AGENT_BLOB_ENABLED=true`, set the exact `SEO_AGENT_BLOB_APPROVED_RUN_ID`, and temporarily set `SEO_AGENT_BLOB_ARCHIVE_APPROVED=true` in the reviewed Eve-service production environment. Services shares a project-level server environment scope, so approve Blob only after confirming that scope and never expose it to `NEXT_PUBLIC_`. The archive API refuses all other environments, missing approvals, mismatched run IDs, non-committed/tampered bundle bytes, unsafe prefixes, raw payload shapes, oversized bundles, public access, random suffixes, and overwrites.

The resulting operations record retains only run ID, full Git commit SHA, Git path, Blob pathname, SHA-256, byte count, private-access status, timestamp, tool identity, and approval-record path. It must not retain a Blob URL, token, raw source payload, query data, browser output, prompt, or customer data. A partial provider failure is `FAILED`, retains only completed immutable paths, and must not auto-retry. Remove the temporary archive approval after the reviewed write. During an incident, remove the sidecar Blob token or detach Blob access after pausing Cron; do not delete evidence automatically.
