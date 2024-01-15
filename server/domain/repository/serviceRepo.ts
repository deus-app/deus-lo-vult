import { prismaClient } from '$/service/prismaClient';

export const serviceRepo = {
  save: async (
    id: string,
    area: string,
    status: 'finished' | 'unfinished',
    name?: string,
    similarName?: string
  ) => {
    await prismaClient.service.upsert({
      where: { id },
      create: { id, area, status, createdAt: new Date() },
      update: { name, similarName, status },
    });
  },
};
