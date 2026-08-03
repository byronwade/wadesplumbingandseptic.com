# Audit checklist (evidence-aware)

Mark each row with the verifier you actually used, or `none`.

| Area | Check | Verifier |
| --- | --- | --- |
| Indexability | robots.txt / meta robots / noindex | fetch or inventory |
| Canonical | self-canonical or intentional alternate | fetch or inventory |
| Titles | one clear query intent; unique among siblings | fetch + ownership map |
| Headings | single H1; logical H2 structure | fetch |
| Internal links | planned service/tip links with useful anchors | inventory + link graph |
| Schema | server HTML JSON-LD only as observed | fetch; Rich Results Test for rendered |
| Performance | LCP/CLS/INP or performance score | PageSpeed LIVE_VERIFIED only |
| Queries | impressions/clicks/position themes | Search Console LIVE_VERIFIED only |
| Local | Santa Cruz County hooks without fake cities | brand context + approved facts |
