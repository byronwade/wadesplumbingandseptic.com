const SAFE_CONTENT_PATH =
	/^content\/(?:pages|posts|services)\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;
const SAFE_ROUTE =
	/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SAFE_APPROVAL = /^[a-z0-9][a-z0-9._:-]{2,127}$/i;
const IMAGE_RIGHTS = new Set([
	"OWNED",
	"LICENSED",
	"PUBLIC_DOMAIN",
	"EXPLICIT_PERMISSION",
]);

function assertEvidenceIds(value, label) {
	if (!Array.isArray(value) || value.length === 0)
		throw new Error(`${label} requires at least one evidence ID.`);
	if (value.some((id) => typeof id !== "string" || !id.trim()))
		throw new Error(`${label} contains an invalid evidence ID.`);
	return Object.freeze([...new Set(value)]);
}

function assertExistingRoute(inventory, route, label) {
	if (!inventory?.pages?.some((page) => page.url === route))
		throw new Error(`${label} must resolve to an existing inventory route.`);
	return route;
}

function collectionForPath(path) {
	if (!SAFE_CONTENT_PATH.test(path ?? ""))
		throw new Error(
			"Editorial change path must be a safe Markdown content path.",
		);
	return path.split("/")[1];
}

export function validateImagePlan(imagePlan = null) {
	if (imagePlan === null || imagePlan === undefined) return null;
	if (typeof imagePlan !== "object")
		throw new Error("Image plan must be an object when provided.");
	if (
		!/^public\/[a-z0-9/_-]+\.(?:avif|webp|jpe?g|png|svg)$/i.test(
			imagePlan.asset_path ?? "",
		)
	)
		throw new Error("Image plan requires a safe local public asset path.");
	if (
		/\.svg$/i.test(imagePlan.asset_path ?? "") &&
		imagePlan.usage_rights === "EXPLICIT_PERMISSION" &&
		imagePlan.generation_style !== "technical_line_art" &&
		!String(imagePlan.rights_evidence_id ?? "").startsWith("ai-lineart:")
	) {
		throw new Error(
			"SVG image plans require technical line-art generation metadata or an AI line-art rights evidence id.",
		);
	}
	if (
		typeof imagePlan.source_url !== "string" ||
		!/^https:\/\//.test(imagePlan.source_url)
	)
		throw new Error("Image plan requires an HTTPS provenance URL.");
	if (!IMAGE_RIGHTS.has(imagePlan.usage_rights))
		throw new Error(
			"Image plan requires an approved usage-rights classification.",
		);
	if (!SAFE_APPROVAL.test(imagePlan.rights_evidence_id ?? ""))
		throw new Error("Image plan requires traceable rights evidence.");
	if (
		typeof imagePlan.alt_text !== "string" ||
		imagePlan.alt_text.trim().length < 8
	)
		throw new Error("Image plan requires descriptive alt text.");
	if (
		typeof imagePlan.relevance_rationale !== "string" ||
		imagePlan.relevance_rationale.trim().length < 16
	)
		throw new Error(
			"Image plan requires content-specific relevance rationale.",
		);
	if (
		imagePlan.local_claim === true &&
		!SAFE_APPROVAL.test(imagePlan.local_claim_evidence_id ?? "")
	)
		throw new Error("A local image claim requires first-party evidence.");
	return Object.freeze({ ...imagePlan, alt_text: imagePlan.alt_text.trim() });
}

function validateDemandTiming(timing, { holiday = false } = {}) {
	if (!timing || typeof timing !== "object" || timing.mode !== "DEMAND_TIMED")
		throw new Error("Editorial publication requires a demand-timed decision.");
	if ("cadence" in timing || "fixed_schedule" in timing)
		throw new Error(
			"Fixed publishing cadences are prohibited; timing must be evidence-led.",
		);
	const signalIds = assertEvidenceIds(timing.signal_ids, "Demand timing");
	if (holiday) {
		if (typeof timing.holiday_name !== "string" || !timing.holiday_name.trim())
			throw new Error("Holiday content requires its named upcoming holiday.");
		if (!/^\d{4}-\d{2}-\d{2}$/.test(timing.holiday_date ?? ""))
			throw new Error("Holiday content requires an ISO holiday date.");
		if (
			!Number.isInteger(timing.lead_time_days) ||
			timing.lead_time_days < 7 ||
			timing.lead_time_days > 120
		)
			throw new Error("Holiday content requires a 7–120 day useful lead time.");
		assertEvidenceIds(
			timing.local_relevance_evidence_ids,
			"Holiday local relevance",
		);
	}
	return Object.freeze({ ...timing, signal_ids: signalIds });
}

/**
 * Enforces the editorial scope selected by the owner: blog posts are the
 * normal source of net-new URLs; new landing pages need explicit approval;
 * services may be refreshed but can never be created by the agent.
 */
export function validateEditorialProposal(proposal, { inventory }) {
	if (!proposal || typeof proposal !== "object")
		throw new Error("Editorial proposal must be an object.");
	if (!["CREATE", "UPDATE"].includes(proposal.operation))
		throw new Error("Editorial proposal operation must be CREATE or UPDATE.");
	const collection = collectionForPath(proposal.content_path);
	if (!SAFE_ROUTE.test(proposal.owner_url ?? ""))
		throw new Error("Editorial proposal requires a safe canonical owner URL.");
	if (!proposal.existing_page_assessment)
		throw new Error("Editorial proposal requires an existing-page assessment.");
	assertEvidenceIds(proposal.evidence_ids, "Editorial proposal");
	if (
		!Array.isArray(proposal.internal_links) ||
		proposal.internal_links.length === 0
	)
		throw new Error(
			"Editorial proposal requires a contextual internal-link plan.",
		);
	for (const link of proposal.internal_links) {
		assertExistingRoute(inventory, link?.to, "Internal-link target");
		if (typeof link?.anchor !== "string" || link.anchor.trim().length < 3)
			throw new Error("Internal-link plan requires reader-facing anchor text.");
		if (
			typeof link?.reader_rationale !== "string" ||
			link.reader_rationale.trim().length < 12
		)
			throw new Error(
				"Internal-link plan requires a reader-benefit rationale.",
			);
	}

	const holiday = proposal.editorial_type === "HOLIDAY_BLOG";
	if (proposal.operation === "CREATE") {
		if (collection === "services")
			throw new Error("The agent must never create a service page.");
		if (collection === "pages") {
			if (proposal.editorial_type !== "LANDING_PAGE")
				throw new Error(
					"Only explicitly approved landing pages may be created outside posts.",
				);
			if (!SAFE_APPROVAL.test(proposal.landing_page_approval_id ?? ""))
				throw new Error("A new landing page requires an explicit approval ID.");
		} else if (collection !== "posts") {
			throw new Error(
				"Only posts or explicitly approved landing pages may create URLs.",
			);
		}
		if (proposal.existing_page_assessment !== "EXISTING_INSUFFICIENT")
			throw new Error(
				"A new URL requires an existing-page insufficiency decision.",
			);
		if (inventory.pages.some((page) => page.url === proposal.owner_url))
			throw new Error(
				"A new URL must not duplicate an existing inventory route.",
			);
		validateDemandTiming(proposal.publication_timing, { holiday });
	} else {
		assertExistingRoute(inventory, proposal.owner_url, "Editorial owner URL");
		if (collection === "pages" && proposal.editorial_type !== "LANDING_PAGE")
			throw new Error(
				"Generic page edits remain manual; only approved landing-page work is agent eligible.",
			);
		if (
			collection === "services" &&
			proposal.editorial_type !== "SERVICE_REFRESH"
		)
			throw new Error(
				"Service content is limited to an existing-page refresh.",
			);
		if (holiday)
			validateDemandTiming(proposal.publication_timing, { holiday: true });
	}

	return Object.freeze({
		...proposal,
		image_plan: validateImagePlan(proposal.image_plan),
	});
}
