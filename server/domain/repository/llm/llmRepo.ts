import { randomUUID } from 'crypto';
import { z } from 'zod';
import { feedbackRepo } from '../feedbackRepo';
import { ideaRepo } from '../ideaRepo';
import { serviceRepo } from '../serviceRepo';
import { invokeOrThrow } from './invokeOrThrow';
import { prompts } from './prompts';

export const llmRepo = {
  initConversation: async () => {
    const webServiceAreaValidator = z.object({ webServiceArea: z.string() });
    const webServiceIdeaValidater = z.object({ ideaName: z.string(), description: z.string() });
    const feedbackValidator = z.object({ feedback: z.string(), complete: z.boolean() });
    const completeValidator = z.object({ name: z.string(), similarName: z.string() });
    const serviceId = randomUUID();
    let ideaId = randomUUID();

    const serviceArea = await invokeOrThrow(prompts.webServiceArea(), webServiceAreaValidator);
    await serviceRepo.save(serviceId, serviceArea.webServiceArea, 'unfinished');

    let serviceIdea = await invokeOrThrow(
      prompts.webServiceIdea(serviceArea.webServiceArea),
      webServiceIdeaValidater
    );

    let followUp: {
      feedback: string;
      complete: boolean;
    };

    do {
      await ideaRepo.save(
        ideaId,
        serviceIdea.ideaName,
        serviceIdea.description,
        'unreceived',
        serviceId
      );
      console.log('ideaName', serviceIdea.ideaName);
      console.log('description', serviceIdea.description);
      const feedbackId = randomUUID();
      followUp = await invokeOrThrow(
        prompts.feedback(serviceIdea.ideaName, serviceIdea.description),
        feedbackValidator
      );
      await ideaRepo.save(
        ideaId,
        serviceIdea.ideaName,
        serviceIdea.description,
        followUp.complete ? 'complete' : 'incomplete',
        serviceId
      );
      await feedbackRepo.save(feedbackId, followUp.feedback, ideaId);

      if (!followUp.complete) {
        ideaId = randomUUID();
        serviceIdea = await invokeOrThrow(
          prompts.improvement(serviceIdea.ideaName, serviceIdea.description, followUp.feedback),
          webServiceIdeaValidater
        );
      }
    } while (!followUp.complete);

    const completeService = await invokeOrThrow(
      prompts.complete(serviceIdea.ideaName, serviceIdea.description),
      completeValidator
    );
    await serviceRepo.save(
      serviceId,
      serviceArea.webServiceArea,
      'finished',
      completeService.name,
      completeService.similarName
    );

    return completeService;
  },
};
