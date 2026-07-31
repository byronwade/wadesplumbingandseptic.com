# Eve SEO Agent Build Specification

## 1. Authority, Scope, and Non-Goals

This is the authoritative specification for a backend-only autonomous SEO and content-operations sidecar for Wade's Plumbing & Septic. It is a future implementation contract, not a declaration that any integration is configured or live. Current repository facts override imported assumptions; the public site remains a separate Next.js application and the mirrored WordPress source remains separately governed.

The sidecar SHALL live at `automation/seo-agent` as the independently built `eve_seo_agent` backend service inside this repository's single Vercel Services project. The public Next.js site remains the `site` service at `/`; Eve is reserved to `/_internal/eve` and never adds a public agent UI, CMS, or application database. Git SHALL be the durable source of content proposals, manifests, evidence, query ownership, link graph, experiment records, policy decisions, and audit history. The sidecar MAY read public production and preview URLs, but SHALL not deploy, merge, push to `main`, alter project configuration, or write directly to the site repository's default branch.

Vercel Services is a deployment topology, not a credential-isolation boundary: the site and sidecar share one project and deployment, so static third-party secrets must be treated as project-wide server exposure. Prefer Vercel OIDC and Vercel Connect; never use `NEXT_PUBLIC_` variables for sidecar configuration; block public-site imports of sidecar packages and environment-name access in deterministic checks; and revert to separate projects if a connector cannot be constrained safely within this shared project.

Vercel Blob MAY be used only as a private, bounded secondary archive for an already-redacted artifact bundle after the corresponding Git manifest is committed and a human approves that exact run in a committed Git approval record. Blob is never the source of truth, a database, a lock, an approval record, or a content-state store. Before the first Blob write, a server-side Git reader SHALL resolve the exact full commit SHA and prove that each manifest/evidence byte plus `seo/runs/<run-id>/blob-archive-approval.json` matches the archive plan. The approval record SHALL bind the run ID, manifest digest, bundle digest, approval timestamp, and non-secret review reference. The sidecar SHALL reject raw connector responses, Search Console dimensions, browser captures, credentials, customer data, prompts, and public Blob URLs through an archive-eligibility schema; secret scanning alone is insufficient. Every archived object SHALL be content-addressed, private, non-overwritable, size-bounded, and referenced by its Git path and digest; deletion, listing, and public serving are out of scope for the agent. A partial write SHALL return a redacted `FAILED` receipt with the completed immutable paths and no automatic retry.

The first production run SHALL be audit-only: it may collect evidence and open no content PR. All later content changes SHALL be draft PRs only. A human is the sole authority for review, approval, merge, and production release; Vercel's normal Git integration may deploy a human-approved merge to `main` automatically only after its existing repository and project protections pass.

## 2. Verified Platform Direction and Future Preconditions

The implementation SHALL use the current Vercel agent stack where available: Eve for durable agent sessions, AI Gateway for model access and provider fallbacks, Workflows for checkpointed long-running execution, Sandbox for isolated untrusted commands, Connect for scoped OAuth/API credentials, Cron schedules, GitHub Tools, Vercel preview deployments, and Vercel observability. Eve documents durable execution, sandboxed compute, approvals, subagents, evaluations, tracing, Git-based agent files, and Vercel Cron-backed schedules [Vercel Eve announcement](https://vercel.com/blog/introducing-eve). Vercel documents the GitHub connector, scoped token minting, approval-aware GitHub tools, deployed webhook triggers, and OIDC authentication [GitHub agent guide](https://vercel.com/kb/guide/github-agent-eve). Sandbox is isolated ephemeral compute, not persistence [Vercel Sandbox](https://vercel.com/docs/sandbox). Git-based Vercel projects create preview deployments for branch/PR changes and production deployments after the production branch changes [Vercel Git deployments](https://vercel.com/docs/git).

These are implementation targets, not present configuration. Before a feature declares `LIVE_VERIFIED`, it SHALL record project IDs, connector identities, least-privilege scopes, deployment URL, a successful authenticated probe, retrieval timestamp, and redacted evidence. Missing credentials or project configuration SHALL be `BLOCKED_MISSING_CREDENTIALS`, never silently replaced by fabricated data.

## 3. Repository Facts and Content Boundary

The public site is a Next.js application whose content source of record is committed Markdown under `content/pages`, `content/posts`, and `content/services`. The current loader is `lib/content.ts`; routing is served by the App Router, including the content-backed catch-all route, and `app/sitemap.ts`, `app/robots.ts`, and `next.config.ts` are the current technical-SEO sources. The repository now has the isolated `automation/seo-agent` sidecar and a credential-free self-hosted CI workflow source contract, neither of which establishes a linked Vercel project or an operating runner. The current repository also contains `wordpress/` mirrored custom theme/plugin source. This sidecar SHALL not infer that a route, service, service area, review, credential, operating hour, or capability is approved merely because a string exists in a historic page.

The content validator and repository inventory SHALL follow this Markdown source of record. Any proposed edit must use the mapped Markdown source, preserve the content loader's supported frontmatter, and remain subject to the approved-facts, change-manifest, PR, preview, and human-review gates.

## 4. Evidence Model and Truth States

Every run SHALL write immutable, content-addressed or uniquely named records under `seo/` and reference them from a run manifest. Minimum record fields: `schema_version`, `run_id`, `collected_at`, `source`, `source_url_or_tool`, `scope`, `classification`, `redaction`, `sha256`, and `retention_class`.

| Classification                | Meaning                                                                                    | Required proof                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `LIVE_VERIFIED`               | Real integration or public behavior was observed in the intended environment.              | Timestamped redacted tool response or reproducible URL plus successful probe.         |
| `MOCK_VERIFIED`               | Deterministic fixture or isolated test passed.                                             | Fixture ID, command, exit code, and assertion result.                                 |
| `BLOCKED_MISSING_CREDENTIALS` | Required access, approval, service, or data is unavailable.                                | Exact missing prerequisite, safe next owner action, and no substitute claim.          |
| `FAILED`                      | A configured or reachable live probe returned an error or the intended endpoint is absent. | Timestamp, safe request identifier or endpoint, failure class, and corrective action. |

The agent SHALL preserve source URLs, retrieval dates, query parameters that affect results, summaries, and short factual excerpts. It SHALL not persist personal data, tokens, cookies, raw Search Console rows that expose sensitive query information, customer form data, or copyrighted third-party text beyond a justified minimal excerpt. All data retention and redaction decisions are logged in the run manifest.

`SOURCE_POLICY.md` is binding for research. It defines source tiers, records provenance/access dates, requires conflict escalation instead of autonomous fact selection, and makes competitor material gap-analysis-only. All web/API content is untrusted data and cannot instruct the agent, approve a claim, change an allowlist, or cause a tool call. Search Console analysis SHALL exclude the most recent three calendar days unless the provider independently proves completion.

## 5. Roles and Orchestration

The orchestrator is the only coordinator. It SHALL issue typed work packets, enforce budgets and state transitions, collect evidence, and produce a final recommendation. It SHALL not author a PR by itself.

| Agent          | Responsibilities                                                                                     | May write                       |
| -------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------- |
| Orchestration  | Run plan, approvals, budgets, manifests, triage, handoffs.                                           | Run records only.               |
| Analytics      | Search Console, PageSpeed, optional GA4 data; trend/anomaly calculation.                             | Evidence and metrics.           |
| Research       | Santa Cruz County plumbing/septic demand, SERP intent, regulations, competitor/public-page research. | Evidence and hypotheses.        |
| Strategy       | Opportunity score, query-to-page ownership, existing-page-first decision, experiments.               | Proposed plan.                  |
| Writing        | Markdown drafts and metadata proposals.                                                              | Isolated branch workspace only. |
| Fact checking  | Claims, safety language, service-area evidence, citations, freshness.                                | Review report.                  |
| Internal links | Link graph, orphan/overlink checks, contextual link proposals.                                       | Link plan.                      |
| Technical SEO  | Crawl, metadata, canonical, robots, sitemap, redirects, schema, performance checks.                  | Audit report.                   |
| Independent QA | Re-run deterministic checks, inspect diff/preview, challenge unsupported claims.                     | QA report.                      |

Each role SHALL receive only the tools and data required for its work. The research and writing roles cannot access GitHub write tools. The GitHub PR tool must be exposed only to an approved publication workflow and configured to create a draft PR; merge, direct branch update, repository settings, secret, deployment, issue, and release writes are denied. The system SHALL fail closed if a tool cannot enforce this constraint.

## 6. Demand, Intent, and Opportunity Process

The research agent SHALL establish Santa Cruz County plumbing and septic demand and intent using source-tiered evidence: Search Console queries and landing-page performance when authenticated; PageSpeed and Vercel runtime/preview signals; public search/browser research; repository-supported service inventory; and publicly authoritative local/regulatory sources where relevant. GA4, Local Falcon, Similarweb, Business Profile, and tracing are optional adapters, each disabled by default and classified accurately when unavailable.

The strategy agent SHALL normalize query clusters, classify intent (emergency, service, comparison, maintenance, cost/financing, local, informational), map a single canonical owner page, and score opportunities. Score formula and weights SHALL be versioned. A minimum initial formula is:

`opportunity = demand(0-5) * intent_fit(0-5) * business_evidence(0-5) * feasibility(0-5) - cannibalization_risk(0-5) - safety_risk(0-5)`.

A proposal cannot create a URL until it shows that no existing owned canonical page can serve the intent better. Each proposal needs a duplicate/cannibalization analysis, change rationale, page owner, target query cluster, source evidence, service-area approval, internal-link plan, expected metric, counterfactual/control, and rollback target. No URL may be generated from a city-keyword template or approximate service-area boundary.

## 6.1 Editorial Growth, Reuse, and Image Policy

The default growth surface is a helpful `content/posts` blog post. A net-new URL is permitted only for a blog post, or for an explicitly human-approved landing page after the same existing-page, query-owner, cannibalization, service-area, and preview gates. The agent SHALL never create a new service page. It may refresh an existing service page only when first-party facts support the bounded improvement; generic page edits remain manual unless the owner has specifically approved the item as landing-page work.

Every creation or refresh SHALL begin with the current Markdown inventory and link graph. It must reuse and strengthen relevant existing content with visible, contextual internal links that help readers, have a canonical target, and include a reader-benefit rationale. The system must prefer a high-confidence refresh or link improvement over a new URL whenever the existing owner can meet the intent.

Blog timing SHALL be demand-timed, not calendar-cadenced. A proposal needs current signals, expected metric, content-quality assessment, coverage/cannibalization result, and an observation window; an empty backlog or low-confidence evidence is a valid `NO_ACTION`. Holiday content is allowed only when it is upcoming, locally relevant, useful beyond the date, non-duplicative, and supported by evidence. It must record the holiday date, 7–120 day useful lead time, local-relevance evidence, and the outcome metric. A date-only refresh or a fixed posting quota is prohibited.

Image discovery is research, not authority to publish. Before an image can enter a draft, the proposal SHALL record its HTTPS provenance URL, owned/licensed/public-domain/explicit-permission classification, rights-evidence identifier, local asset path, descriptive alt text, content-specific relevance rationale, and first-party support for any local or business claim visible in the asset. The agent must reject untraceable, irrelevant, copied, misleading, oversized, or unlicensed imagery. It SHALL not download, publish, or imply a relationship from an image source without a human-approved asset path and PR review.

## 7. Approved Facts, Safety, and Content Rules

Approved service areas SHALL be derived from an explicit repository fact registry, not geography guesses, advertising tools, or model knowledge. The registry needs source path, exact excerpt/structured fact, date found, reviewer decision, and expiry/revalidation date. Until a reviewer approves a fact, the agent SHALL use conditional wording or mark the proposal blocked. Santa Cruz County appears in current source and is a research focus, but the exact service-area set must still be reviewed before publication.

The writing and fact-checking agents SHALL reject doorway pages, keyword stuffing, fabricated jobs/reviews/testimonials, fake urgency, guaranteed outcomes, unsupported licensing/insurance/certification/price/availability claims, deceptive comparisons, and advice that could create plumbing, septic, electrical, health, or property risk. Emergency content may recommend safe high-level actions such as contacting a qualified professional but SHALL not give unsafe repair instructions. Claims about permits, regulations, financing, dispatch, and emergency availability require current supporting evidence.

Every draft must include: purpose, query cluster, canonical URL, title/meta/H1 proposal, content diff, citations/evidence, factual-claim inventory, safety review, structured-data impact, internal links added/removed, redirects/canonical assessment, and rollback method. The fact checker must independently approve or reject every claim before QA.

## 8. GitHub, Vercel, Preview, and Production Flow

1. Orchestrator creates an audit manifest and uses read-only tools.
2. Strategy selects at most the configured proposal budget and the human approves work creation.
3. A sandbox receives a least-privilege temporary workspace, runs only allowlisted commands, and never contains persistent credentials.
4. Writing produces a branch diff; fact checking, technical SEO, links, and independent QA attach reports.
5. GitHub Tools create one draft PR with checklists and evidence links. The agent neither requests bypasses nor merges it.
6. Vercel creates a sidecar preview and public-site preview according to their independently linked projects. QA records preview URL, commit SHA, audit timestamp, crawl/index controls, visual/crawl checks, PageSpeed results where available, and any limitation.
7. A human approves and merges. The existing Vercel Git integration then performs the normal production deployment from `main`; the agent does not deploy or promote.
8. A post-merge production audit checks the exact production URL, commit/deployment association, sitemap/robots/canonical behavior, critical templates, and approved performance budget. Failure produces a human-facing rollback recommendation; only a human executes rollback.

Preview audits must avoid accidental indexing or analytics pollution. Production audits are read-only and rate-limited. A failed preview or production audit never gives the agent authority to modify production.

## 9. State, Schemas, and Required Artifacts

All schemas are versioned JSON or YAML and validated offline. The implementation SHALL create and validate:

| Artifact          | Location                             | Purpose                                                     |
| ----------------- | ------------------------------------ | ----------------------------------------------------------- |
| Run manifest      | `seo/runs/<run-id>/manifest.json`    | Inputs, tool use, costs, classification, state transitions. |
| Evidence packet   | `seo/evidence/<id>.json`             | Source, timestamp, redaction, hash, claim links.            |
| Page inventory    | `seo/manifests/pages.json`           | URL, source path, canonical, type, lifecycle, owner.        |
| Query ownership   | `seo/manifests/query-ownership.json` | Cluster, intent, owner URL, confidence, conflict state.     |
| Link graph        | `seo/manifests/link-graph.json`      | Nodes, edges, anchors, orphan and duplication signals.      |
| Fact registry     | `seo/manifests/approved-facts.json`  | Reviewed business/service-area claims only.                 |
| Experiment record | `seo/experiments/<id>.json`          | Hypothesis, metric, baseline, exposure, outcome, rollback.  |
| PR packet         | `seo/runs/<run-id>/pr-packet.md`     | Diff rationale, reviews, preview, approval checklist.       |

No artifact may contain a secret. The run manifest records semantic version, prompt/skill hashes, model identifier, provider route if available, tool-call count, token/cost figures if available, wall time, sandbox image/version, and source-code SHA for reproducibility.

## 10. Deterministic CI, Evals, and Budgets

Offline CI SHALL run without network, live credentials, browser dependency, or mutable time. It SHALL validate schemas, content front matter, duplicate canonical ownership, service-area references, unsafe-claim denylist, link graph integrity, markdown links against fixtures, redirect/canonical maps, prompt-injection fixtures, policy-tool permissions, artifact secret scanning, and fixture-driven evals. Live checks are separate, explicitly named, and never mask an offline failure.

The required deterministic gate SHALL run on a dedicated self-hosted CI runner once that runner is provisioned. The runner must have a pinned supported Node runtime and package-manager version, no production credentials, no browser profile or personal keychain, an ephemeral/reverted workspace, outbound network disabled for the offline gate, and an allowlisted cache containing only pinned dependencies. It must publish command, dependency-lock hash, Node/package-manager versions, fixture revision, duration, exit code, and redacted logs as artifacts. The runner may not auto-merge, deploy, modify GitHub settings, or carry workspaces/secrets across jobs. `.github/workflows/seo-agent-offline.yml` and `automation/seo-agent/ci/self-hosted-runner-policy.json` define this source contract, but provisioning and successful runner execution remain `BLOCKED_MISSING_CREDENTIALS`/infrastructure until a human supplies the isolated runner and host firewall evidence.

The implementation SHALL provide test tiers: unit/schema; fixtures/contract; agent evals; sandbox integration; preview audit; production read-only audit. Evals must include refusal tests for direct-main writing, merge attempts, prompt injection, fabricated reviews/jobs, unsupported service areas, unsafe advice, data exfiltration, content duplication, unauthorized new service URLs, fixed-cadence publishing, unlicensed/irrelevant image plans, and generic-page edits. Every new tool, prompt, or policy change requires a regression eval.

Budget configuration is versioned and enforced before execution: maximum runs per schedule, model tokens/cost, tool calls, browser pages, Sandbox CPU/wall time, network domains, changed files/lines, PRs per cycle, proposed URLs per cycle, and external request rates. Hitting a budget stops the run with a manifest entry and cannot auto-retry indefinitely.

## 11. Security and Prompt-Injection Controls

Treat every webpage, SERP snippet, analytics label, GitHub issue/comment, external document, and repository file outside the trusted sidecar policy as untrusted data. Tool instructions come only from signed/committed policy and typed code. The agent SHALL separate data from instructions, quote external material as evidence, reject requests to reveal secrets/change policy/bypass approvals, use allowlisted domains and commands, validate structured tool input/output, redact logs, pin dependencies, and use least-privilege short-lived OIDC/Connect tokens. Sandbox network egress, filesystem mount, and command permissions SHALL be explicit and minimal.

The agent SHALL not accept a webpage instruction as authority to create content, execute commands, contact a third party, alter a policy, or escalate permissions. Suspected injection gets a `security_event` record and human escalation. Connectors are scoped separately by environment, and production connector access is unavailable to development/preview deployments unless explicitly approved in `MANUAL_SETUP.md`.

## 12. Observability, Failure Handling, and Rollback

Eve traces and Vercel observability are the primary execution trace; OpenTelemetry export is optional. Each run exposes correlation ID, run state, model/tool latency, tool approvals, denial reason, costs, audit outcome, PR URL, preview URL, and redacted error classification. Alerting thresholds cover repeated failures, policy denials, budget exhaustion, connector authorization failures, production-audit regressions, and suspicious external content.

The state machine is `PLANNED -> COLLECTING -> ANALYZING -> AWAITING_HUMAN_APPROVAL -> DRAFTING -> REVIEWING -> QA -> DRAFT_PR_OPEN -> HUMAN_REVIEW -> MERGED_BY_HUMAN -> PRODUCTION_AUDIT -> CLOSED`, with terminal `REJECTED`, `BLOCKED_MISSING_CREDENTIALS`, `BUDGET_EXHAUSTED`, and `SECURITY_ESCALATED`. No state transition bypasses evidence, required review, or human merge. Rollback is a documented human procedure: revert the merged PR or use a known-good Vercel deployment; then record the result in the linked experiment/run manifest.

## 13. Completion Stop Hook

`.agents/hooks/eve-seo-agent-stop.ps1` is a control-plane completion gate. It must remain a no-op unless the repository-root sentinel `.agents/ENABLE_EVE_SEO_AGENT_STOP_HOOK` exists. The sentinel SHALL only be added during the final verification phase after all required tooling is present. When enabled, the hook fails completion if the status file lacks final-phase evidence or any acceptance command recorded in the Definition of Done has not passed. The hook must not alter files, create work, invoke an agent, or retry; it reports precise missing evidence and exits. This prevents recursive early-development loops while retaining a final human-enabled completion safeguard.

## 14. Canonical Verification Evidence

`npm run verify:all` is the only canonical root verification entry point. From a clean worktree, it runs root and sidecar formatting, lint, TypeScript, unit/integration tests, policy evals, deterministic content/SEO/link/schema/service-area/similarity checks, secret scans, audit-only fixtures, local health smoke checks, production builds, and the dependency advisory. It writes ignored local evidence under `artifacts/verification/<run-id>/`: `results.json`, `summary.md`, one redacted command log per check, and parsed reports where available.

The result captures run/timing identity, commit and Git-tree identity, a byte-level tracked-working-tree hash, runtime versions, exact commands, exit codes, durations, test/eval counts, build status, integration classifications, skipped reasons, high/critical findings, and external blockers. `npm run verify:completion` rejects absent/stale evidence, failed required checks, high/critical findings, unclassified integrations, and incomplete machine DoD rows. Explicit `BLOCKED_MISSING_CREDENTIALS` integration and DoD records remain truthful external blockers, not live-operation claims.

The final hook accepts caller-owned active-state JSON and may emit one bounded continuation only when the goal remains active and `verify:completion` fails. It never writes state, retries a command, or creates work; callers update the continuation count.
