import { assertNoUnsupportedServiceArea, sha256 } from './contracts.mjs';
import { classifyUntrustedText } from './policy.mjs';

const INTENTS = new Set(['emergency', 'service', 'comparison', 'maintenance', 'cost_financing', 'local', 'informational']);

function score(value, key) {
  if (!Number.isFinite(value) || value < 0 || value > 5) throw new Error(`${key} must be between 0 and 5`);
  return value;
}

export function scoreOpportunity(input) {
  const demand = score(input.demand, 'demand');
  const intentFit = score(input.intent_fit, 'intent_fit');
  const businessEvidence = score(input.business_evidence, 'business_evidence');
  const feasibility = score(input.feasibility, 'feasibility');
  const cannibalizationRisk = score(input.cannibalization_risk, 'cannibalization_risk');
  const safetyRisk = score(input.safety_risk, 'safety_risk');
  return demand * intentFit * businessEvidence * feasibility - cannibalizationRisk - safetyRisk;
}

export function assignQueryOwner({ ownership, queryCluster, ownerUrl, intent, evidenceIds }) {
  if (!INTENTS.has(intent)) throw new Error(`Invalid intent: ${intent}`);
  if (!ownerUrl?.startsWith('/')) throw new Error('Query owner must be an internal canonical path');
  if (!Array.isArray(evidenceIds) || evidenceIds.length === 0) throw new Error('Query ownership requires evidence');
  if (ownership.some((item) => item.query_cluster === queryCluster)) throw new Error(`Query cluster already has an owner: ${queryCluster}`);
  return [...ownership, { query_cluster: queryCluster, owner_url: ownerUrl, intent, evidence_ids: evidenceIds, confidence: 'REVIEW_REQUIRED' }];
}

export function validateProposal(proposal, { inventory, approvedFacts }) {
  if (!proposal.id || !proposal.query_cluster || !proposal.owner_url || !proposal.rollback_target) throw new Error('Proposal is missing required fields');
  if (!proposal.owner_url.startsWith('/')) throw new Error('Proposal owner URL must be internal');
  if (!proposal.existing_page_assessment) throw new Error('Proposal must evaluate an existing page first');
  if (!proposal.duplicate_cannibalization_assessment) throw new Error('Proposal requires duplicate and cannibalization assessment');
  if (!Array.isArray(proposal.evidence_ids) || proposal.evidence_ids.length === 0) throw new Error('Proposal requires evidence');
  if (proposal.new_url && proposal.existing_page_assessment !== 'EXISTING_INSUFFICIENT') throw new Error('New URLs require an explicit existing-page insufficiency decision');
  if (proposal.new_url && (!proposal.new_url.startsWith('/') || inventory.pages.some((page) => page.url === proposal.new_url))) throw new Error('New URL duplicates an existing canonical page');
  if (!inventory.pages.some((page) => page.url === proposal.owner_url) && !proposal.new_url) throw new Error('Proposal owner is not in the page inventory');
  assertNoUnsupportedServiceArea(proposal, approvedFacts);
  return { ...proposal, proposal_hash: sha256(proposal), state: 'REVIEW_REQUIRED' };
}

export function validateMarkdownDraft(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]+)$/);
  if (!match) throw new Error('Markdown draft requires YAML front matter');
  for (const field of ['title:', 'description:', 'canonical:', 'query_cluster:', 'evidence_ids:']) {
    if (!match[1].includes(field)) throw new Error(`Markdown draft missing ${field}`);
  }
  if (!classifyUntrustedText(markdown).accepted) throw new Error('Markdown draft contains disallowed content');
  return { front_matter: match[1], body: match[2] };
}

export function createDraftPrPacket(proposal, markdown) {
  validateMarkdownDraft(markdown);
  return `# SEO Draft PR Packet\n\n- Proposal: ${proposal.id}\n- Query cluster: ${proposal.query_cluster}\n- Canonical owner: ${proposal.owner_url}\n- Existing page assessment: ${proposal.existing_page_assessment}\n- Evidence: ${proposal.evidence_ids.join(', ')}\n- Rollback: ${proposal.rollback_target}\n- Publication: DRAFT PR ONLY; human approval and merge required.\n`;
}
