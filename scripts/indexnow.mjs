#!/usr/bin/env node
/**
 * Tell IndexNow search engines (Bing, Yandex, Seznam, Naver and others that
 * share the protocol) which pages changed, so they recrawl them right away.
 * Bing's index also feeds Copilot and ChatGPT search.
 *
 *   node scripts/indexnow.mjs --all                 every URL in the live sitemap
 *   node scripts/indexnow.mjs --changed BASE HEAD   pages whose content changed
 *   node scripts/indexnow.mjs --since-last-deploy   pages changed since the
 *     previous successful production deploy (needs GITHUB_REPOSITORY,
 *     GITHUB_TOKEN and DEPLOYMENT_ID; falls back to the sitemap)
 *   add --dry-run to print the URLs without submitting them
 *
 * The key is public by design: search engines confirm it by fetching
 * https://www.wadesplumbingandseptic.com/<key>.txt from public/.
 */
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const SITE = "https://www.wadesplumbingandseptic.com"
const ENDPOINT = "https://api.indexnow.org/indexnow"
const MAX_URLS = 10_000

export function findKey(publicDir = "public") {
	const keys = fs
		.readdirSync(publicDir)
		.filter((name) => /^[a-f0-9]{32}\.txt$/.test(name))
		.filter(
			(name) =>
				fs.readFileSync(path.join(publicDir, name), "utf8").trim() ===
				name.slice(0, -4),
		)
	if (keys.length !== 1) {
		throw new Error(
			`expected one IndexNow key file in ${publicDir}, found ${keys.length}`,
		)
	}
	return keys[0].slice(0, -4)
}

/** Public URL for a content file, or null for files that are not pages. */
export function urlForContentFile(file) {
	const match = file.match(/^content\/(pages|posts|services)\/(.+)\.md$/)
	if (!match) return null
	const [, collection, slug] = match
	if (slug.endsWith("AGENTS")) return null
	return collection === "services"
		? `${SITE}/service-offerings/${slug}`
		: `${SITE}/${slug}`
}

export function changedUrls(base, head) {
	const output = execFileSync(
		"git",
		["diff", "--name-only", "--no-renames", base, head, "--", "content"],
		{ encoding: "utf8" },
	)
	return [
		...new Set(
			output
				.split("\n")
				.map((file) => urlForContentFile(file.trim()))
				.filter(Boolean),
		),
	]
}

/**
 * Commit of the last production deploy that succeeded before this one. A
 * deploy can ship several commits when Vercel skips the builds between them,
 * so diffing against HEAD~1 alone would miss pages. Null when there is none.
 */
export async function previousDeploySha({
	repo,
	token,
	currentId,
	environment = "Production",
	fetchImpl = fetch,
}) {
	const get = async (route) => {
		const response = await fetchImpl(
			`https://api.github.com/repos/${repo}${route}`,
			{
				headers: {
					Accept: "application/vnd.github+json",
					Authorization: `Bearer ${token}`,
				},
			},
		)
		if (!response.ok) {
			throw new Error(`GitHub ${route} returned ${response.status}`)
		}
		return response.json()
	}

	// Newest first, so the deploys after this one in the list are older.
	const deployments = await get(
		`/deployments?environment=${encodeURIComponent(environment)}&per_page=30`,
	)
	const index = deployments.findIndex(
		(deployment) => String(deployment.id) === String(currentId),
	)
	if (index === -1) return null
	for (const deployment of deployments.slice(index + 1, index + 11)) {
		const statuses = await get(
			`/deployments/${deployment.id}/statuses?per_page=100`,
		)
		if (statuses.some((status) => status.state === "success")) {
			return deployment.sha
		}
	}
	return null
}

function isCommit(sha) {
	try {
		execFileSync("git", ["cat-file", "-e", `${sha}^{commit}`], {
			stdio: "ignore",
		})
		return true
	} catch {
		return false
	}
}

async function sitemapUrls() {
	const response = await fetch(`${SITE}/sitemap.xml`)
	if (!response.ok) throw new Error(`sitemap returned ${response.status}`)
	const xml = await response.text()
	return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
}

async function submit(urls, key) {
	const response = await fetch(ENDPOINT, {
		method: "POST",
		headers: { "Content-Type": "application/json; charset=utf-8" },
		body: JSON.stringify({
			host: new URL(SITE).host,
			key,
			keyLocation: `${SITE}/${key}.txt`,
			urlList: urls,
		}),
	})
	// 200 and 202 both mean accepted; anything else is worth failing on.
	if (response.status !== 200 && response.status !== 202) {
		throw new Error(
			`IndexNow returned ${response.status}: ${await response.text()}`,
		)
	}
	return response.status
}

async function main(argv) {
	const dryRun = argv.includes("--dry-run")
	const args = argv.filter((arg) => arg !== "--dry-run")
	let urls
	if (args[0] === "--all") {
		urls = await sitemapUrls()
	} else if (args[0] === "--changed" && args[1] && args[2]) {
		urls = changedUrls(args[1], args[2])
	} else if (args[0] === "--since-last-deploy") {
		const base = await previousDeploySha({
			repo: process.env.GITHUB_REPOSITORY,
			token: process.env.GITHUB_TOKEN,
			currentId: process.env.DEPLOYMENT_ID,
		})
		if (base && isCommit(base)) {
			console.log(`Comparing with the last production deploy, ${base}.`)
			urls = changedUrls(base, "HEAD")
		} else {
			console.log("No earlier production deploy to compare; using sitemap.")
			urls = await sitemapUrls()
		}
	} else {
		console.error(
			"usage: indexnow.mjs (--all | --changed BASE HEAD | --since-last-deploy) [--dry-run]",
		)
		process.exit(2)
	}

	urls = urls.slice(0, MAX_URLS)
	if (urls.length === 0) {
		console.log("No page URLs changed; nothing to submit.")
		return
	}
	console.log(urls.join("\n"))
	if (dryRun) {
		console.log(`Dry run: ${urls.length} URLs not submitted.`)
		return
	}
	const status = await submit(urls, findKey())
	console.log(`IndexNow accepted ${urls.length} URLs (HTTP ${status}).`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
	main(process.argv.slice(2)).catch((error) => {
		console.error(error.message)
		process.exit(1)
	})
}
