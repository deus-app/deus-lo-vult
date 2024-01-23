import type { MultipartFile } from '@fastify/multipart';
import type { TaskEntity, UserEntity } from 'api/@types';
import { randomUUID } from 'crypto';
import { S3_PREFIX } from 'service/constants';

const dataToUrl = (data: MultipartFile): { url: string; s3Key: string } => {
  const s3Key = `tasks/images/${randomUUID()}.${data.filename.split('.').at(-1)}`;

  return { url: `${S3_PREFIX}${s3Key}`, s3Key };
};

export type DeletableTaskId = { type: 'DeletableTask'; val: string };

export const taskMethod = {
  create: (user: UserEntity, label: string, data: MultipartFile | undefined): TaskEntity => ({
    id: randomUUID(),
    done: false,
    label,
    image: data === undefined ? undefined : dataToUrl(data),
    createdTime: Date.now(),
    author: user,
  }),
  deleteOrThrow: (user: UserEntity, task: TaskEntity): DeletableTaskId => {
    if (user.id !== task.author.id) throw new Error('cannot delete');

    return { type: 'DeletableTask', val: task.id };
  },
  updateOrThrow: (
    user: UserEntity,
    task: TaskEntity,
    updateData: { done: boolean; label: string }
  ): TaskEntity => {
    if (user.id !== task.author.id) throw new Error('cannot update task');

    return { ...task, ...updateData };
  },
};
