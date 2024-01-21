import OpenAI from 'openai';
import { OPENAI_KEY } from './envValues';

export const openai = new OpenAI({ apiKey: OPENAI_KEY });
