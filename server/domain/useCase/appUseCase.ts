import { creatioRepo } from '../repository/creatioRepo';
import { llmRepo } from '../repository/llm/llmRepo';

export const appUseCase = {
  vult: async () => {
    console.log('vult');
    const serviceIdea = await llmRepo.initConversation();
    await creatioRepo.post(JSON.stringify(serviceIdea));
  },
};
