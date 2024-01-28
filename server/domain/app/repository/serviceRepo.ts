import { prismaClient } from '../../../service/prismaClient';

export const serviceRepo = {
  save: async (
    id: number,
    area: string,
    status: 'finished' | 'unfinished',
    name?: string,
    similarName?: string
  ): Promise<void> => {
    await prismaClient.service.upsert({
      where: { id },
      create: { id, area, status, createdAt: new Date() },
      update: { name, similarName, status },
    });
  },
};
