import { defineAgent } from 'eve';
import { modelContextWindowTokens, modelForRole, modelOptionsForRole } from '../../model';
export default defineAgent({ description: 'Challenges proposals independently and re-runs deterministic checks before draft PR readiness.', model: modelForRole('independent_qa'), modelOptions: modelOptionsForRole('independent_qa'), modelContextWindowTokens });
