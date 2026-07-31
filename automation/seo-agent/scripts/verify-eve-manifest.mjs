import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const manifestPath = resolve(root, '.output/.eve/compile/compiled-agent-manifest.json');
if (!existsSync(manifestPath)) throw new Error('Eve compiled manifest is missing; run eve build first.');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const disabled = ['bash', 'glob', 'grep', 'read_file', 'todo', 'web_fetch', 'web_search', 'write_file'];
for (const tool of [...disabled, 'agent']) {
  if (!(manifest.disabledFrameworkTools ?? []).includes(tool)) throw new Error(`Root agent exposes framework ${tool}.`);
}
if (!manifest.sandbox) throw new Error('Root agent must declare an explicit Sandbox policy.');
if ((manifest.tools ?? []).some((tool) => tool.name === 'sandbox')) throw new Error('Root agent must not expose raw Sandbox creation as a model tool.');
const auditSchedule = (manifest.schedules ?? []).find((schedule) => schedule.name === 'audit');
if (!auditSchedule || auditSchedule.cron !== '17 16 * * 1' || !auditSchedule.hasRun) {
  throw new Error('Compiled audit schedule must dispatch bounded durable runtime work.');
}
const runtimeChannel = (manifest.channels ?? []).find((channel) => channel.name === 'runtime' && channel.urlPath === '/api/cron');
if (!runtimeChannel) throw new Error('Compiled runtime channel must expose the protected /api/cron dispatcher.');
if (!(manifest.tools ?? []).some((tool) => tool.name === 'orchestrate')) throw new Error('Root agent must expose the bounded orchestrate tool.');
for (const child of manifest.subagents ?? []) {
  const actual = new Set(child.agent?.disabledFrameworkTools ?? []);
  if (!child.agent?.instructions?.markdown?.trim()) {
    throw new Error(`Compiled subagent ${child.name} is missing scoped instructions.`);
  }
  for (const tool of disabled) {
    if (!actual.has(tool)) throw new Error(`Compiled subagent ${child.name} exposes framework ${tool}.`);
  }
}
if ((manifest.subagents ?? []).length !== 9) throw new Error('Compiled manifest does not contain all declared role agents.');
console.log(`Eve manifest verified (${manifest.subagents.length} least-privilege role agents; explicit deny-by-default Sandbox; bounded durable audit dispatcher).`);
