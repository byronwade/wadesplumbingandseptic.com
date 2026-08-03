import { assertTruthState, authorizeAction } from "./policy.mjs";
import { assertMarkdownChangeSet } from "./markdown-change-set.mjs";
import { IntegrationError, requestJson } from "./adapters.mjs";
import { createRunBudget } from "./run-controls.mjs";

const SAFE_DRAFT_BRANCH =
	/^eve\/seo\/\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SAFE_SHA = /^[a-f0-9]{7,64}$/i;
const GITHUB_API_VERSION = "2026-03-10";

const REQUIRED_PACKET_MARKERS = Object.freeze([
	"# SEO Draft PR Packet",
	"- Proposal:",
	"- Query cluster:",
	"- Canonical owner:",
	"- Existing page assessment:",
	"- Evidence:",
	"- Change manifest:",
	"- Migration boundary: FUTURE_MARKDOWN_MIGRATION; human-approved migration required.",
	"- Rollback:",
	"- Publication: DRAFT PR ONLY; human approval and merge required.",
]);

export function assertDraftPrPacket({ title, body, changeSet }) {
	if (typeof title !== "string" || !title.trim() || title.length > 120)
		throw new Error(
			"Draft PR title must be a non-empty string of at most 120 characters",
		);
	if (typeof body !== "string")
		throw new Error("Draft PR body must be a string");
	assertMarkdownChangeSet(changeSet);
	for (const marker of REQUIRED_PACKET_MARKERS) {
		if (!body.includes(marker))
			throw new Error(`Draft PR packet missing required marker: ${marker}`);
	}
	if (!body.includes(`- Change manifest: ${changeSet.proposal_id}`))
		throw new Error("Draft PR packet does not reference its change manifest");
	return true;
}

function parseRepository(repository) {
	if (
		typeof repository !== "string" ||
		!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)
	) {
		throw new Error("GitHub publisher requires an owner/repository name.");
	}
	return repository.split("/");
}

function assertDraftBranch(branch) {
	if (typeof branch !== "string" || !SAFE_DRAFT_BRANCH.test(branch)) {
		throw new Error(
			"GitHub publisher permits only eve/seo/YYYY-MM-DD-<slug> feature branches.",
		);
	}
	return branch;
}

function blockedPublisher(reason) {
	return Object.freeze({
		classification: "BLOCKED_MISSING_CREDENTIALS",
		reason,
		write_performed: false,
	});
}

function branchPath(branch) {
	return branch
		.split("/")
		.map((segment) => encodeURIComponent(segment))
		.join("/");
}

function assertDraftPullRequestShape(pullRequest, branch, classification) {
	if (
		pullRequest?.draft !== true ||
		!Number.isInteger(pullRequest?.number) ||
		pullRequest.number < 1 ||
		typeof pullRequest?.html_url !== "string" ||
		!pullRequest.html_url.startsWith("https://") ||
		pullRequest?.base?.ref !== "main" ||
		pullRequest?.head?.ref !== branch
	) {
		throw new Error("GitHub did not return the requested draft pull request.");
	}
	return Object.freeze({
		classification,
		draft: true,
		number: pullRequest.number,
		url: pullRequest.html_url,
	});
}

/**
 * Creates the only real GitHub write boundary. It uses a short-lived token
 * supplied by Vercel Connect. Callers that construct a publisher intend to open
 * one draft PR. It deliberately has no merge, deletion, default-branch update,
 * force-push, repository-settings, or secret operation.
 */
export function createGithubDraftPublisher({
	repository,
	accessTokenProvider,
	fetchImpl = fetch,
	budget = createRunBudget(),
	requestPolicy,
	classification = "LIVE_VERIFIED",
	enabled = true,
	mutationMode = "enabled",
	mutationKillSwitch = false,
} = {}) {
	const [owner, repo] = parseRepository(repository);
	if (typeof accessTokenProvider !== "function") {
		throw new Error(
			"GitHub publisher requires a Vercel Connect token provider.",
		);
	}
	assertTruthState(classification);
	const base = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;

	const guard = () => {
		// Keep an explicit off-switch for fixtures that construct a disabled
		// publisher. Live proposal callers always enable the draft path.
		if (enabled === false)
			return blockedPublisher(
				"GitHub draft publishing was explicitly disabled by the caller.",
			);
		void mutationMode;
		void mutationKillSwitch;
		return null;
	};

	const request = async (url, init, source) => {
		const token = await accessTokenProvider();
		if (typeof token !== "string" || token.length === 0) {
			throw new Error(
				"GitHub publisher did not receive a Vercel Connect token.",
			);
		}
		return requestJson({
			fetchImpl,
			budget,
			url,
			init: {
				...init,
				headers: {
					accept: "application/vnd.github+json",
					authorization: `Bearer ${token}`,
					"content-type": "application/json",
					"x-github-api-version": GITHUB_API_VERSION,
					...init?.headers,
				},
			},
			source,
			policy: requestPolicy,
		});
	};

	return Object.freeze({
		async readMainCommit() {
			const denial = guard();
			if (denial) return denial;
			const main = await request(
				`${base}/git/ref/heads/main`,
				{ method: "GET" },
				"GitHub main branch read",
			);
			if (!SAFE_SHA.test(main?.object?.sha ?? "")) {
				throw new Error("GitHub main branch did not resolve to a commit SHA.");
			}
			return Object.freeze({
				classification,
				branch: "main",
				sha: main.object.sha,
				write_performed: false,
			});
		},

		async createBranch({ branch, fromSha }) {
			const denial = guard();
			if (denial) return denial;
			assertDraftBranch(branch);
			if (!SAFE_SHA.test(fromSha ?? "")) {
				throw new Error("GitHub draft branch requires a main commit SHA.");
			}
			const main = await request(
				`${base}/git/ref/heads/main`,
				{ method: "GET" },
				"GitHub main branch read",
			);
			if (main?.object?.sha !== fromSha) {
				throw new Error(
					"GitHub main changed before the draft branch could be created.",
				);
			}
			try {
				const created = await request(
					`${base}/git/refs`,
					{
						method: "POST",
						body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: fromSha }),
					},
					"GitHub draft feature branch create",
				);
				if (created?.object?.sha !== fromSha) {
					throw new Error("GitHub did not create the requested draft branch.");
				}
				return Object.freeze({
					classification,
					branch,
					base_sha: fromSha,
					write_performed: true,
				});
			} catch (error) {
				// Same-day Cron retries collide on eve/seo/YYYY-MM-DD-<slug>.
				// Reuse the existing feature branch; staging commits on top.
				if (!(error instanceof IntegrationError) || error.status !== 422) {
					throw error;
				}
				const existing = await request(
					`${base}/git/ref/heads/${branchPath(branch)}`,
					{ method: "GET" },
					"GitHub existing draft branch read",
				);
				if (!SAFE_SHA.test(existing?.object?.sha ?? "")) {
					throw new Error(
						"GitHub reported the draft branch exists but returned no commit SHA.",
					);
				}
				return Object.freeze({
					classification,
					branch,
					base_sha: existing.object.sha,
					write_performed: false,
					reused_existing_branch: true,
				});
			}
		},

		async stageMarkdownChangeSet({ branch, changeSet }) {
			const denial = guard();
			if (denial) return denial;
			assertDraftBranch(branch);
			assertMarkdownChangeSet(changeSet);
			const ref = await request(
				`${base}/git/ref/heads/${branchPath(branch)}`,
				{ method: "GET" },
				"GitHub draft branch read",
			);
			const parentSha = ref?.object?.sha;
			if (!SAFE_SHA.test(parentSha ?? "")) {
				throw new Error("GitHub draft branch did not resolve to a commit SHA.");
			}
			const parent = await request(
				`${base}/git/commits/${encodeURIComponent(parentSha)}`,
				{ method: "GET" },
				"GitHub draft parent commit read",
			);
			if (!SAFE_SHA.test(parent?.tree?.sha ?? "")) {
				throw new Error(
					"GitHub draft parent commit did not contain a tree SHA.",
				);
			}
			const treeEntries = [];
			for (const file of changeSet.files) {
				if (file.encoding === "base64" && file.content_base64) {
					const blob = await request(
						`${base}/git/blobs`,
						{
							method: "POST",
							body: JSON.stringify({
								content: file.content_base64,
								encoding: "base64",
							}),
						},
						"GitHub draft binary blob create",
					);
					if (!SAFE_SHA.test(blob?.sha ?? "")) {
						throw new Error(
							"GitHub draft binary blob create did not return a SHA.",
						);
					}
					treeEntries.push({
						path: file.path,
						mode: "100644",
						type: "blob",
						sha: blob.sha,
					});
					continue;
				}
				treeEntries.push({
					path: file.path,
					mode: "100644",
					type: "blob",
					content: file.content,
				});
			}
			const tree = await request(
				`${base}/git/trees`,
				{
					method: "POST",
					body: JSON.stringify({
						base_tree: parent.tree.sha,
						tree: treeEntries,
					}),
				},
				"GitHub draft tree create",
			);
			if (!SAFE_SHA.test(tree?.sha ?? "")) {
				throw new Error("GitHub draft tree create did not return a SHA.");
			}
			const commit = await request(
				`${base}/git/commits`,
				{
					method: "POST",
					body: JSON.stringify({
						message: `chore(seo): ${changeSet.proposal_id} [eve-seo-agent; human-approved]`,
						tree: tree.sha,
						parents: [parentSha],
					}),
				},
				"GitHub draft commit create",
			);
			if (!SAFE_SHA.test(commit?.sha ?? "")) {
				throw new Error("GitHub draft commit create did not return a SHA.");
			}
			const updated = await request(
				`${base}/git/refs/heads/${branchPath(branch)}`,
				{
					method: "PATCH",
					body: JSON.stringify({ sha: commit.sha, force: false }),
				},
				"GitHub draft feature branch update",
			);
			if (updated?.object?.sha !== commit.sha) {
				throw new Error("GitHub draft feature branch was not updated safely.");
			}
			return Object.freeze({
				classification,
				branch,
				commit_sha: commit.sha,
				write_performed: true,
			});
		},

		async createPullRequest({ branch, title, body, draft }) {
			const denial = guard();
			if (denial) return denial;
			assertDraftBranch(branch);
			authorizeAction("create_draft_pull_request", {
				humanApproval: true,
				draft,
				branch,
			});
			if (typeof title !== "string" || !title.trim() || title.length > 120) {
				throw new Error("GitHub draft pull request title is invalid.");
			}
			if (typeof body !== "string" || !body.trim()) {
				throw new Error("GitHub draft pull request body is required.");
			}
			try {
				const pullRequest = await request(
					`${base}/pulls`,
					{
						method: "POST",
						body: JSON.stringify({
							title,
							body,
							head: branch,
							base: "main",
							draft: true,
						}),
					},
					"GitHub draft pull request create",
				);
				return assertDraftPullRequestShape(pullRequest, branch, classification);
			} catch (error) {
				if (!(error instanceof IntegrationError) || error.status !== 422) {
					throw error;
				}
				const head = `${owner}:${branch}`;
				const existing = await request(
					`${base}/pulls?state=open&head=${encodeURIComponent(head)}&base=main&per_page=5`,
					{ method: "GET" },
					"GitHub existing draft pull request lookup",
				);
				const match = Array.isArray(existing)
					? existing.find(
							(item) =>
								item?.draft === true &&
								item?.head?.ref === branch &&
								item?.base?.ref === "main",
						)
					: null;
				if (!match) throw error;
				return assertDraftPullRequestShape(match, branch, classification);
			}
		},
	});
}

export async function createDraftPullRequest({
	humanApproval,
	branch,
	title,
	body,
	changeSet,
	gateway,
}) {
	authorizeAction("create_draft_pull_request", {
		humanApproval,
		draft: true,
		branch,
	});
	assertDraftPrPacket({ title, body, changeSet });
	if (!gateway) {
		return {
			classification: "BLOCKED_MISSING_CREDENTIALS",
			reason: "No human-approved GitHub draft-PR gateway is configured.",
			draft_pr_created: false,
		};
	}
	if (typeof gateway.stageMarkdownChangeSet !== "function") {
		return {
			classification: "BLOCKED_MISSING_CREDENTIALS",
			reason:
				"GitHub gateway cannot stage the approved Markdown change set on a feature branch.",
			draft_pr_created: false,
		};
	}
	const staged = await gateway.stageMarkdownChangeSet({ branch, changeSet });
	const stagingClassification =
		staged?.classification ?? gateway.classification;
	if (!stagingClassification)
		throw new Error(
			"Publication adapter must provide an explicit truth classification",
		);
	assertTruthState(stagingClassification);
	if (stagingClassification === "BLOCKED_MISSING_CREDENTIALS") {
		return {
			classification: stagingClassification,
			reason: staged?.reason ?? "Markdown branch staging is blocked.",
			draft_pr_created: false,
		};
	}
	if (
		staged?.branch !== branch ||
		!/^[a-f0-9]{7,64}$/.test(staged?.commit_sha ?? "") ||
		staged?.write_performed !== true
	) {
		throw new Error(
			"Publication adapter returned invalid staged feature-branch metadata",
		);
	}
	const result = await gateway.createPullRequest({
		branch,
		title,
		body,
		draft: true,
	});
	if (!result?.draft)
		throw new Error(
			"Publication adapter violated policy: expected a draft pull request",
		);
	if (
		!Number.isInteger(result.number) ||
		result.number < 1 ||
		typeof result.url !== "string" ||
		!result.url.startsWith("https://")
	) {
		throw new Error(
			"Publication adapter returned invalid draft pull request metadata",
		);
	}
	const classification = result.classification ?? gateway.classification;
	if (!classification)
		throw new Error(
			"Publication adapter must provide an explicit truth classification",
		);
	assertTruthState(classification);
	return Object.freeze({
		classification,
		draft_pr_created: true,
		url: result.url,
		number: result.number,
		branch: staged.branch,
		commit_sha: staged.commit_sha,
	});
}
