import type { User } from 'api/@types';
import { prismaClient } from 'service/prismaClient';

export const userRepo = {
  save: async (user: User): Promise<void> => {
    await prismaClient.user.upsert({
      where: { id: user.id },
      update: { name: user.name },
      create: { id: user.id, name: user.name },
    });
  },
  findById: (userId: string): Promise<User | null> =>
    prismaClient.user.findUnique({ where: { id: userId } }),
};
