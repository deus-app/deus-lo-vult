import { llmRepo } from 'domain/llm/llmRepo';
import { creatioRepo } from '../repository/creatioRepo';

export const appUseCase = {
  vult: async (): Promise<void> => {
    const serviceIdea = await llmRepo.initConversation();
    await creatioRepo.post(JSON.stringify(serviceIdea));
    await appUseCase.vult();
  },
};
