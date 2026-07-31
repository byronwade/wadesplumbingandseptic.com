import { generateText } from 'ai';
import { gateway } from '@ai-sdk/gateway';
import { defineTool } from 'eve/tools';
import { z } from 'zod';
import { resolveGatewayModelOptions, resolveModelProfile } from '../../src/policy.mjs';
import { reserveModelRequest } from '../../src/model-budget.mjs';

export default defineTool({
  description: 'Generate a bounded analysis only when AI Gateway credentials are available.',
  inputSchema: z.object({
    runId: z.string().regex(/^[a-z0-9][a-z0-9-]{2,79}$/),
    prompt: z.string().min(1),
    maxOutputTokens: z.number().int().min(1).max(1200).optional(),
  }),
  async execute({ runId, prompt, maxOutputTokens = 1200 }) {
    const profile = resolveModelProfile('orchestration');
    const model = profile.primary;
    const reservation = reserveModelRequest({ runId, prompt, maxOutputTokens, model });
    if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
      throw new Error('AI Gateway is not configured; record BLOCKED_MISSING_CREDENTIALS instead of substituting a model response.');
    }
    const result = await generateText({ model: gateway(model), prompt, maxOutputTokens, ...resolveGatewayModelOptions('orchestration') });
    return { ...result, run_budget: reservation };
  },
});
