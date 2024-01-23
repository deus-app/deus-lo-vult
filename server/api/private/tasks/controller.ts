import { taskUseCase } from 'domain/task/useCase/taskUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  post: async ({ user, body }) => ({
    status: 201,
    body: await taskUseCase.create(user, body.label, body.image),
  }),
  patch: async ({ user, body }) => {
    const task = await taskUseCase.update(user, body.taskId, body.done, body.label);

    return { status: 204, body: task };
  },
  delete: async ({ user, body }) => {
    await taskUseCase.delete(user, body.taskId);

    return { status: 204 };
  },
}));
