/**
 * Inventory-aware blog opportunity selection and draft quality gates for the
 * Cron → Connect draft-PR path.
 *
 * Bar: people-first helpful content that can compete in Google Search. Drafts
 * must be substantial, locally specific, unique versus existing posts, and
 * written so a real homeowner would click and finish the page. Thin, generic,
 * or claim-heavy copy is rejected before any Connect write.
 */

const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MIN_BODY_WORDS = 1_400;
const MAX_BODY_WORDS = 2_200;
const MIN_H2 = 7;
const MIN_INTERNAL_LINKS = 4;
const MIN_FAQ_QUESTIONS = 5;
const MIN_DESCRIPTION = 70;
const MAX_DESCRIPTION = 155;

const GENERIC_FILLER =
	/\b(?:in today'?s world|it is important to note|in conclusion,?|needless to say|when it comes to plumbing in general)\b/i;

/**
 * Curated CREATE candidates. Stable slugs (no date suffix). Each topic must
 * carry a distinct unmet intent, a click reason, and unique local value.
 */
export const BLOG_TOPIC_CATALOG = Object.freeze([
	topic({
		id: "tankless-water-heater-maintenance-santa-cruz",
		slug: "tankless-water-heater-maintenance-santa-cruz",
		query_cluster: "tankless water heater maintenance Santa Cruz",
		click_title:
			"Tankless Water Heater Maintenance for Santa Cruz County Homes",
		meta_hook:
			"Coastal air and hard water wear on tankless units. Learn safe upkeep, warning signs, and when to call a pro in Santa Cruz County.",
		search_intent: "informational_to_service",
		unique_value:
			"Tie tankless care to coastal moisture and mineral scale common in Santa Cruz County homes, not a generic national checklist.",
		angle:
			"Explain mineral scale, coastal moisture, and vacation-home idle periods that affect tankless performance locally. Give safe homeowner checks and a clear stop-and-call-a-pro line.",
		must_cover: Object.freeze([
			"how hard water and coastal air stress tankless heat exchangers",
			"month-to-month owner checks versus pro descaling",
			"error codes, cold-water sandwich, and weak flow as decision points",
			"vacation homes and seasonal vacancy habits",
		]),
		people_also_ask: Object.freeze([
			"How often should a tankless water heater be serviced in Santa Cruz County?",
			"Can hard water damage a tankless unit?",
			"What symptoms mean I should stop DIY checks?",
			"Is tankless maintenance different from a tank heater?",
			"What should I do before a long trip?",
		]),
		category: "Plumbing Tips",
		tags: Object.freeze([
			"santa cruz",
			"tankless water heater",
			"water heater",
			"plumbing maintenance",
		]),
		image: "/images/services/water-heater-service.webp",
		image_alt: "Tankless water heater service context",
		preferred_links: Object.freeze([
			"/service-offerings/tankless-water-heater-installation",
			"/service-offerings/water-heater-installation",
			"/should-you-repair-or-replace-your-water-heater",
			"/what-is-hard-water-why-does-it-matter-for-your-home",
			"/contact",
		]),
		demand: 5,
		intent_fit: 5,
		cannibalization_risk: 1,
	}),
	topic({
		id: "septic-kitchen-habits-santa-cruz",
		slug: "septic-friendly-kitchen-habits-santa-cruz",
		query_cluster: "septic friendly kitchen habits Santa Cruz County",
		click_title: "Septic-Friendly Kitchen Habits for Santa Cruz County Homes",
		meta_hook:
			"Grease, disposers, and wipes quietly overload septic systems. Practical kitchen habits for Santa Cruz County parcels with tanks and drainfields.",
		search_intent: "informational_to_service",
		unique_value:
			"Focus on kitchen-to-drainfield cause and effect for local septic parcels, not another general septic 101.",
		angle:
			"Show how everyday kitchen choices load the tank and drainfield. Prefer habits and early warning signs over scare copy.",
		must_cover: Object.freeze([
			"grease, coffee grounds, and disposer limits on septic",
			"why flushable wipes are not septic safe",
			"early yard and drain clues that kitchen habits are catching up",
			"what belongs in trash versus sink",
		]),
		people_also_ask: Object.freeze([
			"Can I use a garbage disposal on a septic system?",
			"What foods are worst for a septic tank?",
			"How do kitchen habits affect a drainfield?",
			"What smells mean the system is stressed?",
			"When should I schedule pumping after heavy kitchen use?",
		]),
		category: "Septic Issues in Santa Cruz County",
		tags: Object.freeze([
			"santa cruz",
			"septic",
			"kitchen drains",
			"drain field",
		]),
		image: "/images/services/septic-pumping-illustration.webp",
		image_alt: "Septic system maintenance context",
		preferred_links: Object.freeze([
			"/service-offerings/septic-tank-cleaning-and-pumping",
			"/the-complete-guide-to-septic-system-maintenance",
			"/signs-your-drain-field-needs-professional-repair",
			"/service-offerings/grease-trap-cleaning",
			"/contact",
		]),
		demand: 5,
		intent_fit: 5,
		cannibalization_risk: 2,
	}),
	topic({
		id: "garbage-disposal-care-santa-cruz",
		slug: "garbage-disposal-care-santa-cruz",
		query_cluster: "garbage disposal care Santa Cruz County",
		click_title: "Garbage Disposal Care That Protects Santa Cruz County Pipes",
		meta_hook:
			"Keep disposals useful without wrecking drains or septic. Safe habits, jam resets, and clear stop points for Santa Cruz County kitchens.",
		search_intent: "informational",
		unique_value:
			"Separate city-sewer versus septic disposal advice so Santa Cruz County readers get the right kitchen limits.",
		angle:
			"Teach disposal use that protects both municipal and septic homes. Cover jams, odors, and when grinding is the wrong fix.",
		must_cover: Object.freeze([
			"what never goes in a disposal",
			"soft reset and jam safe responses",
			"septic versus sewer differences",
			"odors and slow drains after heavy grinding",
		]),
		people_also_ask: Object.freeze([
			"What should never go in a garbage disposal?",
			"Is a disposal safe with septic?",
			"How do I safely clear a jammed disposal?",
			"Why does my disposal smell?",
			"When is replacement smarter than another reset?",
		]),
		category: "Plumbing Tips",
		tags: Object.freeze([
			"santa cruz",
			"garbage disposal",
			"plumbing maintenance",
			"kitchen drains",
		]),
		image: "/images/services/drain-clearing.webp",
		image_alt: "Kitchen plumbing and drain clearing equipment",
		preferred_links: Object.freeze([
			"/service-offerings/garbage-disposal-installation",
			"/service-offerings/drain-cleaning",
			"/service-offerings/commercial-drain-cleaning",
			"/contact",
			"/how-to-properly-clear-a-clogged-drain-a-step-by-step-guide",
		]),
		demand: 4,
		intent_fit: 5,
		cannibalization_risk: 1,
	}),
	topic({
		id: "backflow-prevention-homeowners-santa-cruz",
		slug: "backflow-prevention-homeowners-santa-cruz",
		query_cluster: "backflow prevention homeowners Santa Cruz",
		click_title: "Backflow Prevention Explained for Santa Cruz Homeowners",
		meta_hook:
			"Irrigation and potable lines can cross. Learn what backflow assemblies do, what you can spot, and when testing belongs to a pro.",
		search_intent: "informational_to_service",
		unique_value:
			"Translate backflow into homeowner language with irrigation and landscape watering patterns common around Santa Cruz County properties.",
		angle:
			"Explain contamination risk in plain language, visual checks only, and why testing or installation is professional work.",
		must_cover: Object.freeze([
			"what backflow is and why irrigation raises risk",
			"parts a homeowner can see without opening the assembly",
			"testing versus repair versus new install",
			"when to stop and call instead of adjusting valves",
		]),
		people_also_ask: Object.freeze([
			"What does a backflow preventer do?",
			"Do residential irrigation systems need backflow protection?",
			"How often is backflow testing needed?",
			"Can I test a backflow device myself?",
			"What are signs an assembly needs service?",
		]),
		category: "Plumbing Tips",
		tags: Object.freeze([
			"santa cruz",
			"backflow prevention",
			"water safety",
			"irrigation",
		]),
		image: "/images/services/commercial-plumbing.webp",
		image_alt: "Backflow prevention assembly",
		preferred_links: Object.freeze([
			"/service-offerings/backflow-prevention-testing",
			"/service-offerings/backflow-prevention-installation",
			"/contact",
			"/faq",
		]),
		demand: 4,
		intent_fit: 5,
		cannibalization_risk: 1,
	}),
	topic({
		id: "washing-machine-hose-failures-santa-cruz",
		slug: "washing-machine-hose-failures-santa-cruz",
		query_cluster: "washing machine hose leak prevention Santa Cruz",
		click_title: "Stop Washing Machine Hose Failures Before They Flood a Home",
		meta_hook:
			"A burst washer hose can flood rooms in minutes. Inspection steps, hose types, and local urgency cues for Santa Cruz County homes.",
		search_intent: "informational",
		unique_value:
			"Make flood prevention concrete with a visual hose checklist and replacement timing, not vague leak tips.",
		angle:
			"Show how to inspect supply hoses, choose braided replacements conceptually, and react fast if a hose is bulging or damp.",
		must_cover: Object.freeze([
			"rubber versus braided hose failure modes",
			"monthly visual inspection points",
			"shutoff valve access before a laundry day",
			"what to do in the first minutes of a burst",
		]),
		people_also_ask: Object.freeze([
			"How often should washing machine hoses be replaced?",
			"Are braided hoses safer than rubber?",
			"Where should I look for early hose failure?",
			"What if the shutoff valve will not turn?",
			"Can a slow drip under the washer wait?",
		]),
		category: "Plumbing Tips",
		tags: Object.freeze([
			"santa cruz",
			"leak prevention",
			"washing machine",
			"home plumbing",
		]),
		image: "/images/services/drain-clearing.webp",
		image_alt: "Leak detection tools for home plumbing",
		preferred_links: Object.freeze([
			"/service-offerings/leak-detection",
			"/6-signs-you-have-a-hidden-water-leak",
			"/service-offerings/pipe-repair-and-replacement",
			"/contact",
		]),
		demand: 4,
		intent_fit: 4,
		cannibalization_risk: 1,
	}),
	topic({
		id: "hose-bib-winterizing-santa-cruz",
		slug: "hose-bib-winterizing-santa-cruz",
		query_cluster: "winterize outdoor faucet Santa Cruz County",
		click_title:
			"Winterize Outdoor Faucets in Santa Cruz County Before a Cold Snap",
		meta_hook:
			"Mild winters still freeze exposed hose bibs in colder pockets of the county. Shutoff steps, vacuum breakers, and damage signs.",
		search_intent: "informational",
		unique_value:
			"Address the false sense of safety from mild coastal winters and the colder inland or elevated pockets nearby.",
		angle:
			"Teach outdoor faucet winterizing without pipe surgery. Cover frost-free bibs, hose removal, and split-bib symptoms.",
		must_cover: Object.freeze([
			"why mild climates still see frozen bibs",
			"disconnect hoses and drain the sillcock",
			"frost-free versus standard bib differences",
			"crack and drip signs after a cold night",
		]),
		people_also_ask: Object.freeze([
			"Do I need to winterize outdoor faucets in Santa Cruz County?",
			"Should I leave a hose connected in winter?",
			"What is a frost-free hose bib?",
			"What does a cracked outdoor faucet look like?",
			"When is outdoor faucet repair a pro job?",
		]),
		category: "Plumbing Tips",
		tags: Object.freeze([
			"santa cruz",
			"hose bib",
			"winter plumbing",
			"frozen pipes",
		]),
		image: "/images/services/drain-clearing.webp",
		image_alt: "Outdoor plumbing fixture and pipe context",
		preferred_links: Object.freeze([
			"/how-to-prevent-frozen-pipes-this-winter",
			"/service-offerings/pipe-repair-and-replacement",
			"/service-offerings/leak-detection",
			"/contact",
			"/plumbing-maintenance-and-repairs-in-santa-cruz-county-ca",
		]),
		demand: 4,
		intent_fit: 4,
		cannibalization_risk: 2,
	}),
	topic({
		id: "water-pressure-problems-santa-cruz",
		slug: "water-pressure-problems-santa-cruz-homes",
		query_cluster: "low water pressure Santa Cruz County homes",
		click_title:
			"Low Water Pressure in Santa Cruz County Homes: Causes and Next Steps",
		meta_hook:
			"Weak showers and slow fill times have local causes. Sort fixture issues from whole-home pressure problems before you guess.",
		search_intent: "informational_to_service",
		unique_value:
			"Help readers isolate single-fixture versus whole-home pressure loss with coastal and hillside home patterns in mind.",
		angle:
			"Give a decision tree for low pressure: aerators, PRV symptoms, shared risers, and when measuring pressure needs a pro.",
		must_cover: Object.freeze([
			"single fixture versus whole home checks",
			"aerators, shutoffs, and supply stops",
			"pressure regulator symptoms in plain language",
			"when low pressure pairs with leaks or discoloration",
		]),
		people_also_ask: Object.freeze([
			"Why is my shower pressure suddenly low?",
			"Can a pressure regulator fail gradually?",
			"Is low pressure always a plumbing problem?",
			"What home checks are safe before calling?",
			"When does low pressure suggest a leak?",
		]),
		category: "Plumbing Tips",
		tags: Object.freeze([
			"santa cruz",
			"water pressure",
			"plumbing repair",
			"home plumbing",
		]),
		image: "/images/services/commercial-plumbing.webp",
		image_alt: "Home plumbing pressure and fixture context",
		preferred_links: Object.freeze([
			"/service-offerings/leak-detection",
			"/service-offerings/pipe-repair-and-replacement",
			"/shower-valve-replacement-why-it-matters-for-your-water-temperature-and-pressure",
			"/contact",
		]),
		demand: 5,
		intent_fit: 4,
		cannibalization_risk: 1,
	}),
	topic({
		id: "sump-and-crawlspace-moisture-santa-cruz",
		slug: "crawlspace-moisture-plumbing-santa-cruz",
		query_cluster: "crawlspace moisture plumbing Santa Cruz County",
		click_title: "Crawlspace Moisture and Plumbing Risks in Santa Cruz County",
		meta_hook:
			"Damp crawlspaces hide slow leaks and stressed supply lines. What to look for, what to photograph, and when moisture means a plumbing call.",
		search_intent: "informational_to_service",
		unique_value:
			"Connect coastal dampness and crawlspace living patterns to plumbing leak discovery, not generic mold content.",
		angle:
			"Teach safe visual crawlspace moisture checks tied to plumbing, with clear limits on entry and DIY.",
		must_cover: Object.freeze([
			"safe visual cues from the hatch without crawling into hazards",
			"condensation versus active plumbing leaks",
			"supply line sweating versus true drips",
			"documentation to bring to a professional visit",
		]),
		people_also_ask: Object.freeze([
			"Is crawlspace moisture always a plumbing leak?",
			"What should I photograph before calling a plumber?",
			"Can coastal fog cause pipe sweating?",
			"When is crawlspace entry unsafe?",
			"Do slow leaks under a house smell first?",
		]),
		category: "Plumbing Tips",
		tags: Object.freeze([
			"santa cruz",
			"crawlspace",
			"leak detection",
			"moisture",
		]),
		image: "/images/services/drain-clearing.webp",
		image_alt: "Crawlspace and plumbing moisture context",
		preferred_links: Object.freeze([
			"/service-offerings/leak-detection",
			"/6-signs-you-have-a-hidden-water-leak",
			"/service-offerings/pipe-repair-and-replacement",
			"/contact",
		]),
		demand: 4,
		intent_fit: 4,
		cannibalization_risk: 1,
	}),
	topic({
		id: "recirc-pump-hot-water-wait-santa-cruz",
		slug: "hot-water-recirculation-pumps-santa-cruz",
		query_cluster: "hot water recirculation pump Santa Cruz County",
		click_title:
			"Hot Water Wait Times and Recirculation Pumps in Santa Cruz Homes",
		meta_hook:
			"Tired of waiting for hot water in a long ranch or two-story layout? Compare habits, tank settings, and recirculation options without sales fluff.",
		search_intent: "informational_to_service",
		unique_value:
			"Frame recirculation as a layout and wait-time problem common in larger Santa Cruz County homes, with honest tradeoffs.",
		angle:
			"Explain why wait times happen, which non-install checks help, and how recirculation fits without inventing energy savings numbers.",
		must_cover: Object.freeze([
			"why long pipe runs delay hot water",
			"safe thermostat and fixture checks",
			"on-demand versus dedicated loop concepts at a high level",
			"leak and noise signs that need a pro",
		]),
		people_also_ask: Object.freeze([
			"Why does hot water take so long at some fixtures?",
			"Do recirculation pumps waste water or energy?",
			"Can I fix wait times without a new pump?",
			"What layout problems make wait times worse?",
			"When should a plumber evaluate recirculation?",
		]),
		category: "Plumbing Tips",
		tags: Object.freeze([
			"santa cruz",
			"hot water",
			"recirculation pump",
			"water heater",
		]),
		image: "/images/services/water-heater-service.webp",
		image_alt: "Hot water system and recirculation context",
		preferred_links: Object.freeze([
			"/service-offerings/tankless-water-heater-installation",
			"/service-offerings/water-heater-installation",
			"/should-you-repair-or-replace-your-water-heater",
			"/contact",
		]),
		demand: 4,
		intent_fit: 4,
		cannibalization_risk: 1,
	}),
	topic({
		id: "toilet-running-quiet-leak-santa-cruz",
		slug: "quiet-running-toilet-water-waste-santa-cruz",
		query_cluster: "quiet running toilet water waste Santa Cruz",
		click_title:
			"Quiet Running Toilets Waste Water: What Santa Cruz Homeowners Miss",
		meta_hook:
			"A toilet that runs after the tank looks full can waste water for months. Dye tests, flapper clues, and when to stop DIY.",
		search_intent: "informational",
		unique_value:
			"Focus on silent run-on waste and simple dye testing, distinct from a general toilet repair mega-guide.",
		angle:
			"Teach detection of silent toilet leaks, safe dye testing, and replacement limits before a pro visit.",
		must_cover: Object.freeze([
			"why quiet run-on is easy to miss",
			"dye test steps with household-safe coloring",
			"flapper, fill valve, and overflow clues",
			"when repeated resets mean professional repair",
		]),
		people_also_ask: Object.freeze([
			"How do I dye test a toilet for a silent leak?",
			"Can a running toilet raise a water bill a lot?",
			"Is a flapper a safe DIY swap?",
			"What if the toilet runs only at night?",
			"When should I stop adjusting the float?",
		]),
		category: "Plumbing Tips",
		tags: Object.freeze([
			"santa cruz",
			"toilet repair",
			"water waste",
			"plumbing tips",
		]),
		image: "/images/services/drain-clearing.webp",
		image_alt: "Toilet tank and plumbing maintenance context",
		preferred_links: Object.freeze([
			"/santa-cruz-toilet-running-solutions",
			"/service-offerings/fixture-installation",
			"/5-signs-you-need-to-call-a-professional-plumber",
			"/contact",
		]),
		demand: 4,
		intent_fit: 4,
		cannibalization_risk: 2,
	}),
]);

function topic(value) {
	if (!SAFE_SLUG.test(value.slug))
		throw new Error(`Unsafe blog topic slug: ${value.slug}`);
	if (
		typeof value.click_title !== "string" ||
		value.click_title.length < 35 ||
		value.click_title.length > 70
	) {
		throw new Error(`Topic ${value.id} needs a click title of 35 to 70 chars.`);
	}
	if (
		typeof value.meta_hook !== "string" ||
		value.meta_hook.length < MIN_DESCRIPTION ||
		value.meta_hook.length > MAX_DESCRIPTION
	) {
		throw new Error(
			`Topic ${value.id} meta_hook must be ${MIN_DESCRIPTION} to ${MAX_DESCRIPTION} characters.`,
		);
	}
	if (!Array.isArray(value.must_cover) || value.must_cover.length < 4) {
		throw new Error(`Topic ${value.id} requires at least 4 must_cover points.`);
	}
	if (
		!Array.isArray(value.people_also_ask) ||
		value.people_also_ask.length < MIN_FAQ_QUESTIONS
	) {
		throw new Error(
			`Topic ${value.id} requires at least ${MIN_FAQ_QUESTIONS} people_also_ask questions.`,
		);
	}
	return Object.freeze({
		...value,
		title_hint: value.click_title,
		tags: Object.freeze([...value.tags]),
		preferred_links: Object.freeze([...value.preferred_links]),
		must_cover: Object.freeze([...value.must_cover]),
		people_also_ask: Object.freeze([...value.people_also_ask]),
	});
}

function inventoryUrls(inventory) {
	return new Set((inventory?.pages ?? []).map((page) => page.url));
}

function resolveLinkPlan(topicSpec, urls) {
	const links = [];
	for (const to of topicSpec.preferred_links) {
		if (!urls.has(to)) continue;
		const anchor =
			to.split("/").filter(Boolean).at(-1)?.replaceAll("-", " ") ??
			"related page";
		links.push(
			Object.freeze({
				to,
				anchor: anchor.slice(0, 48),
				reader_rationale: `Helps readers act on ${topicSpec.query_cluster}.`,
			}),
		);
		if (links.length >= 6) break;
	}
	if (urls.has("/") && !links.some((link) => link.to === "/")) {
		links.push(
			Object.freeze({
				to: "/",
				anchor: "Wade's Plumbing & Septic",
				reader_rationale: "Gives readers a clear path back to the home site.",
			}),
		);
	}
	return Object.freeze(links.slice(0, 6));
}

function topicScore(topicSpec) {
	return (
		topicSpec.demand * topicSpec.intent_fit - topicSpec.cannibalization_risk
	);
}

function similarExistingPost(urls, slug) {
	if (urls.has(`/${slug}`)) return `/${slug}`;
	const stem = slug.replace(/-santa-cruz(?:-county)?$/, "");
	for (const url of urls) {
		if (!url.startsWith("/") || url.split("/").length !== 2) continue;
		const existing = url.slice(1);
		if (
			existing.includes(stem) ||
			stem.includes(existing.replace(/-santa-cruz(?:-county)?$/, ""))
		) {
			if (existing.length > 12 && stem.length > 12) return url;
		}
	}
	return null;
}

/**
 * Picks the highest-scoring unused blog topic that can resolve enough
 * internal links from the repository inventory.
 */
export function selectBlogOpportunity({
	inventory,
	catalog = BLOG_TOPIC_CATALOG,
	runId,
} = {}) {
	if (!runId || typeof runId !== "string")
		throw new Error("Blog opportunity selection requires a run ID.");
	const urls = inventoryUrls(inventory);
	const considered = [];
	for (const topicSpec of catalog) {
		const conflict = similarExistingPost(urls, topicSpec.slug);
		const links = resolveLinkPlan(topicSpec, urls);
		const viable =
			!conflict &&
			links.length >= MIN_INTERNAL_LINKS &&
			!urls.has(`/${topicSpec.slug}`);
		considered.push(
			Object.freeze({
				id: topicSpec.id,
				slug: topicSpec.slug,
				score: topicScore(topicSpec),
				viable,
				conflict,
				link_count: links.length,
			}),
		);
	}
	const ranked = considered
		.filter((item) => item.viable)
		.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
	if (ranked.length === 0) {
		return Object.freeze({
			decision: "NO_ACTION",
			reason: "NO_VIABLE_DISTINCT_BLOG_TOPIC",
			considered: Object.freeze(considered),
		});
	}
	const chosen = catalog.find((topicSpec) => topicSpec.id === ranked[0].id);
	const links = resolveLinkPlan(chosen, urls);
	return Object.freeze({
		decision: "PROPOSE_FOR_HUMAN_REVIEW",
		selection_reason: "DISTINCT_LOCAL_BLOG_INTENT",
		considered: Object.freeze(considered),
		opportunity: Object.freeze({
			id: `proposal-${runId}`,
			slug: chosen.slug,
			owner_url: `/${chosen.slug}`,
			content_path: `content/posts/${chosen.slug}.md`,
			query_cluster: chosen.query_cluster,
			title_hint: chosen.click_title,
			click_title: chosen.click_title,
			meta_hook: chosen.meta_hook,
			search_intent: chosen.search_intent,
			unique_value: chosen.unique_value,
			angle: chosen.angle,
			must_cover: chosen.must_cover,
			people_also_ask: chosen.people_also_ask,
			category: chosen.category,
			tags: chosen.tags,
			image: chosen.image,
			image_alt: chosen.image_alt,
			existing_page_assessment: "EXISTING_INSUFFICIENT",
			existing_page_decision: "CREATE_JUSTIFIED",
			evidence_ids: Object.freeze([
				"repository-inventory",
				`topic-catalog:${chosen.id}`,
				"people-first-seo-brief",
			]),
			internal_links: links,
			internal_link: links[0].to,
		}),
	});
}

function wordCount(text) {
	return (text.trim().match(/\b[\w'-]+\b/g) ?? []).length;
}

function markdownLinks(text) {
	return [...text.matchAll(/\[[^\]]+\]\((\/[^)\s]+)\)/g)].map(
		(match) => match[1],
	);
}

function frontMatterField(text, key) {
	const match = text.match(
		new RegExp(
			`^${key}:\\s*(?:"([^"]+)"|'([^']+)'|>(?:-)?\\s*([\\s\\S]*?)(?=\\n[a-zA-Z_]+:|\\n---)|([^\\n]+))`,
			"m",
		),
	);
	if (!match) return "";
	const raw = (match[1] ?? match[2] ?? match[3] ?? match[4] ?? "").trim();
	return raw.replace(/\s+/g, " ");
}

function faqQuestionCount(text) {
	const faqBlock = text.split(/^##\s+FAQ\b/im)[1] ?? "";
	return (faqBlock.match(/^###\s+.+/gm) ?? []).length;
}

/**
 * Fail-closed draft quality checks for Connect publication.
 */
export function assertPublishableBlogDraft(markdown, opportunity) {
	if (typeof markdown !== "string" || !markdown.trim()) {
		return Object.freeze({ ok: false, reason: "EMPTY_DRAFT" });
	}
	const text = markdown.trim();
	if (!text.startsWith("---")) {
		return Object.freeze({ ok: false, reason: "MISSING_FRONTMATTER" });
	}
	if (!text.includes(`canonical: ${opportunity.owner_url}`)) {
		return Object.freeze({ ok: false, reason: "CANONICAL_MISMATCH" });
	}
	const description = frontMatterField(text, "description");
	if (
		description.length < MIN_DESCRIPTION ||
		description.length > MAX_DESCRIPTION
	) {
		return Object.freeze({ ok: false, reason: "WEAK_META_DESCRIPTION" });
	}
	if (!/santa cruz/i.test(description)) {
		return Object.freeze({ ok: false, reason: "META_MISSING_LOCAL_HOOK" });
	}
	if (!/santa cruz/i.test(text)) {
		return Object.freeze({ ok: false, reason: "MISSING_LOCAL_CONTEXT" });
	}
	const h1 = (text.match(/^#\s+/gm) ?? []).length;
	const h2 = (text.match(/^##\s+/gm) ?? []).length;
	if (h1 !== 1) {
		return Object.freeze({ ok: false, reason: "INVALID_H1_COUNT" });
	}
	if (h2 < MIN_H2) {
		return Object.freeze({ ok: false, reason: "INSUFFICIENT_SECTIONS" });
	}
	if (!/^##\s+FAQ\b/im.test(text)) {
		return Object.freeze({ ok: false, reason: "MISSING_FAQ" });
	}
	if (faqQuestionCount(text) < MIN_FAQ_QUESTIONS) {
		return Object.freeze({ ok: false, reason: "INSUFFICIENT_FAQ_DEPTH" });
	}
	if (!/^##\s+Quick Answer for Santa Cruz County Homeowners\b/im.test(text)) {
		return Object.freeze({ ok: false, reason: "MISSING_QUICK_ANSWER" });
	}
	if (
		!/^##\s+What (?:makes this guide different|you will not get from generic articles)\b/im.test(
			text,
		)
	) {
		return Object.freeze({ ok: false, reason: "MISSING_UNIQUE_VALUE_SECTION" });
	}
	const links = markdownLinks(text);
	const planned = new Set(opportunity.internal_links.map((link) => link.to));
	const matched = [...new Set(links.filter((href) => planned.has(href)))];
	if (matched.length < MIN_INTERNAL_LINKS) {
		return Object.freeze({
			ok: false,
			reason: "INSUFFICIENT_INTERNAL_LINKS",
			matched,
		});
	}
	const words = wordCount(text);
	if (words < MIN_BODY_WORDS) {
		return Object.freeze({ ok: false, reason: "TOO_THIN" });
	}
	if (words > MAX_BODY_WORDS + 400) {
		return Object.freeze({ ok: false, reason: "UNBOUNDEDLY_LONG" });
	}
	if (GENERIC_FILLER.test(text)) {
		return Object.freeze({ ok: false, reason: "GENERIC_FILLER" });
	}
	if (
		/\b(?:serving|available in)\s+[A-Z][a-z]+/i.test(text) ||
		/\b(?:licensed|insured|bonded)\b/i.test(text) ||
		/\b24\s*\/\s*7\b/i.test(text) ||
		/\$\d/.test(text)
	) {
		return Object.freeze({ ok: false, reason: "UNSUPPORTED_MARKETING_CLAIM" });
	}
	const covered = opportunity.must_cover.filter((point) => {
		const tokens = point
			.toLowerCase()
			.split(/\W+/)
			.filter((token) => token.length > 4)
			.slice(0, 3);
		const body = text.toLowerCase();
		return tokens.length > 0 && tokens.every((token) => body.includes(token));
	});
	if (covered.length < Math.min(3, opportunity.must_cover.length)) {
		return Object.freeze({ ok: false, reason: "MISSING_MUST_COVER_DEPTH" });
	}
	return Object.freeze({
		ok: true,
		reason: null,
		word_count: words,
		internal_links: matched,
		faq_questions: faqQuestionCount(text),
		description_length: description.length,
	});
}

export function buildWriterPrompt({ opportunity, date }) {
	const linkLines = opportunity.internal_links
		.map((link) => `- [${link.anchor}](${link.to}): ${link.reader_rationale}`)
		.join("\n");
	const tagLines = opportunity.tags.map((tag) => `  - ${tag}`).join("\n");
	const mustCover = opportunity.must_cover
		.map((item, index) => `${index + 1}. ${item}`)
		.join("\n");
	const paa = opportunity.people_also_ask
		.map((question) => `- ${question}`)
		.join("\n");
	return `You write people-first SEO content for Wade's Plumbing & Septic (Santa Cruz County plumbing and septic).

Goal: publish a draft that can earn clicks and satisfy Google helpful-content expectations by being original, complete for the query, locally specific, and useful enough that a homeowner would bookmark or share it. Exceed thin competitor posts. Do not write generic national filler.

Return ONLY Markdown with YAML front matter. No code fences.

Search intent: ${opportunity.search_intent}
Query cluster: ${opportunity.query_cluster}
Unique value you must deliver: ${opportunity.unique_value}
Angle: ${opportunity.angle}

Click-focused title to use or lightly improve (keep under 70 characters, keep Santa Cruz County specificity):
${opportunity.click_title}

Meta description target (rewrite for CTR; ${MIN_DESCRIPTION} to ${MAX_DESCRIPTION} characters; must mention Santa Cruz County; promise a concrete outcome):
${opportunity.meta_hook}

Must-cover points (each needs a real explanation, not a single sentence):
${mustCover}

People-also-ask questions to answer inside the FAQ (use these or tighter paraphrases as ### headings):
${paa}

Required front matter keys:
title: <clickworthy title>
description: <CTR meta description>
category: ${opportunity.category}
date: "${date}"
tags:
${tagLines}
image: ${opportunity.image}
imageAlt: "${opportunity.image_alt}"
canonical: ${opportunity.owner_url}
query_cluster: ${opportunity.query_cluster}
evidence_ids: [${opportunity.evidence_ids.join(", ")}]

Required structure and depth:
1. Exactly one H1 that matches the title and makes a specific promise.
2. H2 "Quick Answer for Santa Cruz County Homeowners" with 4 to 6 concrete bullets a skimmer can use immediately.
3. H2 "What makes this guide different" explaining the local or practical uniqueness in plain language.
4. At least ${MIN_H2} total H2 sections. Use scannable subheads, short paragraphs, and checklists where they help decisions.
5. H2 "FAQ" with at least ${MIN_FAQ_QUESTIONS} ### question headings and useful answers.
6. Closing CTA linking to /contact without inventing arrival times, prices, or guarantees.
7. At least ${MIN_INTERNAL_LINKS} contextual Markdown links to these approved destinations (exact paths):
${linkLines}

People-first / SEO quality bar:
- Target ${MIN_BODY_WORDS} to ${MAX_BODY_WORDS} words of real guidance. Prefer specific steps, decision points, and local context over adjectives.
- Write for humans first. Every section should help someone decide, check, or act safely.
- Demonstrate experience through practical detail (what to look at, what to ignore, when to stop). Do not invent credentials, jobs, reviews, stats, or permits.
- Mention Santa Cruz County in the intro, meta description, and at least two body sections with concrete local conditions (coastal moisture, mixed housing age, septic parcels, hillside or vacation homes) without fake data.
- Titles and descriptions must earn the click: specific problem + place + outcome. No clickbait that the body fails to deliver.
- Do NOT keyword stuff, build doorway city pages, or reuse boilerplate from other posts.
- Do NOT claim the company is "serving", "available in", licensed, insured, bonded, 24/7, same-day, or guaranteed, and do not quote prices.
- Do NOT give dangerous DIY steps (torch work, trenching, electrical panels, chemical drain bombing). Prefer stop-and-call-a-pro guidance when risk rises.
- Avoid empty phrases like "in today's world", "it is important to note", or "needless to say".`;
}

export const BLOG_QUALITY_THRESHOLDS = Object.freeze({
	min_body_words: MIN_BODY_WORDS,
	max_body_words: MAX_BODY_WORDS,
	min_h2: MIN_H2,
	min_internal_links: MIN_INTERNAL_LINKS,
	min_faq_questions: MIN_FAQ_QUESTIONS,
	min_description: MIN_DESCRIPTION,
	max_description: MAX_DESCRIPTION,
});
