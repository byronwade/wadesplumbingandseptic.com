---
description: Edit drafts against Wade's writing-quality rules (banned AI phrases, plain English, no dash punctuation) before handoff to independent QA.
---

# Writing quality

Run a deliberate edit pass before you call a draft done. Deterministic lint will also reject banned phrases and dash punctuation; do not wait for that failure.

## Pass order

1. **Truth:** every business claim needs an approved fact or becomes `REQUEST_FIRST_PARTY_EVIDENCE`.
2. **Local usefulness:** Santa Cruz County conditions and a safe homeowner next step.
3. **Voice:** plain, specific, warm, unpadded. Cut filler openings and closings.
4. **Style:** no em dashes, en dashes, or spaced hyphen asides in user-facing copy. Prefer comma, colon, or a new sentence.
5. **Banned phrases:** remove AI cliches listed in brand context (`banned_phrases`) and generic filler.
6. **Structure:** one H1, enough H2 sections, FAQ, quick answer, internal links from the plan.

## References

- `references/ai-phrases-to-avoid.md`
- Brand context skill for product voice and CTA rules
