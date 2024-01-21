import type { User as PrismaUser } from '@prisma/client';
import { prismaClient } from 'service/prismaClient';
import type { User } from '../../../api/@types';

const toModel = (prismaUser: PrismaUser): User => ({
  id: prismaUser.id,
  email: prismaUser.email,
  name: prismaUser.name,
});

export const userRepo = {
  save: async (user: User): Promise<void> => {
    await prismaClient.user.upsert({
      where: { id: user.id },
      update: { email: user.email, name: user.name },
      create: { id: user.id, email: user.email, name: user.name },
    });
  },
  findById: (userId: string): Promise<User | null> =>
    prismaClient.user
      .findUnique({ where: { id: userId } })
      .then((user) => (user !== null ? toModel(user) : null)),
};
