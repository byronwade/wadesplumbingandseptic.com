import { defineAgent } from 'eve';
import { model, modelContextWindowTokens } from '../../model';
export default defineAgent({ description: 'Audits internal links, page ownership, orphan risk, and contextual link proposals.', model, modelContextWindowTokens });
