import { z } from 'zod';
import { invokeOrThrow } from './invokeOrThrow';
import { prompts } from './prompts';

export const llmRepo = {
  initConversation: async () => {
    const validator = z.object({ webServiceArea: z.string() });
    const serviceArea = await invokeOrThrow(prompts.webServiceIdea(), validator);
    const followUpValidator = z.object({ name: z.string(), similarName: z.string() });
    const serviceIdea = await invokeOrThrow(
      prompts.followUp(serviceArea.webServiceArea),
      followUpValidator
    );

    return serviceIdea;
  },
};
