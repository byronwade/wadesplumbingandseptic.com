import { createIntegrationRegistry } from '../src/adapters.mjs';
import { loadConfig, summarizeConfig } from '../src/config.mjs';
import { probeReadOnlyIntegrations } from '../src/probes.mjs';

const execute = process.argv.includes('--execute');
const runIdArgument = process.argv.find((argument) => argument.startsWith('--run-id='));
const runId = runIdArgument ? runIdArgument.slice('--run-id='.length) : 'manual-live-probe';
const config = loadConfig();
const results = await probeReadOnlyIntegrations({
  registry: createIntegrationRegistry({ config }),
  config,
  runId,
  execute,
});
console.log(JSON.stringify({
  mode: execute ? 'human-approved-live-read' : 'offline-plan-only',
  run_id: runId,
  config: summarizeConfig(config),
  results,
}, null, 2));
