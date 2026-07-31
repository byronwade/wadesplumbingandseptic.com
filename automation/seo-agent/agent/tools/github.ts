import { connectGithubTools } from "@github-tools/sdk/connect/eve";

// `repo-explorer` is intentionally read-only. Draft PR publication is handled
// by a separately human-approved adapter and is not exposed to the model here.
export default connectGithubTools("github/wades-eve-seo-agent", {
	preset: "repo-explorer",
	connect: { repositories: ["byronwade/wadesplumbingandseptic.com"] },
});
