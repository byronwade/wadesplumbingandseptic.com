---
description: Perform a bounded, read-only preview audit after a human-approved draft PR exists.
---

# Preview audit

Require the draft PR, expected commit SHA, preview URL, and indexing controls. Confirm only observable facts: HTTPS, intended commit association, no accidental indexing, canonical/robots/sitemap behavior, valid internal links, and bounded performance data. A failed preview produces a report and human decision, never a production deployment or automatic fix.
