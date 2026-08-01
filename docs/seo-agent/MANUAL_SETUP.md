# Eve Owner Setup

The reviewed draft branch uses a single Vercel Services project: the public site remains at `/` and the backend-only Eve sidecar is only under `/_internal/eve`. Production remains unchanged until a human merges the draft PR.

## Already Configured

- [x] The Vercel project uses Node 24 and the Services Framework Preset. A reviewed preview deployed both the site and internal Eve functions.
- [x] Eve safety settings exist in Preview and Production: observe mode, mutation kill switch, disabled publishing, disabled live reads, and bounded budgets.
- [x] A separate encrypted `CRON_SECRET` exists for Preview and Production. The protected fallback dispatcher remains secret-authenticated.
- [ ] The compiled `proposal-proof` schedule has been deployed. It uses the UTC leap-day expression `0 0 29 2 *` and exists only for a Vercel administrator's one-time CLI lifecycle proof.
- [x] GitHub Connect is installed as `github/wadesplumbingandseptic-com` for this repository. Its app-token exchange and a one-repository read token were live-verified on 2026-08-01. Its triggers are off.
- [x] The GitHub read adapter is enabled and uses Vercel Connect app tokens. No static GitHub token is stored.
- [ ] In the GitHub App installation, select only `byronwade/wadesplumbingandseptic.com`. The sidecar patch scopes each token request to this repository, but installation-level repository access must also be narrowed before any draft-writing workflow is enabled.
- [x] AI Gateway uses Vercel's automatic OIDC identity. The conflicting static Gateway key was removed from Preview and Production, and a fresh Production OIDC-only request was live-verified on 2026-08-01. Model access remains separate from OIDC authentication.
- [x] `PAGESPEED_API_KEY` is stored as a Production-only Vercel secret. Its integration flag remains off.
- [x] The Google OAuth connector is linked. Its background app-token probe returned `unresolved_token`, so it is not used for Eve's scheduled Search Console work.
- [x] The Search Console service-account email and private key are stored as Production server-side variables. This is configuration only, not a verified API read.
- [x] Search Console, Vercel read access, Browserbase, GA4, Business Profile, Local Falcon, Similarweb, Google Trends, Blob archiving, publishing, and direct writes remain disabled.

## Keep Off

- [ ] Do not enable GitHub triggers, external Cron, publishing, automatic merge, direct writes to `main`, or a static AI Gateway key.
- [ ] Do not commit `.env*` files, Vercel tokens, Connect tokens, or provider credentials.

## Next: One Audit-Only Run

- [ ] Let the draft PR checks and preview finish green. Keep the PR a draft.
- [ ] Choose one lower-case run ID, such as `production-audit-2026-08-01`.
- [ ] In Vercel Production only, set the enabled read adapters you want this audit to test: `SEO_AGENT_ENABLE_VERCEL=true`, `SEO_AGENT_ENABLE_SEARCH_CONSOLE=true`, and `SEO_AGENT_ENABLE_PAGESPEED=true`. `SEO_AGENT_ENABLE_AI_GATEWAY=true` and `SEO_AGENT_ENABLE_GITHUB=true` are already configured. Leave every optional adapter disabled unless its credential and scope have been separately reviewed.
- [ ] In Vercel Production only, set `SEO_AGENT_LIVE_READS_APPROVED=true` and set `SEO_AGENT_LIVE_READS_APPROVED_RUN_ID` to that exact run ID.
- [ ] Leave observe mode on. Keep mutation mode `disabled`, the kill switch `true`, publishing approval `false`, integration-test `false`, Blob disabled, and Sandbox approval `false`.
- [ ] After the runtime activation PR is human-merged and deployed, tell Codex the approved run ID. It will perform only read-only integration checks and an audit with zero content changes and zero pull requests.
- [ ] Review the redacted report, then set `SEO_AGENT_LIVE_READS_APPROVED=false` and remove the approved run ID.
- [ ] Do not enable GitHub triggers, publishing, automatic merge, external Cron, or direct writes to `main`.

## One-Time Draft Proposal Proof

- [ ] Merge and deploy the reviewed `proposal-proof` schedule patch first. Do not change the existing audit schedule.
- [ ] Set only these Production values for the exact current UTC date: `SEO_AGENT_RUN_MODE=propose`, `SEO_AGENT_MUTATION_MODE=enabled`, `SEO_AGENT_MUTATION_KILL_SWITCH=false`, `SEO_AGENT_PUBLISHING_HUMAN_APPROVED=true`, `SEO_AGENT_PUBLISHING_INTEGRATION_TEST=true`, `SEO_AGENT_PUBLISHING_APPROVED_RUN_ID=proposal-YYYY-MM-DD`, and `SEO_AGENT_PUBLISHING_PRECONDITION_AUDIT_RUN_ID=audit-YYYY-MM-DD` for the reviewed audit.
- [ ] Use `vercel crons list --project wadesplumbingandseptic-com --scope byron-wade` to find the deployed `proposal-proof` path, then run `vercel crons run <that-path> --project wadesplumbingandseptic-com --scope byron-wade`.
- [ ] Inspect the Eve Agent Run, the resulting draft branch and PR, and the PR's preview. Confirm that no merge, deployment, or direct `main` write occurred.
- [ ] Immediately restore observe mode, disabled mutation, an enabled kill switch, disabled approval flags, and remove both proposal run IDs. Redeploy and record the redacted result in `IMPLEMENTATION_STATUS.md`.

The detailed technical reference is [HUMAN_REVIEW_AND_DEPLOYMENT.md](HUMAN_REVIEW_AND_DEPLOYMENT.md).
