/**
 * Expert-tip category archives, including WordPress-era slug aliases that still
 * resolve to live posts. Shared by the route and the sitemap.
 */
export const postCategoryAliases: Record<string, string[]> = {
	// The first label names the archive, so it must differ from every other slug's.
	"santa-cruz-plumbing": ["Santa Cruz Plumbing", "Plumbing Maintenance"],
	"septic-issues-in-santa-cruz-county": [
		"Septic Guidance",
		"Septic Maintenance",
		"Santa Cruz Plumbing",
	],
	"diy-projects": ["DIY Projects"],
	"plumbing-maintenance": ["Plumbing Maintenance", "Plumbing Tips"],
	"plumbing-tips": ["Plumbing Tips"],
	"septic-maintenance": ["Septic Maintenance"],
}
