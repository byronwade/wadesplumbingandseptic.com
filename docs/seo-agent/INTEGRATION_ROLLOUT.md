# Eve Integration Rollout Tasks

Sequential, one-feature-at-a-time rollout. **Do not start the next task until the current task has a dedicated PR, thorough tests, and a truthful live proof.**

## Task 1 — Search Console live verification

- **Status:** `LIVE_VERIFIED` (2026-08-03)
- **PRs:** `#106`, `#107`
- **Proof:** Production Cron live-probe returned HTTP `200` three times (handler emits `200` only for Search Console `LIVE_VERIFIED`)
- **Request IDs:** `jsh2f-1785767736041-0b69afa834f2`, `b7m42-1785767764615-502f16a8929e`, `ml9pv-1785767785128-14ab8d8d6262`
- **Exit gate:** Task 2 may start

## Task 2 — PageSpeed Insights live verification

- **Status:** `IN_PROGRESS` (offline probe path on `cursor/eve-pagespeed-live-aab8`; awaiting Production `LIVE_VERIFIED`)
- **PR:** dedicated PageSpeed branch `cursor/eve-pagespeed-live-aab8`
- **Method:** focused `probePageSpeedLive()`, CLI `npm run live:probe:pagespeed`, Production route `GET /_internal/eve/api/live-probe/pagespeed`, annual Cron for manual `vercel crons run`
- **Exit gate:** Task 3 starts only after HTTP `200` live-probe proof and live-read flags are reset
