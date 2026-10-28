# Local accessibility audit

`scripts/audit-accessibility.py` checks the built site's public HTML routes at
1280 by 900 pixels in light and dark themes. It uses Python Playwright and an
explicit local Chrome executable. It does not install packages or launch a server.

The route inventory comes from `.next/prerender-manifest.json`, restricted to
entries with built HTML. Internal Next.js route templates and internal error URLs
are excluded. A deliberately missing public URL exercises the visitor-facing 404.
Redirect sources are checked through their real destination, with both requested
and final paths recorded.

## Run

Run `npm ci` and `npm run build`, then start a production preview on an available
port. Use an existing Python environment with Playwright installed. Download a
pinned axe-core script to a local evidence folder, outside the repository:

```powershell
Invoke-WebRequest 'https://cdn.jsdelivr.net/npm/axe-core@4.14.0/axe.min.js' -OutFile "$evidenceDir/axe.min.js" -TimeoutSec 30
node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 40039
```

In another shell, using the same evidence folder:

```powershell
python scripts/audit-accessibility.py --root . --base-url http://127.0.0.1:40039 --chrome 'C:/Program Files/Google/Chrome/Application/chrome.exe' --axe "$evidenceDir/axe.min.js" --output "$evidenceDir/audit-results.json"
```

Stop the preview after the run. Keep output paths separate from any command
runner's own receipt path. `--limit 3` selects a small diagnostic sample; its report
is explicitly marked limited and cannot establish sitewide coverage.

## Evidence and limits

The report records the browser and axe versions, script and route-manifest hashes,
requested and final paths, HTTP status, applied theme, horizontal overflow,
browser errors, violations, and incomplete checks. It checkpoints every 25 states.
Exit code 1 means a violation, error, wrong HTTP status, wrong theme, or overflow.
A completed full run has `complete: true` and `limited: false`.

Navigation, selectors, font loading, scrolling, and the axe call have bounded timeouts. The
browser is headless and closes on exit. Network access is restricted to the local
preview, and page-view requests are intercepted to avoid changing visit records.
The default overall budget is 3,600 seconds, checked between pages; use
`--max-seconds` to override it. Budget exhaustion records an incomplete report and
returns exit code 1.

The axe tags are `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, and `wcag22aa`.
Incomplete results remain explicit, with example selectors and reasons. In
particular, gradients, images, and pseudo elements can prevent automatic contrast
assessment. A zero-violation run is not a claim of complete WCAG conformance.
Keyboard operation, focus order, open navigation menus, search, and visual states
also require focused checks. The sitewide sweep covers the default page state.

Use a recent pinned engine when repeating this audit. The older 4.10.3 sample
missed category-chip link-name mismatches that 4.14.0 reported. Upstream documents
the [label-content-name-mismatch rule](https://dequeuniversity.com/rules/axe/4.14/label-content-name-mismatch)
and [engine changes](https://github.com/dequelabs/axe-core/releases).
