import type { MultipartFile } from '@fastify/multipart';
import type { TaskModel, User } from '../../../api/@types';
import { s3 } from '../../../service/s3';
import { taskModel } from '../model/taskModel';
import { taskRepo } from '../repository/taskRepo';

export const taskUseCase = {
  create: async (
    user: User,
    label: string,
    image: MultipartFile | undefined
  ): Promise<TaskModel> => {
    const task = taskModel.create(user, label, image);

    if (image !== undefined && task.image !== undefined) {
      await s3.put(task.image.s3Key, image);
    }

    await taskRepo.save(task);

    return task;
  },
  delete: async (user: User, taskId: string): Promise<void> => {
    const task = await taskRepo.findByIdOrThrow(taskId);
    const deletableTaskId = taskModel.deleteOrThrow(user, task);

    await taskRepo.delete(deletableTaskId);
  },
  update: async (user: User, taskId: string, done: boolean, label: string): Promise<TaskModel> => {
    const task = await taskRepo.findByIdOrThrow(taskId);
    const newTask = taskModel.updateOrThrow(user, task, { done, label });

    await taskRepo.save(newTask);

    return newTask;
  },
};
