import { defineMcpClientConnection } from "eve/connections";
import { always } from "eve/tools/approval";

export default defineMcpClientConnection({
	url: "https://mcp.vercel.com",
	description:
		"Human-approved, read-only Vercel project and deployment metadata for preview and production audit correlation.",
	auth: {
		getToken: async () => ({
			token: process.env.VERCEL_MCP_ACCESS_TOKEN ?? "",
		}),
	},
	// This allowlist intentionally excludes deploy, domain, environment, access-link,
	// CLI, log, and general fetch tools. Raw logs require a future redacting adapter.
	tools: {
		allow: [
			"list_teams",
			"list_projects",
			"get_project",
			"list_deployments",
			"get_deployment",
		],
	},
	approval: always(),
});
