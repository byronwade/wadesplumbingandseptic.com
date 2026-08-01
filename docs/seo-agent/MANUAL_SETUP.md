# Eve Owner Setup

The reviewed draft branch uses a single Vercel Services project: the public site remains at `/` and the backend-only Eve sidecar is only under `/_internal/eve`. Production remains unchanged until a human merges the draft PR.

## Already Configured

- [x] The Vercel project uses Node 24 and the Services Framework Preset. A reviewed preview deployed both the site and internal Eve functions.
- [x] Eve safety settings exist in Preview and Production: observe mode, mutation kill switch, disabled publishing, disabled live reads, and bounded budgets.
- [x] A separate encrypted `CRON_SECRET` exists for Preview and Production. No external Cron schedule is enabled.
- [x] GitHub Connect is installed as `github/wadesplumbingandseptic-com` for this repository. Its triggers are off.
- [x] The GitHub read adapter is enabled and uses Vercel Connect app tokens. No static GitHub token is stored.
- [x] AI Gateway uses Vercel's automatic OIDC identity. The conflicting static Gateway key was removed from Preview and Production, and a fresh Production OIDC-only request was live-verified on 2026-08-01. Model access remains separate from OIDC authentication.
- [x] `PAGESPEED_API_KEY` is stored as a Production-only Vercel secret. Its integration flag remains off.
- [x] The Google OAuth connector is linked. Its background app-token probe returned `unresolved_token`, so it is not used for Eve's scheduled Search Console work.
- [x] The Search Console service-account email and private key are stored as Production server-side variables. This is configuration only, not a verified API read.
- [x] Search Console, Vercel read access, Browserbase, GA4, Business Profile, Local Falcon, Similarweb, Google Trends, Blob archiving, publishing, and direct writes remain disabled.

## Keep Off

- [ ] Do not enable GitHub triggers, external Cron, publishing, automatic merge, direct writes to `main`, or a static AI Gateway key.
- [ ] Do not commit `.env*` files, Vercel tokens, Connect tokens, or provider credentials.

## Later, When We Activate the Sidecar

1. Let the normal PR checks for the reviewed Services branch finish green. Keep the PR as a draft.
2. Approve an SSO-safe way to verify only `/_internal/eve/api/healthz`, `/_internal/eve/api/readyz`, and the protected Cron rejection path. Do not disable SSO just for testing.
3. Approve one exact read-only audit run, then set only the required read-integration flags for that run.
4. Review the audit evidence. Keep mutation mode, publishing, auto-merge, GitHub triggers, and external Cron disabled.
5. Merge only through normal human branch protection when the preview and required CI evidence are accepted.

The detailed technical reference is [HUMAN_REVIEW_AND_DEPLOYMENT.md](HUMAN_REVIEW_AND_DEPLOYMENT.md).
