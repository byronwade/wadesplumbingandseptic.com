import { createHash } from 'node:crypto';
import { assertTruthState, classifyUntrustedText, scanForSecrets } from './policy.mjs';

function sha256(value) {
  return createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
}

function safeSourceUrl(value) {
  const url = new URL(value);
  url.search = '';
  url.hash = '';
  return url.toString();
}

export function createSecurityEvent({ runId, source, scope, sourceUrlOrTool, text, classification = 'MOCK_VERIFIED', collectedAt = new Date().toISOString() }) {
  if (!runId || !source || !scope || !sourceUrlOrTool) throw new Error('Security event requires run, source, scope, and source URL/tool fields');
  assertTruthState(classification);
  const assessment = classifyUntrustedText(text);
  if (assessment.accepted) throw new Error('Security event requires rejected untrusted input');
  const payload = {
    event_type: 'security_event',
    security_state: 'SECURITY_ESCALATED',
    content_hash: sha256(typeof text === 'string' ? text : JSON.stringify(text)),
    matched_rules: assessment.matches,
    raw_content_stored: false,
    human_escalation_required: true,
    automated_actions_blocked: ['tool_execution', 'content_creation', 'policy_change', 'credential_access'],
  };
  const event = {
    schema_version: '1.0',
    run_id: runId,
    collected_at: collectedAt,
    source,
    source_url_or_tool: sourceUrlOrTool.startsWith('http') ? safeSourceUrl(sourceUrlOrTool) : sourceUrlOrTool,
    scope,
    classification,
    redaction: 'NO_RAW_UNTRUSTED_TEXT_OR_SECRETS',
    retention_class: 'VERSIONED_NON_SECRET',
    sha256: sha256(payload),
    payload,
  };
  return assertSecurityEvent(event);
}

export function assertSecurityEvent(event) {
  const required = ['schema_version', 'run_id', 'collected_at', 'source', 'source_url_or_tool', 'scope', 'classification', 'redaction', 'retention_class', 'sha256', 'payload'];
  for (const field of required) if (!event?.[field]) throw new Error(`Security event missing ${field}`);
  assertTruthState(event.classification);
  if (Number.isNaN(Date.parse(event.collected_at))) throw new Error('Security event has an invalid collected_at timestamp');
  if (event.payload.event_type !== 'security_event' || event.payload.security_state !== 'SECURITY_ESCALATED') throw new Error('Security event must be escalated');
  if (event.payload.raw_content_stored !== false || event.payload.human_escalation_required !== true) throw new Error('Security event must retain no raw content and require human escalation');
  if (!Array.isArray(event.payload.automated_actions_blocked) || event.payload.automated_actions_blocked.length === 0) throw new Error('Security event must record blocked automated actions');
  if (event.sha256 !== sha256(event.payload)) throw new Error('Security event payload hash does not match payload');
  if (scanForSecrets(event)) throw new Error('Security event contains a secret-like value');
  if (Object.hasOwn(event.payload, 'raw_content') || Object.hasOwn(event, 'text')) throw new Error('Security event must not persist raw untrusted content');
  return Object.freeze(event);
}
