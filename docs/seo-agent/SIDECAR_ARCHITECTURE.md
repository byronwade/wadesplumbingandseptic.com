# Vercel Services Sidecar Architecture

For the review-ready architecture diagram, environment matrix, Vercel setup, and trust boundaries, see [HUMAN_REVIEW_AND_DEPLOYMENT.md](HUMAN_REVIEW_AND_DEPLOYMENT.md).

## Boundary

This repository has two independently built services in one Vercel Services deployment:

| Service         | Root directory         | Purpose                                                        | Authority boundary                                                                                                   |
| --------------- | ---------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `site`          | Repository root        | Customer-facing site                                           | Serves `/`; cannot import sidecar code or read agent environment names.                                              |
| `eve_seo_agent` | `automation/seo-agent` | Backend-only research, audit, and draft-proposal control plane | Serves only `/_internal/eve`; has its own install, lockfile, Workflow/Cron metadata, and least-privilege connectors. |

The sidecar has no browser UI, CMS, database, or customer route. Git-backed Markdown and JSON are its persistent state. Its first approved production execution is audit-only; no content mutation, direct-main write, merge, deployment, or production publishing is implemented or authorized by this foundation.

### Optional Vercel Blob Artifact Archive

The sidecar may use a Vercel Blob store only after its shared Services project server-environment exposure is reviewed, for private copies of a completed, already-redacted artifact bundle. It is not a database, a replacement for Git, or shared public-site storage. Git still holds the canonical manifest, evidence hashes, approval record, and any future proposal. Blob receives no raw provider payloads, browser captures, prompts, customer data, credentials, or public URLs.

The archive is fail-closed and is not automatic: it requires an enabled sidecar-only Blob token, production environment, an exact human-approved run ID, and a server-side Git reader that verifies every bundle byte at one exact full commit SHA. The same commit must contain `seo/runs/<run-id>/blob-archive-approval.json`, binding the manifest/bundle digests, timestamp, and non-secret human review reference. Only the archive-eligibility schema's redacted summaries and hashes may pass; raw connector/browser/Search Console/prompt/customer fields are rejected before a provider call. Writes are private, content-addressed, non-overwritable JSON under `wades-eve-seo-agent/v1/<run-id>/`, with a 128-file, 1 MiB-per-file, 5 MiB-per-run maximum. A partial provider failure is an auditable `FAILED` result without automatic retry. The agent has no Blob list, delete, public-serving, or cleanup capability.

## Build and Deployment Convention

Target topology: one Vercel project with framework Services. The checked-in target config is `docs/seo-agent/vercel.services.example.json`: independently built `site` and `eve_seo_agent` services, top-level rewrites exposing Eve only under `/_internal/eve`, and the public site as the catch-all. Eve also transforms `/_internal/eve/*` so its handlers observe `/api/*`. Each service installs from its own root and invokes its own build. The Eve build produces Vercel Build Output API artifacts and native schedule metadata. Do not add `outputDirectory`, `crons`, legacy `routePrefix`, or service-level `maxDuration`, because those override or conflict with the current Services model and Eve-owned metadata.

Activation state: root `vercel.json` declares the reviewed Services topology on the feature branch, and the linked project now uses the Services Framework Preset with Node 24. The reviewed preview deployed both independently built services successfully. Production remains the existing human-controlled `main` deployment until this draft PR is reviewed and merged through normal branch protection; no sidecar action may merge or promote it.

Use preview deployments for sidecar changes. The deployed internal functions remain SSO-protected, so direct endpoint probes are `BLOCKED_PREVIEW_SSO` until an owner approves an SSO-safe verification path. Normal Vercel Git behavior may deploy the sidecar after a human-approved merge to its configured production branch, but the agent never invokes deployment, promotion, or merge.

## Runtime and Environment

The sidecar's package is pinned to Node 24 or newer because the installed Eve release requires it. The Vercel Sandbox backend uses Eve's framework-owned published image; the sidecar does not override a stock Node runtime. Sandbox network policy is `deny-all`.

`automation/seo-agent/.env.example` documents variable names only. Fixture, lint, format, typecheck, test, and build flows work without cloud credentials. A real deployed production sidecar must have `SEO_AGENT_ENV=production` and either Vercel OIDC or `AI_GATEWAY_API_KEY`; all read integrations remain optional and report `BLOCKED_MISSING_CREDENTIALS` until their individually scoped setup is complete. The first production read additionally requires the exact human-approved run ID described in `MANUAL_SETUP.md`.

## Local Verification

Run from the repository root with a compatible Node runtime:

```powershell
npm --prefix automation/seo-agent run ci:offline
npm --prefix automation/seo-agent run dry-run
```

These commands use the sidecar lockfile only. The architecture verifier fails if Eve, AI Gateway, Connect, GitHub Tools, or Sandbox dependencies are added to the root public-site package. It also fails if the sidecar gains a frontend or database dependency.
