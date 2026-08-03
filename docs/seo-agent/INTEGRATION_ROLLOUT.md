# Eve Integration Rollout Tasks

Sequential, one-feature-at-a-time rollout. **Do not start the next task until the current task has a dedicated PR, thorough tests, and a truthful live proof.**

## Task 1 — Search Console live verification

- **Status:** `IN_PROGRESS` / awaiting Production deploy for `LIVE_VERIFIED`
- **PR branch:** `cursor/eve-search-console-live-aab8`
- **Approved run ID (armed):** `search-console-live-2026-08-03`
- **Offline:** focused probe + HTTP route fixtures `MOCK_VERIFIED` (`122/122` tests)
- **Live:** blocked until human merge/deploy; Sensitive Google credentials are not available to local `vercel env run`
- **Post-deploy command:**  
  `GET https://www.wadesplumbingandseptic.com/_internal/eve/api/live-probe/search-console?run_id=search-console-live-2026-08-03`  
  with `Authorization: Bearer $CRON_SECRET`
- **Exit gate:** Task 2 only after Search Console evidence is `LIVE_VERIFIED` and live-read approval is reset

## Remaining tasks

See the full ordered list in the Phase 61 board / prior rollout PR. Order after Task 1: PageSpeed live → GSC topic wiring → PageSpeed QA → browser → GA4 → Local Falcon → GBP → SERP → Trends → independent judge → indexation → observation loop → images.
