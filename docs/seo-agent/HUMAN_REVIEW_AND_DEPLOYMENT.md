# Human Review and Deployment Guide

## Architecture Decision

This repository uses one Vercel Services project from this GitHub repository. It independently builds and routes two services in one deployment:

| Service         | Root directory         | Route prefix     | Purpose                                               |
| --------------- | ---------------------- | ---------------- | ----------------------------------------------------- |
| `site`          | repository root        | `/`              | Customer-facing Next.js site                          |
| `eve_seo_agent` | `automation/seo-agent` | `/_internal/eve` | Backend-only audit, research, and draft-PR operations |

The sidecar has no public UI, CMS, or application database. Git remains the durable evidence/state authority. The sidecar cannot merge, deploy, force-push, write `main`, change repository settings, or change secrets. It is currently blocked from live audit execution until a human-approved Git-backed manifest persistence mechanism is configured.

Vercel Services is a deployment boundary, not a static-secret boundary: project-level server environment variables can be available to both services. Prefer Vercel OIDC and Connect, keep every agent value out of `NEXT_PUBLIC_`, and use the root architecture check to prevent public-site imports or agent environment references. If a required connector cannot be safely constrained under that shared scope, return to separate Vercel projects before enabling it.

## Environment Matrix

| Variable / capability                            | Local development                 | Preview sidecar                    | Production sidecar                                                                 |
| ------------------------------------------------ | --------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------- |
| `SEO_AGENT_ENV`                                  | `development`                     | `preview`                          | `production`                                                                       |
| `SEO_AGENT_RUN_MODE`                             | `dry-run` only                    | `dry-run` or `paused`              | `observe` only for the first approved audit                                        |
| `SEO_AGENT_MUTATION_KILL_SWITCH`                 | `true`                            | `true`                             | `true`                                                                             |
| `SEO_AGENT_MUTATION_MODE`                        | `disabled`                        | `disabled`                         | `disabled`                                                                         |
| `SEO_AGENT_PUBLISHING_HUMAN_APPROVED`            | `false`                           | `false`                            | `false`                                                                            |
| `SEO_AGENT_PUBLISHING_INTEGRATION_TEST`          | `false`                           | `false`                            | `false`                                                                            |
| `CRON_SECRET`                                    | not needed for local fixture work | required if `/api/cron` is exposed | required for `/api/cron`; use an encrypted project variable                        |
| `AI_GATEWAY_API_KEY` / `VERCEL_OIDC_TOKEN`       | no value required for fixtures    | no key by default                  | OIDC preferred; otherwise a reviewed project server variable, never `NEXT_PUBLIC_` |
| `SEO_AGENT_LIVE_READS_APPROVED` and exact run ID | `false` / absent                  | `false` / absent                   | temporary single-run approval only, then remove                                    |
| `SEO_AGENT_BLOB_ENABLED`                         | `false` / absent                  | `false` / absent                   | `true` only after private archive review; Git remains canonical                    |
| `SEO_AGENT_BLOB_ARCHIVE_APPROVED` + exact run ID | `false` / absent                  | `false` / absent                   | temporary exact-run approval only, then remove                                     |
| `BLOB_READ_WRITE_TOKEN`                          | absent                            | absent                             | reviewed project server variable; never Git or `NEXT_PUBLIC_`                      |
| Required/optional adapter credentials            | absent                            | absent                             | reviewed project server variables only after scope approval                        |

Never copy a production secret to Preview, Git, a shell history, artifacts, PR bodies, `seo/` records, or `NEXT_PUBLIC_` variables. Vercel supports isolated Development, Preview, and Production variables; use `vercel env run` for a temporary local check rather than exporting secrets to a file when possible. Do not mistake that environment scoping for per-service credential isolation.

The public site also now requires `NEXT_PUBLIC_MAPBOX_TOKEN` to render the service-area map. Configure its publishable, URL-restricted Mapbox token for the `site` service; it is intentionally public, not a sidecar credential, and must never be restored to source code.

## Vercel Sidecar, Eve, and AI Gateway

1. [ ] Request/confirm Vercel Services availability, then link one Vercel project at the repository root and select the Services framework. Keep the committed root `vercel.json`; do not create a second sidecar project.
2. [ ] Confirm `site` uses root `.` at `/`, while `eve_seo_agent` uses `automation/seo-agent` at `/_internal/eve`; each must use `npm ci --ignore-scripts --omit=peer` and `npm run build` from its own root.
3. [ ] Set the project's production branch to `main`; do not deploy with `vercel --prod` as an agent action.
4. [ ] Configure deployment protection for previews and record how the human reviewer can access a preview without granting a bypass token to the sidecar.
5. [ ] Configure Vercel AI Gateway for the Eve service. Prefer Vercel OIDC in production; otherwise review the shared project server-variable exposure, add a restricted key, and set a small monthly budget and alert threshold before any live call.
6. [ ] Deploy a Services preview. Verify `GET /_internal/eve/api/healthz` returns a redacted status and `GET /_internal/eve/api/readyz` is not reported ready until configuration prerequisites exist. Record URL, deployment ID, commit SHA, timestamp, and redacted result in a human-reviewed run record.
7. [ ] Confirm Eve build metadata contains the native schedule. Do not enable or duplicate a platform cron until the first manually approved audit-only exercise is complete.

## GitHub Permissions and Branch Protection

1. [ ] Create a Vercel Connect GitHub connector limited to `byronwade/wadesplumbingandseptic.com`.
2. [ ] Grant read-only repository inspection first. A future publication connector may create draft PRs only after explicit human approval; do not grant merge, administration, webhooks, releases, actions settings, secrets, deployment, or organization-wide write permissions.
3. [ ] In GitHub branch protection/rulesets for `main`, require human review, required checks, and no direct pushes. Disallow force-push and bypass for the sidecar identity.
4. [ ] Verify with a non-destructive repository read. Save only a redacted timestamped result; do not call a write endpoint.
5. [ ] Confirm the existing self-hosted CI runner is the only runner allowed by `.github/workflows/seo-agent-offline.yml`; record runner owner, isolation, offline cache, and firewall evidence separately.

## Required Read Integrations

### Search Console service account

1. [ ] Create a dedicated Google Cloud service account (or approved workload identity) for this sidecar.
2. [ ] Enable Search Console API and grant the identity the least-privilege property access required for read-only data (`webmasters.readonly` where OAuth is used). Do not use an owner’s personal credential.
3. [ ] Add the credential to the Production sidecar only as an encrypted variable; set `SEO_AGENT_ENABLE_SEARCH_CONSOLE=true` only after approval.
4. [ ] Run the approved exact-run probe. Verify date windows exclude the most recent three calendar days, rows are redacted/hashed, and the result states `LIVE_VERIFIED` only with a real timestamped probe.

### PageSpeed Insights

1. [ ] Create a restricted Google API key for PageSpeed Insights API v5, with an appropriate application/API restriction.
2. [ ] Store it only as `PAGESPEED_API_KEY` in the Production sidecar. Set `SEO_AGENT_ENABLE_PAGESPEED=true` only after approval.
3. [ ] Run one bounded mobile request against an approved public URL. Confirm the saved evidence strips the API-key query parameter and retains only redacted normalized metrics.

## Optional Integrations

| Integration      | Human setup / verification                                                            | Current state                 |
| ---------------- | ------------------------------------------------------------------------------------- | ----------------------------- |
| GA4              | [ ] Analytics Data API read-only property identity, aggregate-only probe              | `BLOCKED_MISSING_CREDENTIALS` |
| Business Profile | [ ] Approved performance-read scope and location ID; no review/response write actions | `BLOCKED_MISSING_CREDENTIALS` |
| Browserbase      | [ ] Separate project, explicit allowed domains, short non-keepalive read-only session | `BLOCKED_MISSING_CREDENTIALS` |
| Local Falcon     | [ ] Read-only vendor credential and documented report probe                           | `BLOCKED_MISSING_CREDENTIALS` |
| Similarweb       | [ ] Vendor-approved read-only endpoint and privacy review                             | `BLOCKED_MISSING_CREDENTIALS` |
| Google Trends    | [ ] Approved documented API access; do not scrape or use undocumented access          | `BLOCKED_MISSING_CREDENTIALS` |
| Trace sink       | [ ] Redacted telemetry destination with retention, access, and alert owner            | `BLOCKED_MISSING_CREDENTIALS` |

An optional adapter may never block the core offline suite. A missing or expired credential must yield `BLOCKED_MISSING_CREDENTIALS`, never fabricated analytics.

## Schedule and Time Zone

The committed Eve schedule is `17 16 * * 1`: Monday at **16:17 UTC**. It is intentionally expressed in UTC; DST changes mean it is 11:17 Eastern Standard Time and 12:17 Eastern Daylight Time. Vercel cron documentation likewise treats cron expressions as UTC.

Before enabling it:

1. [ ] Name a human schedule owner and a pause owner.
2. [ ] Record the UTC expression, Eastern-time conversion, max one run per schedule, cost budget, and incident contact in the monthly operations issue.
3. [ ] Run and review one manually authorized, audit-only exercise first.
4. [ ] Enable the native Eve schedule only after the durable Git-manifest persistence prerequisite is implemented and reviewed. Do not configure a duplicate `/api/cron` schedule.

## Pause, Resume, Kill Switch, and Incident Response

### Pause immediately

1. [ ] In Vercel, disable the Eve service's Cron Job.
2. [ ] Set `SEO_AGENT_RUN_MODE=paused` and `SEO_AGENT_MUTATION_KILL_SWITCH=true` in Production; redeploy the reviewed Services configuration.
3. [ ] Detach/revoke the affected connector or API key if an integration is implicated.
4. [ ] Confirm `/api/healthz` is redacted and `/api/readyz` does not report an unsafe ready state.
5. [ ] Record incident time, run ID, deployment ID, classification, and redacted evidence. Never place raw prompts, queries, secrets, or customer data in the issue.

### Resume only after human review

1. [ ] Close the incident with root cause, scope, and regression-test reference.
2. [ ] Re-run `npm run verify:all` and `npm run verify:completion` from a clean tree.
3. [ ] Restore only the reviewed read connector; keep all mutation variables disabled and kill switch true.
4. [ ] Set `SEO_AGENT_RUN_MODE=observe` for one reviewed audit-only run, then remove temporary live-read approval.
5. [ ] Re-enable Cron only after the human schedule owner approves the evidence.

### Rollback

The agent never rolls back. A human either reverts the human-merged PR or promotes/selects a known-good public-site Vercel deployment under existing production controls. Then record the result in the associated run/experiment record and add a regression fixture before re-enabling automation.

## Troubleshooting

| Symptom                                        | Safe response                                                                                                                |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Sidecar build fails                            | Confirm Node 24+, the `eve_seo_agent` service root, sidecar lockfile, and `npm ci`; do not add public-site dependencies.     |
| `readyz` is degraded                           | Treat it as expected until configured prerequisites and a redacted probe are verified; do not add secrets to the repository. |
| Cron returns 401                               | Verify `CRON_SECRET` is a reviewed server variable and the caller uses a Bearer header; do not print the value.              |
| Live probe blocked                             | Confirm exact production run ID and human approval, then check the minimum scope in `integration-inventory.json`.            |
| Preview unavailable or indexable               | Keep the PR draft/not ready, comment the failed gate, and ask a human to fix deployment protection or noindex behavior.      |
| Unexpected cost, duplicate, or injection event | Pause immediately, revoke affected access, retain only redacted operational records, and follow incident response above.     |

## First 30 Days: Observe-Only Plan

| Window   | Human-owned action                                                                                 | Success criterion                                                                     |
| -------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Days 0-2 | Complete all required checkboxes, deploy a Services preview, verify Eve health endpoints           | No public-site change; all missing access is explicitly blocked                       |
| Days 3-7 | One approved manual audit-only run after durable persistence is available                          | Evidence/manifests only; zero PRs, zero content writes                                |
| Week 2   | Review demand/intent evidence, query ownership, link graph, technical findings, and policy denials | Human accepts no-change or one bounded opportunity; unsupported claims remain blocked |
| Week 3   | If approved, create one draft-only proposal with preview audit                                     | CI and non-indexable preview gates pass; PR remains draft until human review          |
| Week 4   | Assess cost, source quality, false positives, alerts, and rollback drill                           | Human decides whether to continue observe-only, expand one read adapter, or pause     |

At no point in the first 30 days may the agent merge, deploy, change production configuration, enable autonomous mutations, or make a business/service-area claim without first-party evidence.
