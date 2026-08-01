# Content Instructions

- Read `../docs/seo-agent/BUILD_SPEC.md`, `SOURCE_POLICY.md`, and `DEFINITION_OF_DONE.md` before changing content.
- `pages`, `posts`, and `services` are the committed source of truth for public Markdown. Do not introduce an agent UI, generated bulk pages, a CMS, or database content state here.
- Do not add a service page. New URLs are limited to evidence-backed posts, or to landing pages explicitly approved by a human.
- Prefer a useful existing-page refresh and contextual internal links over a new URL. Do not create doorway pages, keyword stuffing, fabricated jobs or reviews, unsupported local claims, unsafe advice, or date-only freshness edits.
- Preserve required frontmatter, truthful dates, licensed or owned image provenance, descriptive alt text, valid internal links, and approved service areas.
- Never write directly to `main`. Eve may create a bounded draft PR only after all policy, preview, and human-approval gates pass.
- Run the deterministic content and SEO checks for any changed content. Record the evidence and truth classification in `../docs/seo-agent/IMPLEMENTATION_STATUS.md`.
