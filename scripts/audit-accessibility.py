"""Audit built public HTML routes in a local production preview.

Requires Python Playwright, a local Chrome executable, and a downloaded axe-core
script. See docs/accessibility-audit.md for setup, scope, and limitations.
"""

import argparse
import hashlib
import json
import time
from urllib.parse import urlparse
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--root', type=Path, required=True)
parser.add_argument('--output', type=Path, required=True)
parser.add_argument('--base-url', default='http://127.0.0.1:40039')
parser.add_argument('--axe', type=Path, required=True)
parser.add_argument('--chrome', type=Path, required=True)
parser.add_argument('--limit', type=int)
parser.add_argument('--max-seconds', type=int, default=3600)
args = parser.parse_args()
if args.max_seconds < 1:
    parser.error('--max-seconds must be positive')
parsed_url = urlparse(args.base_url)
if parsed_url.hostname not in ('127.0.0.1', 'localhost', '::1') or parsed_url.scheme != 'http':
    parser.error('--base-url must be an HTTP loopback origin')
if parsed_url.path or parsed_url.query or parsed_url.fragment or parsed_url.username is not None:
    parser.error('--base-url must contain only an origin')
manifest_path = args.root / '.next/prerender-manifest.json'
manifest_bytes = manifest_path.read_bytes()
manifest = json.loads(manifest_bytes)
routes = sorted(route for route in manifest['routes']
    if not route.startswith('/_') and (args.root / '.next/server/app' /
        ('index.html' if route == '/' else route[1:] + '.html')).is_file())
if not routes:
    parser.error('No public HTML routes found; run npm run build first')
public_html_count = len(routes)
# Exercise the public 404, rather than Next's unstyled internal /_not-found URL.
missing_route = '/accessibility-audit-missing-page'
if missing_route in routes:
    parser.error('The audit 404 fixture unexpectedly exists')
routes.append(missing_route)
if args.limit is not None:
    if args.limit < 1:
        parser.error('--limit must be positive')
    routes = routes[:args.limit]
axe = args.axe.read_text(encoding='utf8')
rows = []
versions = {}
budget_exhausted = False
started = time.time()
args.output.parent.mkdir(parents=True, exist_ok=True)

def save():
    summary = dict(routes=len(routes), states=len(rows),
                   public_html_routes=public_html_count, limited=args.limit is not None,
                   complete=len(rows)==2*len(routes),
                   budget_exhausted=budget_exhausted,
                   violations=sum(len(r.get('violations', [])) for r in rows),
                   incomplete=sum(r.get('incomplete_count', 0) for r in rows),
                   incomplete_nodes=sum(i['count'] for r in rows for i in r.get('incomplete', [])),
                   errors=sum(bool(r.get('error') or r.get('page_errors') or r.get('status_error') or r.get('theme_error')) for r in rows),
                   overflow=sum(r.get('overflow', 0) > 0 for r in rows),
                   elapsed_seconds=round(time.time()-started, 2))
    args.output.write_text(json.dumps(dict(summary=summary, versions=versions,
        axe_sha256=hashlib.sha256(axe.encode()).hexdigest(),
        manifest_sha256=hashlib.sha256(manifest_bytes).hexdigest(),
        viewport={'width':1280,'height':900}, themes=['light','dark'],
        rule_tags=['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'],
        rows=rows), indent=2), encoding='utf8')
    return summary

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=str(args.chrome),
                                headless=True, timeout=30000)
    versions['browser'] = browser.version
    try:
        for theme in ('light', 'dark'):
            context = browser.new_context(viewport={'width':1280,'height':900},
                                          color_scheme=theme, reduced_motion='reduce')
            # Do not contact analytics or external services during local verification.
            def handle_request(route):
                url = route.request.url
                if url.startswith(args.base_url + '/api/page-view'):
                    route.fulfill(status=204)
                elif url.startswith(args.base_url + '/'):
                    route.continue_()
                else:
                    route.abort()
            context.route('**/*', handle_request)
            context.add_init_script(f"localStorage.setItem('theme','{theme}')")
            for route in routes:
                if time.time() - started >= args.max_seconds:
                    budget_exhausted = True
                    break
                page = context.new_page()
                page.set_default_timeout(15000)
                errors = []
                page.on('pageerror', lambda error: errors.append(str(error)))
                row = dict(route=route, theme=theme, width=1280)
                try:
                    response = page.goto(args.base_url + route, wait_until='networkidle', timeout=30000)
                    page.evaluate('''() => Promise.race([document.fonts.ready,
                      new Promise((_, reject) => setTimeout(() => reject(Error('font timeout')), 10000))])''')
                    page.evaluate('''() => Promise.race([(async () => {
                      for (let y=0; y<document.body.scrollHeight; y+=750) {
                        window.scrollTo(0,y); await new Promise(r=>setTimeout(r,16));
                      }
                      window.scrollTo(0,0);
                    })(), new Promise((_, reject) => setTimeout(() => reject(Error('scroll timeout')), 15000))])''')
                    page.wait_for_timeout(100)
                    row.update(page.evaluate('''() => ({
                      overflow:document.scrollingElement.scrollWidth-innerWidth,
                      actualTheme:document.documentElement.className,
                      title:document.title, finalPath:location.pathname
                    })'''))
                    row['status'] = response.status
                    if route == missing_route:
                        # Next's streamed not-found responses can use HTTP 200.
                        # Verify the actual error UI and noindex, not status alone.
                        row['missing_page'] = page.evaluate('''() => ({
                          heading:document.querySelector('main h1')?.textContent.trim(),
                          robots:[...document.querySelectorAll('meta[name="robots"]')].map(e=>e.content)
                        })''')
                        missing = row['missing_page']
                        has_noindex = any('noindex' in value.lower().replace(',', ' ').split()
                                          for value in missing['robots'])
                        row['status_error'] = (response.status not in (200, 404) or not has_noindex
                            or missing['heading'] != 'This page could not be found.')
                    else:
                        row['status_error'] = response.status != 200
                    row['theme_error'] = theme not in row['actualTheme'].split()
                    page.add_script_tag(content=axe)
                    row.update(page.evaluate('''async () => {
                      const result = await Promise.race([axe.run(document, {
                        runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}
                      }), new Promise((_,reject)=>setTimeout(()=>reject(Error('axe timeout')),15000))]);
                      return { axe_version:axe.version, violations:result.violations.map(v=>({id:v.id,impact:v.impact,
                        description:v.description,helpUrl:v.helpUrl,nodes:v.nodes.map(n=>({
                          target:n.target,html:n.html,summary:n.failureSummary,any:n.any
                        }))})), incomplete_count:result.incomplete.length,
                        incomplete:result.incomplete.map(v=>({id:v.id,count:v.nodes.length,
                          examples:v.nodes.slice(0,3).map(n=>({target:n.target,summary:n.failureSummary}))})),
                        passes_count:result.passes.length };
                    }'''))
                    versions['axe'] = row.pop('axe_version')
                except Exception as error:
                    row['error'] = str(error)
                finally:
                    row['page_errors'] = errors
                    rows.append(row)
                    page.close()
                if len(rows) % 25 == 0:
                    print(json.dumps(save()), flush=True)
            context.close()
            if budget_exhausted:
                break
    finally:
        browser.close()
summary = save()
print(json.dumps(summary), flush=True)
raise SystemExit(1 if not summary['complete'] or summary['violations'] or summary['errors'] or summary['overflow'] else 0)
