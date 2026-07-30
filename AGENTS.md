# Agent instructions

Rules for coding agents working in this repository.

## Typography: no dash punctuation

**Never use dashes as punctuation in user-facing copy.**

Banned characters and patterns:

- Em dash (Unicode U+2014), including `&mdash;` and `&#8212;`
- En dash (Unicode U+2013), including `&ndash;` and `&#8211;`
- Spaced hyphen asides: ` - ` (space, hyphen, space) used like a dash

This includes:

- Markdown under `content/` (pages, posts, services)
- UI copy in `app/`, `components/`, and `lib/`
- Meta descriptions, titles, alt text, and JSON-LD strings
- GeoJSON / data strings shown to users

### Use real punctuation instead

| Instead of | Prefer |
| --- | --- |
| `work - steep slopes - that is` | `work (steep slopes), that is` |
| `property - and most of it` | `property, and most of it` |
| `suddenly - they build` | `suddenly. They build` |
| `Call to Schedule - 831…` | `Call to Schedule: 831…` |
| `Monday - Friday` / `Monday–Friday` | `Monday to Friday` or `Monday through Friday` |
| `9am - 5pm` / `9am–5pm` | `9am to 5pm` |
| `3–5 years` | `3 to 5 years` |
| `"Great work!" - Sarah, Aptos` | `"Great work!" (Sarah, Aptos)` |

### Still allowed

- Compound words and hyphenated modifiers with **no spaces**: `family-owned`, `well-fed`, `drain-field`
- Markdown list markers: `- item`
- Frontmatter fences: `---`
- Mathematical minus in code: `a - b`

CI validates markdown under `content/` and fails if banned dash punctuation is present.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
