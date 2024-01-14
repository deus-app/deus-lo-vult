import { z } from 'zod';
import { invokeOrThrow } from './invokeOrThrow';
import { prompts } from './prompts';

export const llmRepo = {
  initConversation: async () => {
    const validator = z.object({ webServiceArea: z.string() });
    const ideaValidater = z.object({ ideaName: z.string(), description: z.string() });
    const followUpValidator = z.object({ feedback: z.string(), complete: z.boolean() });
    const finalValidator = z.object({ name: z.string(), similarName: z.string() });

    const serviceArea = await invokeOrThrow(prompts.webServiceArea(), validator);
    let serviceIdea = await invokeOrThrow(
      prompts.webServiceIdea(serviceArea.webServiceArea),
      ideaValidater
    );
    let followUp: {
      feedback: string;
      complete: boolean;
    };

    do {
      followUp = await invokeOrThrow(
        prompts.followUp(serviceIdea.ideaName, serviceIdea.description),
        followUpValidator
      );

      if (!followUp.complete) {
        serviceIdea = await invokeOrThrow(
          prompts.improvement(serviceIdea.ideaName, serviceIdea.description, followUp.feedback),
          ideaValidater
        );
      }
    } while (!followUp.complete);

    return await invokeOrThrow(
      prompts.final(serviceIdea.ideaName, serviceIdea.description),
      finalValidator
    );
  },
};
