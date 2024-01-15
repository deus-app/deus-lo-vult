import { z } from 'zod';
import { invokeOrThrow } from './invokeOrThrow';
import { prompts } from './prompts';

export const llmRepo = {
  initConversation: async () => {
    const webServiceAreaValidator = z.object({ webServiceArea: z.string() });
    const webServiceIdeaValidater = z.object({ ideaName: z.string(), description: z.string() });
    const feedbackValidator = z.object({ feedback: z.string(), complete: z.boolean() });
    const completeValidator = z.object({ name: z.string(), similarName: z.string() });

    const serviceArea = await invokeOrThrow(prompts.webServiceArea(), webServiceAreaValidator);
    let serviceIdea = await invokeOrThrow(
      prompts.webServiceIdea(serviceArea.webServiceArea),
      webServiceIdeaValidater
    );

    let followUp: {
      feedback: string;
      complete: boolean;
    };

    do {
      followUp = await invokeOrThrow(
        prompts.feedback(serviceIdea.ideaName, serviceIdea.description),
        feedbackValidator
      );

      if (!followUp.complete) {
        serviceIdea = await invokeOrThrow(
          prompts.improvement(serviceIdea.ideaName, serviceIdea.description, followUp.feedback),
          webServiceIdeaValidater
        );
      }
    } while (!followUp.complete);

    return await invokeOrThrow(
      prompts.complete(serviceIdea.ideaName, serviceIdea.description),
      completeValidator
    );
  },
};
