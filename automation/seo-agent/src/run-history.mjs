import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { assertRunManifest } from './contracts.mjs';

const SAFE_RUN_ID = /^[a-z0-9][a-z0-9-]{2,79}$/;

/**
 * Read only the canonical Git-backed run manifests. Any unexpected directory,
 * malformed JSON, or invalid manifest fails closed so a duplicate delivery
 * cannot ignore a corrupted history record.
 */
export function collectRecordedRunIds({ repoRoot }) {
  const runsRoot = resolve(repoRoot, 'seo', 'runs');
  if (!existsSync(runsRoot)) return Object.freeze([]);

  const runIds = new Set();
  for (const entry of readdirSync(runsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || !SAFE_RUN_ID.test(entry.name)) {
      throw new Error(`Run history contains an unsafe entry: ${entry.name}`);
    }
    const manifestPath = resolve(runsRoot, entry.name, 'manifest.json');
    if (!existsSync(manifestPath)) throw new Error(`Run history is missing its manifest: ${entry.name}`);
    let manifest;
    try {
      manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    } catch {
      throw new Error(`Run history manifest is invalid JSON: ${entry.name}`);
    }
    assertRunManifest(manifest);
    if (manifest.run_id !== entry.name) throw new Error(`Run history manifest ID does not match its directory: ${entry.name}`);
    if (runIds.has(manifest.run_id)) throw new Error(`Run history contains a duplicate run ID: ${manifest.run_id}`);
    runIds.add(manifest.run_id);
  }
  return Object.freeze([...runIds].sort());
}
