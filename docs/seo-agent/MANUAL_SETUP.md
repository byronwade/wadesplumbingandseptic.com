# Eve SEO Agent Manual Setup

> Review checklist: use [HUMAN_REVIEW_AND_DEPLOYMENT.md](HUMAN_REVIEW_AND_DEPLOYMENT.md) as the authoritative human handoff. Every cloud/integration checkbox in that guide is intentionally unchecked unless a human records independent evidence.

## Safety Before Setup

Complete this only after Phases 1-4 have passed. Use this repository's one Vercel Services project, which builds the public site and `automation/seo-agent` independently in one deployment. Never paste tokens into repository files, committed configuration, prompts, evidence, or PR descriptions.

## Required Human Actions

1. Request/confirm Vercel Services beta access, then link the repository's single Vercel project at its root. Set its framework to **Services** and retain `vercel.json` at the repository root. Confirm `site` is rooted at `.`, `eve_seo_agent` is rooted at `automation/seo-agent`, and top-level rewrites send `/_internal/eve/*` to Eve and all other public traffic to the site.
2. The committed root `vercel.json` runs isolated install/build commands for each service and uses rewrite-based Services routing (not legacy `routePrefix`). Do not add manual Vercel Cron configuration: Eve emits schedule metadata during its build. Pull only local development environment values; never commit `.env*` files. The native schedule triggers durable Eve work directly; do not duplicate it with `/api/cron`.
3. Configure Vercel AI Gateway for the sidecar. Record the project/environment identity and a redacted successful probe in the run manifest.
4. Create a dedicated Vercel Connect GitHub connector with access limited to `byronwade/wadesplumbingandseptic.com`. Attach only the required environments and choose read scope plus draft-PR capability; do not grant merge, administration, secrets, deployments, releases, or broad organization scope. Configure each GitHub write operation to require explicit human approval.
5. If GitHub mention/webhook triggering is adopted, attach Connect triggers only to the deployed sidecar path. Verify webhook delivery through a non-destructive mention/fixture and document the deployed URL.
6. Grant `webmasters.readonly` Search Console access and a restricted PageSpeed key. Set only the specific `SEO_AGENT_ENABLE_*` flags for connectors reviewed by the owner. Add GA4 Data API read access, Business Profile `business.manage` access, Browserbase, Local Falcon, Similarweb, Google Trends alpha, or tracing only after a per-adapter privacy/scope review. Browserbase must use a separate project and one short non-keepalive read-only session; its connection URL must never be persisted. If any service is unavailable, alpha-gated, or lacks a documented approved endpoint, create a `BLOCKED_MISSING_CREDENTIALS` record rather than sharing credentials informally. If a configured/reachable probe errors or the required sidecar endpoint is absent, record `FAILED` with a safe request ID and corrective action; never relabel it as credential-blocked.
7. Configure Vercel project access for preview/production read-only deployment inspection. The agent must not receive deploy, promote, alias, domain, project-settings, or environment-variable write permissions.
8. Set Cron schedules only after the audit-only run succeeds. Start with a low-frequency schedule and hard budgets; record timezone, cron expression, owner, max runs, and disable path in versioned config. If a human separately configures an external caller for `GET /_internal/eve/api/cron`, set a unique encrypted `CRON_SECRET` of at least 24 characters as a reviewed server variable and send it only as `Authorization: Bearer <CRON_SECRET>`; the endpoint has no fallback authentication. Native Eve scheduling is platform-authenticated and does not require this secret.
9. Confirm branch protection requires human review and blocks direct default-branch changes. Confirm Vercel Git integration produces preview deployments for PRs and production deployment only from approved `main` changes.
10. Review deployment protection so the sidecar can audit only URLs to which it has explicitly authorized read access. Avoid giving it a bypass token for the public production site.
11. If the owner wants redacted artifact copies, attach the existing Vercel Blob store only after reviewing the shared Services project server-environment scope. Keep `BLOB_READ_WRITE_TOKEN` encrypted, absent from local development/previews, Git, and every `NEXT_PUBLIC_` variable. Set `SEO_AGENT_BLOB_ENABLED=true` only after confirming Git remains the canonical store. Before a single reviewed archive, require a read-only Git reader to verify the exact full commit and every manifest/evidence byte; that commit must include `seo/runs/<run-id>/blob-archive-approval.json` with the run ID, manifest/bundle digests, approval timestamp, and a non-secret review reference. Then temporarily set `SEO_AGENT_BLOB_ARCHIVE_APPROVED=true` and `SEO_AGENT_BLOB_APPROVED_RUN_ID` to that exact run ID; remove both variables after verification. Do not grant the agent a public-serving, list, or delete workflow.

## Live Verification Record (2026-07-30)

- [x] The locally configured GitHub principal completed a repository read and a disposable draft-PR exercise. Draft PR #7 was closed without merge, and its named remote branch was deleted immediately after readback. This does not prove the sidecar's Vercel Connect installation.
- [x] The locally configured Vercel CLI read the existing public-site project and a ready preview deployment. This does not prove Vercel Services availability, the `eve_seo_agent` route, or any sidecar adapter credential.
- [x] The allowlisted browser-research adapter retrieved the public `robots.txt` document without retaining its raw content.
- [ ] Vercel Services availability and one-project deployment: not verified in the accessible Vercel team. Do not approximate this by deploying the sidecar as a second project.
- [ ] AI Gateway, Eve workflow, protected Cron, Search Console, PageSpeed, Vercel sidecar adapter, optional providers, browser session, and trace sink: not verified because no Services deployment/environment was accessible to this verification run.
- [ ] Eve `healthz` and `readyz`: the required Services paths are `/_internal/eve/api/healthz` and `/_internal/eve/api/readyz`; legacy root-path HTML fallback is not a healthy sidecar.

See `seo/evidence/live-integration-verification-2026-07-30.json` for timestamps, redacted request identifiers, scopes, classifications, and corrective actions. No content was published, no Business Profile data changed, no branch was merged, and no push reached `main`.

The sidecar package requires Node 24 or newer. Eve owns the Vercel Sandbox runtime image and the sidecar denies all network egress by default. Do not relax that policy through an environment variable. Any future sandbox network access or workspace source must be a reviewed versioned change with a matching regression test and must remain unavailable to untrusted/generated commands by default. After the Services configuration is linked, a human may test only the isolated smoke path by temporarily setting `SEO_AGENT_SANDBOX_INTEGRATION_APPROVED=true` in the reviewed production Eve-service environment and running `npm --prefix automation/seo-agent run sandbox:integration`. It creates a `node24` deny-all Sandbox, runs one benign Node stdout command, stops it, and prints a redacted record. Do not set this approval in development, previews, or repository files.

The offline audit fixture renders a proposal only. It does not write the rendered `seo/runs/` or `seo/evidence/` files to the working tree. After human approval, a future scoped GitHub draft-PR gateway may publish that exact proposal only on a non-`main` feature branch.

After configuration, run `npm --prefix automation/seo-agent run live:probe` to produce a no-network plan. For the first production audit only, an authorized human must set the non-secret production-sidecar approval values to one planned run ID, then run the matching probe: `$env:SEO_AGENT_ENV='production'; $env:SEO_AGENT_LIVE_READS_APPROVED='true'; $env:SEO_AGENT_LIVE_READS_APPROVED_RUN_ID='first-production-audit-YYYY-MM-DD'; npm --prefix automation/seo-agent run live:probe -- --execute --run-id=first-production-audit-YYYY-MM-DD`. Shared probe code rejects every execution outside production, without approval, or with a non-matching run ID; remove the approval values after the reviewed audit. It uses only read endpoints and prints redacted evidence. Do not redirect that output into Git until it has been reviewed for the required `seo/` evidence packet. Adding another browser-research domain requires a reviewed versioned-policy change; it cannot be supplied ad hoc through the environment.

## Environment and Connector Inventory

Maintain a redacted inventory in `seo/manifests/integration-inventory.json`; it must contain no secret values.

| Integration                      | Minimum scope                                                                   | Default state                         | Live-proof requirement                                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Vercel / Eve / AI Gateway        | One Services project; OIDC preferred, no `NEXT_PUBLIC_` access                  | Blocked until linked                  | Eve service deployment and redacted OIDC/Gateway probe.                                                                                   |
| Vercel Sandbox                   | Eve service only                                                                | Blocked until project policy approves | Isolated fixture command; no public-site write mount.                                                                                     |
| GitHub via Connect               | Read repository + create draft PR after approval                                | Blocked until installed               | Read probe and draft-only mock/live policy proof.                                                                                         |
| Search Console                   | Read-only property access                                                       | Optional                              | Redacted query/page probe.                                                                                                                |
| PageSpeed                        | Read-only public API/query                                                      | Optional                              | Timestamped target-URL result.                                                                                                            |
| Browserbase                      | Separate Browserbase project; short read-only session                           | Optional                              | Redacted session ID/status; never persist CDP connection URL.                                                                             |
| Browser research                 | Explicit versioned public-domain allowlist                                      | Required                              | Redacted HTTP public-document retrieval and injection-defense evidence. This is not browser automation.                                   |
| Browser automation               | Reviewed isolated provider; explicit domain allowlist; no credential forwarding | Optional                              | Redacted browser-provider result. It remains `BLOCKED_MISSING_CREDENTIALS` until a reviewed provider adapter is installed.                |
| GA4                              | Analytics Data API read-only property                                           | Optional                              | Redacted aggregate `runReport` query.                                                                                                     |
| Business Profile                 | `business.manage`, performance reads only                                       | Optional                              | Redacted performance time-series probe.                                                                                                   |
| Local Falcon                     | OAuth/MCP or read-only API key                                                  | Optional                              | Redacted documented report-list probe.                                                                                                    |
| Similarweb / Google Trends alpha | Reviewed vendor access only                                                     | Optional                              | `BLOCKED_MISSING_CREDENTIALS` unless the owner supplies documented approved access.                                                       |
| Tracing / OTEL                   | Write telemetry only, no secrets in spans                                       | Optional                              | Redacted trace correlation ID.                                                                                                            |
| Vercel Blob artifact archive     | Reviewed shared server scope; bounded redacted JSON copies only                 | Optional                              | Exact approved run ID, Git-verified bundle plus committed approval record, and private non-overwrite probe with no provider URL retained. |

## Preview and Production Checklist

Before a content PR can be ready for human review, record the draft PR URL, exact commit SHA, public-site preview URL, sidecar preview URL if changed, preview audit timestamp, content/schema/SEO checks, and any blocked live check. After a human merge, record the production deployment URL/ID, commit association, read-only audit result, and rollback recommendation if any. Do not mark a deployment verified from a build log alone.

## Controlled Publishing Lifecycle

The lifecycle implementation is intentionally fixture-only until an owner completes the prerequisites above. Its injected gateway has no automatic merge operation, and the deployed sidecar must not add one. It must never receive force-push, default-branch write, delete, deployment, Vercel-settings, secret, release, or repository-administration permission.

Keep these sidecar-only controls disabled by default:

- `SEO_AGENT_MUTATION_MODE=disabled`
- `SEO_AGENT_PUBLISHING_HUMAN_APPROVED=false`
- `SEO_AGENT_PUBLISHING_INTEGRATION_TEST=false`

An authorized integration proof requires all three values to be enabled for the single reviewed exercise and the runtime mutation kill switch to be off. The integration-test flag is not a production authorization: it only prevents a real GitHub/Vercel action from being reachable accidentally in local or fixture runs. Remove the temporary values immediately afterward and retain only redacted evidence.

For each approved opportunity, the gateway must read the current `main` SHA, create a deny-all isolated sandbox checkout at that SHA, gather versioned evidence, select exactly one existing-page-first opportunity, validate a bounded Markdown patch, and create only `eve/seo/YYYY-MM-DD-<slug>`. It may then create an attributed commit and draft PR, attach `seo-agent`, risk, and content labels, wait for the existing self-hosted CI result, detect the Vercel preview, audit affected non-indexable preview URLs, and comment the findings. It may mark the PR ready only after CI and preview gates pass. It only observes a human merge, then performs a read-only production audit and writes a redacted entry to the monthly SEO operations issue.

Do not configure a publishing gateway until it has a reviewed comprehensive PR-body template, a human-approval record, approved service-area facts, a versioned evidence packet, a rollback note, and all deterministic lifecycle fixtures passing. If any gate is unavailable or fails, leave the PR draft and record `BLOCKED_MISSING_CREDENTIALS` or the failed gate; do not work around it.

## Emergency Disable and Rollback

- Disable the Eve service Cron schedule first; then remove or detach the relevant connector from the Vercel Services project.
- Revoke compromised connector credentials through Vercel Connect/GitHub, not by committing replacement secrets.
- For published content, a human reverts the merged PR or rolls Vercel back to a known-good deployment, then documents the outcome in the linked manifest.
- The completion hook remains disabled unless the sentinel is deliberately created in Phase 10. The sentinel is an enforcement switch, not a runtime requirement.
- Before enabling a connector or Cron, run `npm --prefix automation/seo-agent run rollback:drill`. It proves only the documented, human-only rollback sequence and performs no live rollback, provider call, or repository write.
