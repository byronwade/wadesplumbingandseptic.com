import type { MetadataRoute } from "next"

/**
 * Private or utility paths no crawler needs. `/_next/` stays crawlable: it
 * serves the CSS, JavaScript and fonts Google needs to render each page.
 */
export const crawlerDisallow = [
	"/api/",
	"/thank-you",
	"/contact-call-first",
	"/franchise",
]

/**
 * Search and AI assistant crawlers we explicitly welcome. A bot that matches
 * a named group ignores the `*` group, so each group repeats the same
 * disallow list.
 */
export const welcomedCrawlers = [
	"Googlebot",
	"Google-Extended",
	"Bingbot",
	"Applebot",
	"Applebot-Extended",
	"GPTBot",
	"OAI-SearchBot",
	"ChatGPT-User",
	"ClaudeBot",
	"Claude-SearchBot",
	"Claude-User",
	"PerplexityBot",
	"Perplexity-User",
	"DuckAssistBot",
]

export function robotsRules(): MetadataRoute.Robots["rules"] {
	return [
		{ userAgent: "*", allow: "/", disallow: [...crawlerDisallow] },
		{
			userAgent: [...welcomedCrawlers],
			allow: "/",
			disallow: [...crawlerDisallow],
		},
	]
}
