/**
 * Expert-tip category archives, including WordPress-era slug aliases that still
 * resolve to live posts. Shared by the route and the sitemap.
 */
export const postCategoryAliases: Record<string, string[]> = {
	// The first label names the archive, so it must differ from every other slug's.
	"septic-issues-in-santa-cruz-county": [
		"Septic Guidance",
		"Septic Maintenance",
		"Santa Cruz Plumbing",
	],
	"diy-projects": ["DIY Projects"],
	"plumbing-tips": ["Plumbing Tips", "Plumbing Maintenance"],
	"septic-maintenance": ["Septic Maintenance"],
}
