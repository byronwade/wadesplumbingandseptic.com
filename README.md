# Wade's Plumbing & Septic

High-performance marketing and SEO site for
[wadesplumbingandseptic.com](https://wadesplumbingandseptic.com).

## Stack

- Next.js 16 App Router with Cache Components
- React 19
- Tailwind CSS 4
- shadcn/ui primitives
- Local Markdown content
- Vercel-ready static generation

There is no external CMS, application database, or server-side language
runtime dependency.

## Development

```bash
npm install
npm run dev
```

## Content

- `content/pages` contains company and resource pages.
- `content/services` contains service landing pages.
- `content/posts` contains expert tips and homeowner guides.

Each Markdown file uses YAML frontmatter for titles, descriptions, dates,
categories, and image metadata. Routes are generated during `next build`.

## Verification

```bash
npm run check
```

## Deploying to Vercel

Import this repository in Vercel and keep the default Next.js settings. No
runtime environment variables or external services are required.
