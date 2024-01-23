import { taskRepo } from 'domain/task/repository/taskRepo';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ query }) => ({
    status: 200,
    body: await taskRepo.findAll(query?.limit),
  }),
}));
