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

- **Status:** `LIVE_VERIFIED` (2026-08-03)
- **PR:** `#110` (`cursor/eve-pagespeed-live-aab8`)
- **Proof:** Production Cron live-probe returned HTTP `200` three times (handler emits `200` only for PageSpeed `LIVE_VERIFIED`)
- **Request IDs:** `jlmdf-1785769354624-edf5f2e49d8b`, `89kdm-1785769458215-e741a6a75eb2`, `x288r-1785769554588-9e473083c699`
- **Exit gate:** Task 3 may start (`#110` merged)

## Task 3 — Search Console topic wiring

- **Status:** `LIVE_VERIFIED` (2026-08-03)
- **Branch/PR:** `cursor/eve-gsc-topic-wiring-aab8` / `#113`
- **Scope:** Feed Search Console Search Analytics query signals into blog topic scoring (`score_bonus` / `gsc_signal`); soft-fail when Search Console is disabled; redacted evidence (no raw query strings); focused live probe `GET /_internal/eve/api/live-probe/search-console-topics`
- **Offline proof:** sidecar `npm test` → `163/163`; `npm run typecheck` / `npm run verify` exit `0`
- **Proof:** Production Cron live-probe returned HTTP `200` three times (handler emits `200` only for topic-signal `LIVE_VERIFIED`)
- **Request IDs:** `mcxf9-1785771130232-a771f1f49e53`, `nfpqh-1785771148908-0fa253aae282`, `bnksh-1785771152137-ff6f49e55f1c`
- **Exit gate:** Task 4 (PageSpeed QA wiring) may start

## Task 4 — PageSpeed draft/preview QA wiring

- **Status:** `LIVE_VERIFIED` (2026-08-03)
- **Branch/PR:** `cursor/eve-pagespeed-qa-wiring-aab8` / `#114`
- **Scope:** Shape PageSpeed Insights into draft/preview QA signals (`performance_score`, LCP, CLS, soft PASS/WARN/FAIL budgets); soft-fail when PageSpeed is disabled; redacted evidence (no raw audit dumps); surface in Connect draft PR brief; focused live probe `GET /_internal/eve/api/live-probe/pagespeed-qa`
- **Offline proof:** sidecar `npm test` → `170/170`; `npm run typecheck` / `npm run verify` exit `0`
- **Proof:** Production Cron live-probe returned HTTP `200` three times (handler emits `200` only for PageSpeed QA `LIVE_VERIFIED`)
- **Request IDs:** `65vkz-1785771741357-0f9f97fa4377`, `jbv4p-1785771747705-fe677252cc12`, `2frhj-1785771754002-d21d8f77df25`
- **Exit gate:** Task 5 (browser research / Browserbase) may start

## Task 5 — Browser research live verification

- **Status:** `LIVE_VERIFIED` (2026-08-03)
- **Branch/PR:** `cursor/eve-browser-research-live-aab8` / `#116`
- **Scope:** Focused allowlisted HTTP browser research live probe (`GET /_internal/eve/api/live-probe/browser-research`); compact redacted responses (content hash / excerpt metadata only, no HTML body); Cron + CLI; proposal demand research already uses this adapter when enabled
- **Browserbase:** optional and separately gated. Production currently has `SEO_AGENT_ENABLE_BROWSERBASE` but no `BROWSERBASE_API_KEY` / `BROWSERBASE_PROJECT_ID`, so Browserbase remains `BLOCKED_MISSING_CREDENTIALS` and is not part of this task's exit gate
- **Proof:** Production Cron live-probe returned HTTP `200` three times (handler emits `200` only for browser-research `LIVE_VERIFIED`)
- **Request IDs:** `pvg9f-1785773479604-875726474167`, `jxqqx-1785773484010-820345f8e44f`, `4klwv-1785773488231-7505d212de28`
- **Exit gate:** Task 6 (GA4, optional) may start, or skip with a recorded blocker

## Task 6 — GA4 (optional)

- **Status:** `BLOCKED_MISSING_CREDENTIALS` (2026-08-03)
- **Prerequisite:** Task 5 `LIVE_VERIFIED` (met)
- **Evidence:** Production has `SEO_AGENT_ENABLE_GA4`, but no `GA4_ACCESS_TOKEN` / `GA4_PROPERTY_ID` (or equivalent reviewed credential) is present. No live GA4 request was made.
- **Exit gate:** Task 7 may start while GA4 remains blocked, or resume Task 6 after owner adds reviewed GA4 credentials and a dedicated live-probe PR

## Task 7 — Local Falcon (optional)

- **Status:** not started
- **Prerequisite:** Task 6 complete or explicitly skipped with recorded blocker

## Task 8 — Business Profile (optional)

- **Status:** not started
- **Prerequisite:** Task 7 complete or explicitly skipped with recorded blocker

## Task 9 — SERP / PAA API

- **Status:** not started
- **Prerequisite:** prior optional adapters resolved or blocked with evidence

## Task 10 — Google Trends

- **Status:** not started
- **Prerequisite:** Task 9 complete or blocked with evidence

## Task 11 — Independent judge on every draft

- **Status:** not started
- **Prerequisite:** Task 10 complete or blocked with evidence

## Task 12 — Indexation / coverage

- **Status:** not started
- **Prerequisite:** Task 11 complete or blocked with evidence

## Task 13 — Post-publish observation loop

- **Status:** not started
- **Prerequisite:** Task 12 complete or blocked with evidence

## Task 14 — Image provenance (optional)

- **Status:** not started
- **Prerequisite:** Task 13 complete or blocked with evidence
