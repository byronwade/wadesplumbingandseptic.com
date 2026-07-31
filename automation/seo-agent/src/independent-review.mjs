const REQUIRED_INTEGRATION_IDS = Object.freeze([
	"vercel-eve-ai-gateway",
	"vercel-sandbox",
	"github-connect",
	"vercel-read",
	"search-console",
	"pagespeed",
	"browser-research",
]);

function block(code, detail, classification = "COMPLETION_BLOCKER") {
	return Object.freeze({ code, detail, classification });
}

/**
 * Produces an independent, deterministic readiness decision. A non-ready
 * result is expected before human-owned infrastructure and public-site issues
 * are resolved; the script exits successfully when it reports them honestly.
 */
export function reviewReadiness({
	technicalSeo,
	integrationInventory,
	rootConfig,
}) {
	const completionBlockers = [];
	const externalPrerequisites = [];
	const highFindings = (technicalSeo?.findings ?? []).filter(
		(finding) => finding.severity === "high" || finding.severity === "critical",
	);
	for (const finding of highFindings) {
		completionBlockers.push(
			block(
				`TECHNICAL_${finding.code}`,
				`Technical audit reports ${finding.severity} finding at ${finding.source_path ?? finding.url ?? "unknown source"}.`,
			),
		);
	}
	if (/ignoreBuildErrors\s*:\s*true/.test(rootConfig ?? "")) {
		completionBlockers.push(
			block(
				"PUBLIC_TYPESCRIPT_BUILD_SUPPRESSED",
				"next.config.js suppresses TypeScript build errors.",
			),
		);
	}
	if (/ignoreDuringBuilds\s*:\s*true/.test(rootConfig ?? "")) {
		completionBlockers.push(
			block(
				"PUBLIC_ESLINT_BUILD_SUPPRESSED",
				"next.config.js suppresses ESLint build errors.",
			),
		);
	}
	const integrationById = new Map(
		(integrationInventory?.integrations ?? []).map((item) => [item.id, item]),
	);
	for (const id of REQUIRED_INTEGRATION_IDS) {
		const integration = integrationById.get(id);
		if (!integration || integration.state !== "LIVE_VERIFIED") {
			externalPrerequisites.push(
				block(
					`LIVE_INTEGRATION_${id.toUpperCase().replaceAll("-", "_")}`,
					`${id} is not LIVE_VERIFIED; follow its scoped setup record before claiming live operation.`,
					"EXTERNAL_PREREQUISITE",
				),
			);
		}
	}
	return Object.freeze({
		schema_version: "1.0",
		reviewer: "offline-independent-readiness-review",
		classification: "MOCK_VERIFIED",
		completion_ready:
			completionBlockers.length === 0 && externalPrerequisites.length === 0,
		completion_blockers: Object.freeze(completionBlockers),
		external_prerequisites: Object.freeze(externalPrerequisites),
		conclusion:
			completionBlockers.length || externalPrerequisites.length
				? "NOT_READY"
				: "READY_FOR_HUMAN_FINAL_ACCEPTANCE",
	});
}
