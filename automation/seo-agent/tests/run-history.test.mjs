import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { createAuditOnlyRun, createConfiguredAuditOnlyRun } from '../src/audit.mjs';
import { collectRecordedRunIds } from '../src/run-history.mjs';

async function withTempRoot(callback) {
  const root = mkdtempSync(resolve(tmpdir(), 'eve-seo-run-history-'));
  try { return await callback(root); } finally { rmSync(root, { recursive: true, force: true }); }
}

function sourceRepositoryRoot() {
  return resolve(import.meta.dirname, '../../..');
}

function writeManifest(root, runId, manifest) {
  const directory = resolve(root, 'seo', 'runs', runId);
  mkdirSync(directory, { recursive: true });
  writeFileSync(resolve(directory, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
}

test('Git-backed run history accepts only canonical validated manifests', async () => {
  await withTempRoot((root) => {
    const manifest = createAuditOnlyRun({ repoRoot: sourceRepositoryRoot(), runId: 'scheduled-audit-2026-07-30', treeHash: 'fixture-tree' });
    writeManifest(root, manifest.run_id, manifest);
    assert.deepEqual(collectRecordedRunIds({ repoRoot: root }), ['scheduled-audit-2026-07-30']);
    writeManifest(root, 'wrong-directory-001', { ...manifest, run_id: 'scheduled-audit-2026-07-31' });
    assert.throws(() => collectRecordedRunIds({ repoRoot: root }), /does not match/);
  });
});

test('configured audits deny a duplicate run ID recorded in Git state before collection', async () => {
  await withTempRoot(async (root) => {
    const manifest = createAuditOnlyRun({ repoRoot: sourceRepositoryRoot(), runId: 'scheduled-audit-2026-07-30', treeHash: 'fixture-tree' });
    writeManifest(root, manifest.run_id, manifest);
    await assert.rejects(createConfiguredAuditOnlyRun({
      repoRoot: root,
      runId: 'scheduled-audit-2026-07-30',
      treeHash: 'fixture-tree',
    }), /Duplicate run denied/);
  });
});
