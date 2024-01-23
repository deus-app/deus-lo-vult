import type { MultipartFile } from '@fastify/multipart';
import type { TaskEntity, UserEntity } from 'api/@types';
import { taskMethod } from 'domain/task/model/taskMethod';
import { taskRepo } from 'domain/task/repository/taskRepo';
import { s3 } from 'service/s3';

export const taskUseCase = {
  create: async (
    user: UserEntity,
    label: string,
    image: MultipartFile | undefined
  ): Promise<TaskEntity> => {
    const task = taskMethod.create(user, label, image);

    if (image !== undefined && task.image !== undefined) {
      await s3.put(task.image.s3Key, image);
    }

    await taskRepo.save(task);

    return task;
  },
  delete: async (user: UserEntity, taskId: string): Promise<void> => {
    const task = await taskRepo.findByIdOrThrow(taskId);
    const deletableTaskId = taskMethod.deleteOrThrow(user, task);

    await taskRepo.delete(deletableTaskId);
  },
  update: async (
    user: UserEntity,
    taskId: string,
    done: boolean,
    label: string
  ): Promise<TaskEntity> => {
    const task = await taskRepo.findByIdOrThrow(taskId);
    const newTask = taskMethod.updateOrThrow(user, task, { done, label });

    await taskRepo.save(newTask);

    return newTask;
  },
};
