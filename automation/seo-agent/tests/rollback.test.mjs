import test from 'node:test';
import assert from 'node:assert/strict';
import { assertHumanRollbackDrill, createHumanRollbackDrill } from '../src/rollback.mjs';

test('rollback drill is human-only, provenance-bound, and rejects autonomous execution', () => {
  const record = createHumanRollbackDrill();
  assert.equal(assertHumanRollbackDrill(record).classification, 'MOCK_VERIFIED');
  assert.equal(record.payload.automated_action_attempted, false);
  assert.equal(record.payload.human_approval_required, true);
  assert.equal(record.payload.required_human_steps.includes('disable_sidecar_cron_in_vercel'), true);
  assert.throws(() => assertHumanRollbackDrill({ ...record, payload: { ...record.payload, automated_action_attempted: true } }), /prohibit autonomous rollback/);
  assert.throws(() => createHumanRollbackDrill({ rollbackTarget: 'agent_rollback' }), /unsupported rollback target/);
});
