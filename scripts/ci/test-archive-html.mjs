import assert from "node:assert/strict"

// Run against a local production build: npm run build, npm start -- --port 38729,
// then npm run ci:archive-html -- http://127.0.0.1:38729.
const base = new URL(process.argv[2] ?? "http://127.0.0.1:38729")
assert.ok(
	["localhost", "127.0.0.1", "[::1]"].includes(base.hostname),
	"Archive HTML checks must use a local preview",
)

async function request(path, userAgent) {
	const response = await fetch(new URL(path, base), {
		headers: { "User-Agent": userAgent },
		redirect: "manual",
		signal: AbortSignal.timeout(15_000),
	})
	return { status: response.status, html: await response.text() }
}

const sitemap = await request("/sitemap.xml", "Mozilla/5.0")
assert.equal(sitemap.status, 200, "Sitemap must load")
const routes = [...sitemap.html.matchAll(/<loc>([^<]+)<\/loc>/g)]
	.map((match) => new URL(match[1]).pathname)
	.filter((path) =>
		/^\/(?:services|expert-tips|category\/[^/]+|service-category\/[^/]+)$/.test(
			path,
		),
	)
assert.ok(routes.length >= 4, "Sitemap must include all archive route families")

const cases = [
	...new Set(routes),
	"/services/popular",
	"/services/trending",
	"/expert-tips/popular",
	"/expert-tips/trending",
	"/expert-tips/popular?page=2",
	"/expert-tips/trending?category=plumbing-tips",
	"/services?page=2",
	"/services?category=septic",
	"/expert-tips?sort=newest",
]
const agents = ["Mozilla/5.0", "GPTBot", "Googlebot", "Twitterbot"]
const failures = []
let passed = 0

for (const path of cases) {
	for (const agent of agents) {
		try {
			const { status, html } = await request(path, agent)
			assert.equal(status, 200, "HTTP status")
			// Inspect markup only; strings inside script payloads are not HTML tags.
			const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
			for (const tag of ["html", "body"]) {
				assert.equal(
					[...markup.matchAll(new RegExp(`</${tag}\\s*>`, "gi"))].length,
					1,
					`Exactly one closing ${tag} tag`,
				)
			}
			assert.match(markup, /id="archive-filters"/, "Server-rendered controls")
			assert.match(markup, /class="[^"]*\bcard-rail\b/, "Server-rendered cards")
			assert.match(html, /self\.__next_f/, "Hydration payload must be present")
			passed++
		} catch (error) {
			failures.push({ path, agent, error: error.message })
		}
	}
}

console.log(
	JSON.stringify(
		{ routes: cases.length, passed, failed: failures.length, failures },
		null,
		2,
	),
)
if (failures.length) process.exitCode = 1
