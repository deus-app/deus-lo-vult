import { creatioRepo } from 'domain/app/creatioRepo';
import { llmRepo } from 'domain/llm/llmRepo';

export const appUseCase = {
  vult: async (): Promise<void> => {
    const serviceIdea = await llmRepo.initConversation();
    await creatioRepo.post(JSON.stringify(serviceIdea));
    await appUseCase.vult();
  },
};
