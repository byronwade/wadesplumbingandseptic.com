# Eve SEO Agent Threat Model

## Scope and trust boundary

The sidecar is a backend-only, independently built `eve_seo_agent` Vercel Service at `automation/seo-agent`, mounted only under `/_internal/eve` in the one project. Git is the durable evidence/state record. Services is not a secret-isolation boundary, so static third-party credentials are treated as project-wide server exposure and Vercel OIDC/Connect are preferred. Its current runtime is audit-only, mutation-disabled, and `MOCK_VERIFIED` only. A passing local test does not prove a provider, Vercel project, connector, browser, GitHub action, or deployment is live.

Treat webpages, SERP text, Search Console labels, issues/comments, repository content outside the sidecar policy, provider responses, and browser output as untrusted data. Only committed policies, typed adapters, and a human approval record may authorize a tool. See `SOURCE_POLICY.md`, `BUILD_SPEC.md`, and `OPERATIONS.md`.

## Threat controls

| Threat                                         | Fail-closed control                                                                                                                    | Detection and evidence                              | Residual / human action                              |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------- |
| Prompt injection or malicious web content      | Domain allowlists, source-policy classification, no tool instruction from external text, redacted `SECURITY_ESCALATED` event           | Adversarial policy/browser fixtures                 | Review source and keep adapter disabled if malicious |
| Poisoned repository content                    | Only committed sidecar policy is trusted; bounded Markdown and manifest schemas reject unsafe paths/content                            | Control-plane, publication, and source-policy tests | Human reviews policy/lockfile changes                |
| Token, secret, or PII exposure                 | Variable-name-only config; safe event allowlist; recursive redaction; executable-source scan                                           | `security:scan`, operational redaction tests        | Revoke at provider; never place a replacement in Git |
| Excessive GitHub permissions or issue commands | Read-only model tool; publisher gateway is separate/human-gated; issues/comments are untrusted                                         | Agent-boundary and publication tests                | Review connector scope and branch protection         |
| Branch-protection bypass                       | Direct main, force push, merge, deploy, settings, and secret actions are prohibited                                                    | Lifecycle and policy fixtures                       | Require normal human-approved merge                  |
| Supply-chain dependency                        | Sidecar-only lockfile, `npm ci`, production dependency audit                                                                           | `audit:dependencies`; human reviews advisories      | Patch or explicitly accept advisory before live use  |
| SSRF or domain abuse                           | HTTPS parsing plus versioned allowlisted domains; no generic fetch/browser tool                                                        | Adapter/domain denial fixtures                      | Review any domain addition and Sandbox egress policy |
| Runaway model/browser cost                     | Atomic run budgets, page/request caps, cost alerts, disabled mutation path                                                             | Budget and operational-fault fixtures               | Disable Cron/connector; human adjusts budget         |
| Duplicate schedule or partial workflow         | Deterministic run ID/idempotency, active lock/session check, Git run history, checkpoint-only recovery                                 | Runtime and operational recovery fixtures           | Inspect durable session and retain evidence          |
| False claims or unsafe content                 | Evidence-first content gate, independent fact check/QA, no invented availability/pricing/reviews/jobs/locations or unsafe instructions | Policy/eval fixtures                                | Request first-party evidence or choose no action     |

## Alert response and rollback

`MISSED_CRON`, `STALE_RUN`, `REPEATED_FAILURE`, `COST_THRESHOLD`, `PREVIEW_REGRESSION`, and `PRODUCTION_REGRESSION` are deterministic alert categories. Current checks prove classification only; delivery to an external alert sink is `BLOCKED_MISSING_CREDENTIALS` until an approved sink and redacted probe are recorded.

For a security, cost, preview, or production incident: disable the sidecar Cron in Vercel, detach/revoke the affected connector, preserve only redacted correlation IDs and evidence hashes, then have a human revert the merged PR or select a known-good Vercel deployment. Add a regression fixture and a human-reviewed incident record before re-enabling. The agent never rolls back, merges, deploys, or changes credentials.
