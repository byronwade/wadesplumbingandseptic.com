import { defineAgent } from 'eve';
import { model, modelContextWindowTokens } from '../../model';
export default defineAgent({ description: 'Researches Santa Cruz County plumbing and septic demand and intent from approved evidence.', model, modelContextWindowTokens });
