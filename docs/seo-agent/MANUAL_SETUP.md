# Eve Owner Setup

The reviewed draft branch uses a single Vercel Services project: the public site remains at `/` and the backend-only Eve sidecar is only under `/_internal/eve`. Production remains unchanged until a human merges the draft PR.

## Already Configured

- [x] The Vercel project uses Node 24 and the Services Framework Preset. A reviewed preview deployed both the site and internal Eve functions.
- [x] Eve safety settings exist in Preview and Production: observe mode, mutation kill switch, disabled publishing, disabled live reads, and bounded budgets.
- [x] A separate encrypted `CRON_SECRET` exists for Preview and Production. The protected fallback dispatcher remains secret-authenticated.
- [ ] The repaired single native `audit` schedule is deployed. It runs at `17 16 * * 1` UTC and normally selects only the audit job.
- [x] GitHub Connect is installed as `github/wadesplumbingandseptic-com` for this repository. Its app-token exchange and a one-repository read token were live-verified on 2026-08-01. Its triggers are off.
- [x] The GitHub read adapter is enabled and uses Vercel Connect app tokens. No static GitHub token is stored.
- [ ] In the GitHub App installation, select only `byronwade/wadesplumbingandseptic.com`. The sidecar patch scopes each token request to this repository, but installation-level repository access must also be narrowed before any draft-writing workflow is enabled.
- [x] AI Gateway uses Vercel's automatic OIDC identity. The conflicting static Gateway key was removed from Preview and Production, and a fresh Production OIDC-only request was live-verified on 2026-08-01. Model access remains separate from OIDC authentication.
- [x] `PAGESPEED_API_KEY` is stored as a Production-only Vercel secret. Its integration flag remains off except during approved live proofs.
- [x] The Google OAuth connector is linked. Its background app-token probe returned `unresolved_token`, so it is not used for Eve's scheduled Search Console or GA4 work.
- [x] The Search Console service-account email and private key are stored as Production server-side variables (`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`).
- [x] Search Console live probe (Task 1) and topic wiring (Task 3) are `LIVE_VERIFIED` via Production Cron (`GET /_internal/eve/api/live-probe/search-console` and `/search-console-topics`). Local `vercel env run` cannot see Sensitive Google credentials.
- [x] PageSpeed live probe (Task 2) and draft/preview QA wiring (Task 4) are `LIVE_VERIFIED` via Production Cron (`GET /_internal/eve/api/live-probe/pagespeed` and `/pagespeed-qa`).
- [x] Browser research live probe (Task 5) is `LIVE_VERIFIED` via Production Cron (`GET /_internal/eve/api/live-probe/browser-research`).
- [ ] Google Analytics Data API (Task 6 / GA4): skipped for rollout with recorded blocker until `GA4_PROPERTY_ID` is set. See **Deferred: Google Analytics Data (GA4)** below.
- [ ] Local Falcon (Task 7): follow **Next: Local Falcon** below, then run the focused live probe.
- [ ] DataForSEO (Task 7a): follow **Next: DataForSEO** below, then run the focused live probe.
- [x] Other optional adapters (Browserbase, Business Profile, Similarweb, Google Trends), Blob archiving, and direct writes remain disabled until their own task PRs. Browserbase has no Production API key/project id yet (`BLOCKED_MISSING_CREDENTIALS`).

## Keep Off

- [ ] Do not enable GitHub triggers, external Cron, publishing, automatic merge, direct writes to `main`, or a static AI Gateway key.
- [ ] Do not commit `.env*` files, Vercel tokens, Connect tokens, or provider credentials.

## Next: Local Falcon

Eve Task 7 reads a bounded Local Falcon report list (`report_count` only). Requires a Local Falcon API key.

### 1. Local Falcon account (owner)

1. [ ] Create or locate a read-capable Local Falcon API key for the Wade account.
2. [ ] Confirm the key can list reports via the Local Falcon API (no write/review actions).

### 2. Vercel Production variables (owner)

Set these in Production only (Sensitive / encrypted). Do not put them in Preview or Git.

1. [ ] `LOCAL_FALCON_API_KEY` = the API key from step 1.
2. [ ] Keep `SEO_AGENT_ENABLE_LOCAL_FALCON=false` until the live probe is armed.

### 3. Live proof (after Task 7 code is on Production)

1. [ ] Choose run ID `local-falcon-2026-08-03` (or another lower-case id).
2. [ ] Temporarily set Production: `SEO_AGENT_ENABLE_LOCAL_FALCON=true`, `SEO_AGENT_LIVE_READS_APPROVED=true`, `SEO_AGENT_LIVE_READS_APPROVED_RUN_ID=<exact run id>`.
3. [ ] Redeploy Production so the new env values apply.
4. [ ] Trigger Cron: `GET /_internal/eve/api/live-probe/local-falcon` three times. HTTP `200` means `LIVE_VERIFIED` (aggregate `report_count` only).
5. [ ] Reset: `SEO_AGENT_LIVE_READS_APPROVED=false`, remove the approved run ID, set `SEO_AGENT_ENABLE_LOCAL_FALCON=false`, redeploy.

CLI note: local `vercel env run` cannot read Sensitive secrets. Prefer Production Cron for the authoritative proof.

## Next: DataForSEO

Eve Task 7a reads a bounded DataForSEO account balance (`money_left_usd` only) and, once wired into strategy work, keyword search volume and an aggregate backlinks summary. Requires a DataForSEO account (pay-as-you-go). This replaces an earlier idea of self-hosting the OpenSEO dashboard in front of it: OpenSEO's only documented AI-agent integration is an interactive-login MCP server, which cannot authenticate an unattended Cron job the way every other Eve adapter does, so Eve talks to DataForSEO's own REST API directly instead.

### 1. DataForSEO account (owner)

1. [ ] Create a DataForSEO account at [dataforseo.com](https://dataforseo.com) and fund it (pay-as-you-go; no credential exists until the account has a balance).
2. [ ] Locate the account's API login (email) and password in the DataForSEO dashboard. These are sent as HTTP Basic Auth, not a bearer token.

### 2. Vercel Production variables (owner)

Set these in Production only (Sensitive / encrypted). Do not put them in Preview or Git.

1. [ ] `DATAFORSEO_LOGIN` = the account email from step 1.
2. [ ] `DATAFORSEO_PASSWORD` = the account password from step 1.
3. [ ] Keep `SEO_AGENT_ENABLE_DATAFORSEO=false` until the live probe is armed.

### 3. Live proof (after Task 8 code is on Production)

1. [ ] Choose a run ID such as `dataforseo-2026-08-06` (or another lower-case id).
2. [ ] Temporarily set Production: `SEO_AGENT_ENABLE_DATAFORSEO=true`, `SEO_AGENT_LIVE_READS_APPROVED=true`, `SEO_AGENT_LIVE_READS_APPROVED_RUN_ID=<exact run id>`.
3. [ ] Redeploy Production so the new env values apply.
4. [ ] Trigger Cron: `GET /_internal/eve/api/live-probe/dataforseo` three times. HTTP `200` means `LIVE_VERIFIED` (aggregate `money_left_usd` only).
5. [ ] Reset: `SEO_AGENT_LIVE_READS_APPROVED=false`, remove the approved run ID, set `SEO_AGENT_ENABLE_DATAFORSEO=false`, redeploy.

CLI note: local `vercel env run` cannot read Sensitive secrets. Prefer Production Cron for the authoritative proof.

## Deferred: Google Analytics Data (GA4)

Task 6 path is on Production. Live proof remains blocked until the owner sets `GA4_PROPERTY_ID` and grants Viewer to the Eve service account. Full steps stay in git history / Phase 75; when ready: enable Analytics Data API, grant Viewer, set `GA4_PROPERTY_ID`, arm `SEO_AGENT_ENABLE_GA4` + live-reads for an exact run ID, Cron-prove `/_internal/eve/api/live-probe/ga4`, then reset.

## Next: One Audit-Only Run

- [ ] Let the draft PR checks and preview finish green. Keep the PR a draft.
- [ ] Choose one lower-case run ID, such as `production-audit-2026-08-01`.
- [ ] In Vercel Production only, set the enabled read adapters you want this audit to test: `SEO_AGENT_ENABLE_VERCEL=true`, `SEO_AGENT_ENABLE_SEARCH_CONSOLE=true`, and `SEO_AGENT_ENABLE_PAGESPEED=true`. `SEO_AGENT_ENABLE_AI_GATEWAY=true` and `SEO_AGENT_ENABLE_GITHUB=true` are already configured. Leave every optional adapter disabled unless its credential and scope have been separately reviewed.
- [ ] In Vercel Production only, set `SEO_AGENT_LIVE_READS_APPROVED=true` and set `SEO_AGENT_LIVE_READS_APPROVED_RUN_ID` to that exact run ID.
- [ ] Leave observe mode on. Keep mutation mode `disabled`, the kill switch `true`, publishing approval `false`, integration-test `false`, Blob disabled, and Sandbox approval `false`.
- [ ] After the runtime activation PR is human-merged and deployed, tell Codex the approved run ID. It will perform only read-only integration checks and an audit with zero content changes and zero pull requests.
- [ ] Review the redacted report, then set `SEO_AGENT_LIVE_READS_APPROVED=false` and remove the approved run ID.
- [ ] Do not enable GitHub triggers, publishing, automatic merge, external Cron, or direct writes to `main`.

## Draft Blog PR via Cron + Vercel Connect

Eve opens draft PRs with Vercel Connect GitHub after Cron research. No Vercel CLI token is required for that write path.

- [ ] Merge and deploy the Connect draft-PR path. On Vercel Production, Eve stands in propose mode in code so stale dashboard observe values do not block draft PRs.
- [ ] Keep GitHub Connect installed as `github/wadesplumbingandseptic-com` with contents and pull-request write on this repository.
- [ ] Let the Monday `17 16 * * 1` UTC Cron run, or use the Vercel dashboard Cron Run control for that schedule.
- [ ] Confirm Eve opens one `eve/seo/YYYY-MM-DD-<slug>` draft PR. It must not merge, deploy, or write `main`.
- [ ] To restore audit-only Cron, set `SEO_AGENT_FORCE_OBSERVE=true` in Production and redeploy.

The detailed technical reference is [HUMAN_REVIEW_AND_DEPLOYMENT.md](HUMAN_REVIEW_AND_DEPLOYMENT.md).
