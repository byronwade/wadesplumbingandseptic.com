import { connectGithubTools } from "@github-tools/sdk/connect/eve";

const connector = "github/wadesplumbingandseptic-com";

// `repo-explorer` is intentionally read-only. Draft PR publication is handled
// by a separately human-approved adapter and is not exposed to the model here.
export default connectGithubTools(connector, {
	preset: "repo-explorer",
	connect: { repositories: ["byronwade/wadesplumbingandseptic.com"] },
});
