import { defineAgent } from 'eve';
import { model, modelContextWindowTokens } from '../../model';
export default defineAgent({ description: 'Documents justified no-change decisions when evidence does not support a safe content modification.', model, modelContextWindowTokens });
