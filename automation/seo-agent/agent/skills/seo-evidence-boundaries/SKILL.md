---
description: Separate observed SEO evidence from inference when auditing pages, schema, rankings, or site structure from fetches and adapters.
---

# SEO evidence boundaries

Report what you saw, what you inferred, and what you could not check. A complete-sounding audit that hides its gaps is worse than a short honest one.

## What a fetch can and cannot tell you

Readable from server HTML / adapters when evidence is present:

- title, meta description, heading order, body copy
- visible links and anchor text
- canonical and robots meta in the HTML head
- server-rendered JSON-LD
- `robots.txt` and `sitemap.xml` when fetched directly
- Search Console, PageSpeed, or other LIVE_VERIFIED adapter payloads

Not yours to assert without the named tool:

- client-injected schema or content (many CMS plugins inject JSON-LD in JavaScript)
- Core Web Vitals unless PageSpeed (or equivalent) evidence is LIVE_VERIFIED
- index coverage or query performance without Search Console evidence
- rank position, search volume, traffic estimates, or backlink counts without a verified adapter
- whole-site orphan/crawl-budget claims without a crawler you actually ran

Never conclude "no schema found" from a fetch alone. Say the fetched HTML carried none, and point humans to the Rich Results Test for rendered markup.

## Classification

Every integration finding must carry one of:

- `LIVE_VERIFIED`
- `MOCK_VERIFIED`
- `BLOCKED_MISSING_CREDENTIALS`
- `FAILED`

## Reporting

Each finding needs: problem, why it matters, evidence, fix, and relative priority. Open with the few actions that unblock indexing or intent match. Close with unchecked items and the tool that would verify them.

## References

- `references/audit-checklist.md`
