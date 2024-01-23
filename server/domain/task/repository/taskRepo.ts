import type { Task, User } from '@prisma/client';
import type { TaskModel } from 'api/@types';
import type { DeletableTaskId } from 'domain/task/model/taskMethod';
import { S3_PREFIX } from 'service/constants';
import { prismaClient } from 'service/prismaClient';

const toModel = (task: Task & { User: User }): TaskModel => ({
  id: task.id,
  label: task.label,
  done: task.done,
  createdTime: task.createdAt.getTime(),
  image:
    task.imageKey === null
      ? undefined
      : { url: `${S3_PREFIX}${task.imageKey}`, s3Key: task.imageKey },
  author: { userId: task.userId, name: task.User.name },
});

export const taskRepo = {
  save: async (task: TaskModel): Promise<void> => {
    await prismaClient.task.upsert({
      where: { id: task.id },
      update: { done: task.done, label: task.label, imageKey: task.image?.s3Key },
      create: {
        id: task.id,
        userId: task.author.userId,
        done: task.done,
        label: task.label,
        imageKey: task.image?.s3Key,
        createdAt: new Date(task.createdTime),
      },
    });
  },
  delete: async (deletableTaskId: DeletableTaskId): Promise<void> => {
    await prismaClient.task.delete({ where: { id: deletableTaskId.val } });
  },
  findAll: (limit?: number): Promise<TaskModel[]> =>
    prismaClient.task
      .findMany({ take: limit, include: { User: true }, orderBy: { createdAt: 'desc' } })
      .then((tasks) => tasks.map(toModel)),
  findByIdOrThrow: (taskId: string): Promise<TaskModel> =>
    prismaClient.task
      .findUniqueOrThrow({ where: { id: taskId }, include: { User: true } })
      .then(toModel),
};
