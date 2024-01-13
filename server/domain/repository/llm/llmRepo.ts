import { invokeOrThrow } from './invokeOrThrow';
import { prompts } from './prompts';

export const llmRepo = {
  initConversation: async () => {
    const serviceIdea = await invokeOrThrow(prompts.initConversation());
    return serviceIdea;
  },
};
