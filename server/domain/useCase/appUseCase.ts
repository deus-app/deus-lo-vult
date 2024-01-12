import { llmRepo } from '../repository/llm/llmRepo';

export const appUseCase = {
  vult: () => {
    llmRepo.initConversation();
  },
};
