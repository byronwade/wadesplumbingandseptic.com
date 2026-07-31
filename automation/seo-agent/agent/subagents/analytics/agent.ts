import { defineAgent } from 'eve';
import { model, modelContextWindowTokens } from '../../model';
export default defineAgent({ description: 'Analyzes read-only Search Console, PageSpeed, and optional analytics evidence.', model, modelContextWindowTokens });
