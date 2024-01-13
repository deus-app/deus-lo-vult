import { llmRepo } from '../repository/llm/llmRepo';

export const appUseCase = {
  vult: async () => {
    const serviceIdea = llmRepo.initConversation();
    console.log(serviceIdea);
  },
};
