# Eve Integration Rollout Tasks

Sequential, one-feature-at-a-time rollout. **Do not start the next task until the current task has a dedicated PR, thorough tests, and a truthful live proof.**

## Rules

1. **One feature = one PR.** No bundling unrelated adapters.
2. **Prove before wiring.** Live adapter read/`LIVE_VERIFIED` comes before using that evidence to change topic selection or draft content.
3. **Fail closed.** If credentials, scopes, or probes fail, mark `BLOCKED` and stop. Do not fake `LIVE_VERIFIED`.
4. **Offline first.** Deterministic sidecar tests and fixtures must pass before any Production live probe.
5. **Reset one-time live-read approval** after each probe review (`SEO_AGENT_LIVE_READS_APPROVED=false`, remove run ID).
6. **Human merge only.** Eve still cannot write `main`, merge, or deploy.
7. **Quality first.** Integrations exist to improve topic choice and draft quality, not to burn tokens on unused data.

## Credential snapshot (2026-08-03)

Checked Production env var **names** for `wadesplumbingandseptic-com` (values not logged):

| Integration | Credential present | Enable flag present | Live verified? |
| --- | --- | --- | --- |
| Search Console (`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`) | Yes | `SEO_AGENT_ENABLE_SEARCH_CONSOLE` present | **No** (config only; not proven) |
| PageSpeed (`PAGESPEED_API_KEY`) | Yes | `SEO_AGENT_ENABLE_PAGESPEED` present | **No** (key stored; flag historically off / unproven) |
| Live-read approval vars | Present | `SEO_AGENT_LIVE_READS_APPROVED` + run ID exist | Must be set intentionally per probe |

Sensitive flag values are encrypted and were not decoded here. Treat enablement as unproven until a redacted live probe returns `LIVE_VERIFIED`.

---

## Task 1 — Search Console live verification

- **Status:** `READY_TO_START` (credentials appear present)
- **PR:** `cursor/eve-search-console-live-aab8` (dedicated)
- **Goal:** Confirm the Search Console adapter can perform a bounded, read-only live request and return redacted `LIVE_VERIFIED` evidence.
- **Out of scope:** Changing topic selection or writer prompts (Task 3).
- **Work**
  - Confirm service-account property access for the Wade site.
  - Enable only `SEO_AGENT_ENABLE_SEARCH_CONSOLE=true` for one approved Production run ID.
  - Run `npm --prefix automation/seo-agent run live:probe -- --execute --run-id=<exact-id>`.
  - Keep mutation/publish off. Observe-only for this probe unless an existing propose path is unrelated and already approved.
  - Record redacted evidence in `IMPLEMENTATION_STATUS.md`.
  - Reset live-read approval after review.
- **Acceptance**
  - Offline adapter/probe fixtures pass.
  - Live result classifies Search Console as `LIVE_VERIFIED` (not `BLOCKED_MISSING_CREDENTIALS` / `FAILED`).
  - No content write, draft PR, merge, or deploy from this task.
- **Exit gate:** Task 2 may start only after this PR is human-merged or explicitly deferred with a recorded blocker.

## Task 2 — PageSpeed Insights live verification

- **Status:** `BLOCKED_BY_PRIOR` until Task 1 exits
- **PR:** dedicated PageSpeed branch
- **Goal:** Confirm PageSpeed API key works for a bounded URL audit and returns redacted `LIVE_VERIFIED` evidence.
- **Out of scope:** Wiring into proposal QA (Task 4).
- **Work**
  - Enable only `SEO_AGENT_ENABLE_PAGESPEED=true` for one approved run ID (Search Console may stay enabled if already proven, but do not mix new wiring).
  - Probe one owned URL (homepage or a stable service page).
  - Record Core Web Vitals / score summary as redacted evidence.
  - Reset live-read approval after review.
- **Acceptance**
  - Offline PageSpeed fixtures pass.
  - Live PageSpeed = `LIVE_VERIFIED`.
  - No content mutation.
- **Exit gate:** Task 3 only after this task exits cleanly or is explicitly blocked with owner direction.

## Task 3 — Wire Search Console into topic selection

- **Status:** `BLOCKED_BY_PRIOR` until Task 1 is `LIVE_VERIFIED`
- **PR:** dedicated “GSC → opportunity ranking” branch
- **Goal:** Use live (or cached redacted-run) Search Console query/page evidence to prefer topics and existing-page improvements that already show demand.
- **Acceptance**
  - Deterministic fixtures with mocked GSC rows.
  - Fail closed when GSC is unavailable (calendar/catalog fallback remains truthful).
  - PR brief cites GSC-derived rationale without leaking raw sensitive query dumps.
  - No live claim without Task 1 proof.

## Task 4 — Wire PageSpeed into draft/preview QA

- **Status:** `BLOCKED_BY_PRIOR` until Task 2 is `LIVE_VERIFIED`
- **PR:** dedicated PageSpeed QA branch
- **Goal:** After a draft exists (or on preview audit), record PageSpeed evidence and fail closed on severe regressions for owned URLs under review.
- **Acceptance**
  - Mocked PSI fixtures; live path only when enabled + approved.
  - Does not block draft PR creation on PSI outage; classifies truthfully.
  - Findings appear in reviewer brief / audit manifest.

## Task 5 — Browser research deepening (+ Browserbase optional)

- **Status:** `BLOCKED_BY_PRIOR` until Tasks 1–4 exit (or owner reorders after GSC/PSI)
- **PR:** dedicated browser-research branch
- **Goal:** Strengthen allowlisted community/event corroboration used in demand-timed posts. Optionally prove Browserbase for JS-heavy pages.
- **Acceptance**
  - Domain allowlist + injection escalation fixtures still pass.
  - Live HTTP research or Browserbase session classified truthfully.
  - Writer still cannot invent sponsorship/affiliation.

## Task 6 — GA4 read-only engagement signals

- **Status:** `BLOCKED_BY_PRIOR`
- **PR:** dedicated GA4 branch
- **Goal:** Live-verify GA4, then (same task only after live proof) use aggregate engagement to prefer expanding winners / avoid weak repeats.
- **Acceptance**
  - Credential + property scoped read-only.
  - Offline fixtures + one `LIVE_VERIFIED` probe before any ranking weight ships.
  - No PII in manifests.

## Task 7 — Local Falcon (local pack / geo rank)

- **Status:** `BLOCKED_BY_PRIOR`
- **PR:** dedicated Local Falcon branch
- **Goal:** Live-verify local-rank reads for Santa Cruz County plumbing/septic, then use for service-page refresh priority (existing page first).
- **Acceptance**
  - Optional adapter remains disabled by default until proven.
  - Evidence is gap-analysis only; no competitor-copying.

## Task 8 — Google Business Profile Performance

- **Status:** `BLOCKED_BY_PRIOR`
- **PR:** dedicated GBP branch
- **Goal:** Live-verify read-only Business Profile performance / search terms; feed FAQ and local topic ideas.
- **Acceptance**
  - Read-only scope; redacted evidence.
  - No autonomous GBP posts or reply mutations.

## Task 9 — SERP / People Also Ask API

- **Status:** `BLOCKED_BY_PRIOR`
- **PR:** dedicated SERP provider branch (SerpAPI, DataForSEO, or reviewed equivalent)
- **Goal:** For the already-chosen topic, fetch PAA / related queries / ranking SERP context into the writer brief.
- **Acceptance**
  - New adapter with allowlist, budgets, and untrusted-data handling.
  - Offline fixtures first; one live probe; then wire into writer brief in the same PR only after live proof in that PR’s evidence section.
  - Competitor pages = gap analysis only.

## Task 10 — Google Trends (or approved Trends proxy)

- **Status:** `BLOCKED_BY_PRIOR`
- **PR:** dedicated Trends branch
- **Goal:** Replace or corroborate hand-maintained trend windows with live seasonality evidence.
- **Acceptance**
  - Live or explicitly `BLOCKED` with no fake trend claims.
  - Demand calendar remains valid offline fallback.

## Task 11 — Independent judge on every draft

- **Status:** `BLOCKED_BY_PRIOR` (can be reordered earlier if owner wants quality gate before more data sources)
- **PR:** dedicated independent-QA branch
- **Goal:** Run the independent judge model on every proposal draft before Connect PR open; reject or expand on failure.
- **Acceptance**
  - Deterministic fixture path + live model path classified separately.
  - Token guard still applies; quality rejection does not open junk PRs.
  - No merge/deploy authority.

## Task 12 — Indexation / coverage signals

- **Status:** `BLOCKED_BY_PRIOR` until Task 1 is `LIVE_VERIFIED`
- **PR:** dedicated GSC coverage / URL Inspection branch
- **Goal:** Know whether prior posts in a cluster are indexed before writing more of the same intent.
- **Acceptance**
  - Uses Search Console APIs already proven in Task 1 where possible.
  - Fail closed / degrade when inspection quota or scope is missing.

## Task 13 — Post-publish observation loop

- **Status:** `BLOCKED_BY_PRIOR` until Tasks 1, 3, and preferably 6 exist
- **PR:** dedicated observation-loop branch
- **Goal:** 14 to 28 days after a human-merged post, pull GSC/GA4 deltas for that URL/query cluster and feed the next topic decision.
- **Acceptance**
  - Git-backed observation manifest; no CMS/DB.
  - Truthful when data is immature (<3 day GSC lag policy still applies).

## Task 14 — Image provenance / rights (optional)

- **Status:** `OPTIONAL` / last
- **PR:** dedicated image-rights branch
- **Goal:** Only if Eve should propose real images; provenance, rights, alt text, relevance gates.
- **Acceptance**
  - Text drafts never blocked on missing images.
  - No unlicensed scraping into the repo.

---

## Suggested near-term order (owner confirmed)

1. Task 1 Search Console live  
2. Task 2 PageSpeed live  
3. Task 3 GSC → topic selection  
4. Task 4 PageSpeed → QA  
5. Then continue 5 → 14 as above  

If a live probe for Task 1 or 2 fails, stop and fix credentials/scopes before any “wire into Eve” PR.

## Progress log

| Task | Branch / PR | Offline tests | Live class | Notes |
| --- | --- | --- | --- | --- |
| 1 Search Console live | | | | Credentials present 2026-08-03; not yet probed |
| 2 PageSpeed live | | | | API key present 2026-08-03; not yet probed |
| 3 GSC topic wiring | | | | Blocked on Task 1 |
| 4 PSI QA wiring | | | | Blocked on Task 2 |
| 5 Browser research | | | | |
| 6 GA4 | | | | |
| 7 Local Falcon | | | | |
| 8 Business Profile | | | | |
| 9 SERP / PAA | | | | |
| 10 Trends | | | | |
| 11 Independent judge | | | | |
| 12 Indexation | | | | |
| 13 Observation loop | | | | |
| 14 Images | | | | |
