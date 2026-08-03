# Eve Integration Rollout Tasks

Sequential, one-feature-at-a-time rollout. **Do not start the next task until the current task has a dedicated PR, thorough tests, and a truthful live proof.**

## Task 1 — Search Console live verification

- **Status:** `LIVE_VERIFIED` (2026-08-03)
- **PRs:** `#106`, `#107`
- **Proof:** Production Cron live-probe returned HTTP `200` three times (handler emits `200` only for Search Console `LIVE_VERIFIED`)
- **Request IDs:** `jsh2f-1785767736041-0b69afa834f2`, `b7m42-1785767764615-502f16a8929e`, `ml9pv-1785767785128-14ab8d8d6262`
- **Retest (2026-08-03):** re-armed run `search-console-retest-2026-08-03` on `dpl_5q8pyVTiDp3Fra7eFwbW5myquTvq`; Cron probe `200` three more times (`6fxnq-1785768403279-e0b72c0b4d9d`, `7vhmb-1785768419797-cf14e9d7523f`, `78tfs-1785768427183-b28b62851423`); live-read flags reset afterward
- **Exit gate:** Task 2 may start

## Task 2 — PageSpeed Insights live verification

- **Status:** `READY_TO_START`
- **PR:** dedicated PageSpeed branch next
