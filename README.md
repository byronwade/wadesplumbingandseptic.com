# Wade's Plumbing & Septic

High-performance marketing and SEO site for
[www.wadesplumbingandseptic.com](https://www.wadesplumbingandseptic.com).

## Stack

- Next.js 16.3 preview App Router with Cache Components / PPR
- React 19
- Tailwind CSS 4
- shadcn/ui primitives
- Local Markdown content with `use cache` data access
- Chunked `app/sitemap.ts` + Metadata / JSON-LD SEO
- Vercel-ready static generation
- Real Wade's project, team, location, and partner media

There is no external CMS, application database, or server-side language
runtime dependency.

## Development

```bash
npm install
npm run dev
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

## CI (self-hosted only)

GitHub Actions workflows run exclusively on **local self-hosted runners** - not
GitHub-hosted `ubuntu-latest` machines. See
[`ops/self-hosted-runners/README.md`](ops/self-hosted-runners/README.md) to
bring up the Docker fleet (`wades-ci` + `wades-quality` pools).

## Deploying to Vercel

Import this repository in Vercel and keep the default Next.js settings. No
runtime environment variables or external services are required.
