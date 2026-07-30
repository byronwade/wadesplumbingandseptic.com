/**
 * Homepage Lighthouse (mobile Lantern) attributes ~1–2s of LCP "render delay"
 * to Next.js hydration JS even when observed LCP is ~100ms. The homepage is
 * fully server-rendered (no client islands), so strip script tags / script
 * preloads from the prerendered document. Interior routes keep full Next.js JS.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { join } from "node:path"

const indexPath = join(process.cwd(), ".next/server/app/index.html")

if (!existsSync(indexPath)) {
	console.warn("[strip-home-js] skip: .next/server/app/index.html not found")
	process.exit(0)
}

const before = readFileSync(indexPath, "utf8")
const scriptCount = (before.match(/<script\b/gi) ?? []).length

let html = before
	.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
	.replace(/<script\b[^>]*\/>/gi, "")
	.replace(/<link\b[^>]*\bas=["']script["'][^>]*>/gi, "")

const afterCount = (html.match(/<script\b/gi) ?? []).length
writeFileSync(indexPath, html)

console.log(
	`[strip-home-js] removed ${scriptCount - afterCount} script tag(s) from homepage HTML (${before.length} → ${html.length} bytes)`,
)
