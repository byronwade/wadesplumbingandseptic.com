# Wade's Plumbing & Septic

High-performance marketing and SEO site for
[www.wadesplumbingandseptic.com](https://www.wadesplumbingandseptic.com).

## Stack

- Next.js 16.3 preview App Router with Cache Components / PPR
- React 19
- Tailwind CSS 4
- shadcn/ui primitives
- Local Markdown content with `use cache` data access
- Priority-sorted, image-aware chunked `app/sitemap.ts` + Metadata / JSON-LD SEO
- Vercel-ready static generation
- Real Wade's project, team, location, and partner media

There is no external CMS, application database, or server-side language
runtime dependency.

Page-view popularity uses a JSON document store (not a database): local
`data/page-views.json` in development, and [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
in production when `BLOB_READ_WRITE_TOKEN` is set. Unique views are cookie-gated
(`wps_seen`). Sort archives with `?sort=popular|trending|newest`, or open the
dedicated `/services/popular`, `/services/trending`, `/expert-tips/popular`,
and `/expert-tips/trending` pages.

## Development

```bash
npm install
npm run dev
```

Optional for durable view counts on Vercel:

```bash
# .env.local
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

## Content

- `content/pages` contains company, location, campaign, service-area, career, and resource pages.
- `content/services` contains service landing pages.
- `content/posts` contains expert tips and homeowner guides.

Each Markdown file uses YAML frontmatter for titles, descriptions, dates,
categories, tags, image metadata, and optional project galleries. Nested
folders preserve nested legacy routes. Routes are generated during `next build`.

To backfill missing legacy WordPress URLs from the Wayback Machine:

```bash
# Requires beautifulsoup4 + html2text
python3 -u scripts/migrate-from-wayback.py
```

## Verification

```bash
npm run check
npm run ci:content
npm run ci:self-hosted-policy
```

## Eve SEO Agent

Eve is a private, backend-only SEO operations service at
`automation/seo-agent`. It has no public UI, CMS, or application database.
The public site does not import Eve code or expose Eve environment variables.
Git and the committed `seo/` records remain the source of truth for evidence,
proposals, approvals, and rollback information.

### What Eve can do today

- Run deterministic local audit fixtures, policy checks, content checks, and
  Eve evaluations without cloud credentials.
- Expose private health and readiness endpoints at
  `/_internal/eve/api/healthz` and `/_internal/eve/api/readyz`.
- Protect its internal Cron dispatcher at `/_internal/eve/api/cron` using a
  timing-safe secret comparison.
- Create durable audit sessions when its runtime dependencies are configured.
- Enforce observe mode, an audit-only first run, duplicate-run protection,
  limits, and the default mutation kill switch.
- Evaluate source policy, content safety, page ownership, internal links,
  query overlap, and a valid no-change decision in local fixture mode.

### What configuration can enable

The service can make real, read-only research requests only after the owner
configures a model identity through Vercel OIDC or `AI_GATEWAY_API_KEY`, then
enables and verifies each least-privilege integration separately. Supported
read-side integrations include Vercel AI Gateway, GitHub repository inspection,
Vercel project and deployment inspection, Search Console, PageSpeed Insights,
and controlled web or browser research. Optional adapters include GA4, Business
Profile, Local Falcon, Similarweb, Google Trends, tracing, and private Blob
archiving of already approved redacted evidence bundles.

Each live integration is reported as `LIVE_VERIFIED`, `MOCK_VERIFIED`,
`BLOCKED_MISSING_CREDENTIALS`, or `FAILED`. A configured variable alone does
not make an integration live.

### What Eve cannot do today

- It cannot make a model-backed research request until AI Gateway credentials
  or Vercel OIDC are available to the deployed service.
- It cannot currently write site content, create a Git branch, or open a
  content pull request. The installed GitHub Eve tool is intentionally read
  only, and every current runtime mode remains audit-only.
- It cannot merge a pull request, push to `main`, deploy production, modify
  repository or Vercel settings, change secrets, publish to a Business Profile,
  or bypass a human review.
- It cannot create new service pages. Any future draft proposal must prefer an
  evidence-backed update to an existing page, and a new URL is limited to a
  useful blog post or an explicitly approved landing page.

### Before a live draft-content test

1. Add a fresh `AI_GATEWAY_API_KEY` or enable Vercel OIDC for the production
   Eve service. Do not reuse credentials pasted into chat or committed files.
2. Keep `SEO_AGENT_RUN_MODE=propose` only for the approved run, retain
   `SEO_AGENT_MUTATION_KILL_SWITCH=true` until the guarded publication gateway
   is reviewed, and leave automatic merge disabled.
3. Deploy the separately reviewed publication gateway. It must be limited to
   one draft PR, a nondefault `eve/seo/` branch, one new URL, bounded files,
   complete evidence, and a human reviewer.

See [`docs/seo-agent/MANUAL_SETUP.md`](docs/seo-agent/MANUAL_SETUP.md) for
owner setup and [`docs/seo-agent/BUILD_SPEC.md`](docs/seo-agent/BUILD_SPEC.md)
for the safety contract.

## CI (self-hosted only)

GitHub Actions workflows run exclusively on **local self-hosted runners** - not
GitHub-hosted `ubuntu-latest` machines. See
[`ops/self-hosted-runners/README.md`](ops/self-hosted-runners/README.md) to
bring up the Docker fleet (`wades-ci` + `wades-quality` pools).

## Deploying to Vercel

Import this repository in Vercel and keep the default Next.js settings. No
runtime environment variables or external services are required.
