import { randomUUID } from 'crypto';
import { serviceQuery } from 'domain/app/query/serviceQuery';
import { prismaClient } from 'service/prismaClient';
import { z } from 'zod';
import { feedbackRepo } from '../app/repository/feedbackRepo';
import { ideaRepo } from '../app/repository/ideaRepo';
import { serviceRepo } from '../app/repository/serviceRepo';
import { invokeOrThrow } from './invokeOrThrow';
import { prompts } from './prompts';

export const llmRepo = {
  initConversation: async (): Promise<{
    name: string;
    similarName: string;
  }> => {
    const webServiceAreaValidator = z.object({
      webServiceArea: z.string(),
      selectReason: z.string(),
    });
    const webServiceIdeaValidater = z.object({ ideaName: z.string(), description: z.string() });
    const feedbackValidator = z.object({ feedback: z.string(), complete: z.boolean() });
    const completeValidator = z.object({ name: z.string(), similarName: z.string() });
    const serviceId = (await serviceQuery.countAll(prismaClient)) + 1;
    let ideaId = randomUUID();

    const existingServiceAreas = await serviceQuery.findAllAreas(prismaClient);
    const serviceArea = await invokeOrThrow(
      prompts.webServiceArea(existingServiceAreas),
      webServiceAreaValidator
    );
    await serviceRepo.save(serviceId, serviceArea.webServiceArea, 'unfinished');

    let serviceIdea = await invokeOrThrow(
      prompts.webServiceIdea(serviceArea.webServiceArea, serviceArea.selectReason),
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
