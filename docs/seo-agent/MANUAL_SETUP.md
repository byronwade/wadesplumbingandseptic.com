# Eve Owner Setup

The public site is correctly deployed as a Next.js project. Keep it that way until a reviewed Vercel Services activation change is ready.

## Already Configured

- [x] The Vercel project uses Node 24 and the Next.js Framework Preset.
- [x] Eve safety settings exist in Preview and Production: observe mode, mutation kill switch, disabled publishing, disabled live reads, and bounded budgets.
- [x] A separate encrypted `CRON_SECRET` exists for Preview and Production. No external Cron schedule is enabled.
- [x] GitHub Connect is installed as `github/wadesplumbingandseptic-com` for this repository. Its triggers are off.
- [x] The GitHub read adapter is enabled and uses Vercel Connect app tokens. No static GitHub token is stored.
- [x] `PAGESPEED_API_KEY` is stored as a Production-only Vercel secret. Its integration flag remains off.
- [x] The Google OAuth connector is linked. Its background app-token probe returned `unresolved_token`, so it is not used for Eve's scheduled Search Console work.
- [ ] Add the service-account email and private key as Production sidecar secrets only after the Services preview is approved. Their exact names are `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`.
- [x] Search Console, Vercel read access, Browserbase, GA4, Business Profile, Local Falcon, Similarweb, Google Trends, Blob archiving, publishing, and direct writes remain disabled.

## Keep Off

- [ ] Do not change the Vercel Framework Preset to Services today.
- [ ] Do not enable GitHub triggers, external Cron, publishing, automatic merge, direct writes to `main`, or a static AI Gateway key.
- [ ] Do not commit `.env*` files, Vercel tokens, Connect tokens, or provider credentials.

## Later, When We Activate the Sidecar

1. Create and review a dedicated Services activation PR that promotes [vercel.services.example.json](vercel.services.example.json) to the root Vercel configuration.
2. Verify its preview preserves the public site and exposes only the internal Eve routes.
3. Change the project Framework Preset to Services only for that reviewed deployment.
4. Add the two Search Console service-account variables to Production and set `SEO_AGENT_ENABLE_SEARCH_CONSOLE=true` for one exact approved read-only run.
5. Run the first audit-only sidecar verification. Keep mutation mode disabled.

The detailed technical reference is [HUMAN_REVIEW_AND_DEPLOYMENT.md](HUMAN_REVIEW_AND_DEPLOYMENT.md).
