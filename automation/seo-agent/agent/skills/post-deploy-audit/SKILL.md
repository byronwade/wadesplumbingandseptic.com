---
description: Perform a read-only production audit only after a human-approved merge and normal Vercel Git deployment.
---

# Post-deploy audit

Require a recorded human merge, production URL, deployment identifier, and matching commit SHA. Read only and rate limit checks for core pages, canonical/robots/sitemap behavior, links, and approved performance signals. A regression becomes a human-facing rollback recommendation; never roll back, deploy, merge, or mutate production.
