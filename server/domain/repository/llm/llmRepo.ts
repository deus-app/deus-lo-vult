import { invokeOrThrow } from './invokeOrThrow';
import { prompts } from './prompts';

export const llmRepo = {
  initConversation: async () => {
    console.log('llmRepo.initConversation');
    await invokeOrThrow(prompts.initConversation());
  },
};
