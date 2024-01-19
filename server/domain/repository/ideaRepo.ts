import { prismaClient } from '$/service/prismaClient';

export const ideaRepo = {
  save: async (
    id: string,
    name: string,
    description: string,
    status: 'complete' | 'incomplete' | 'unreceived',
    serviceId: string
  ) => {
    await prismaClient.idea.upsert({
      where: { id },
      create: {
        id,
        name,
        description,
        status,
        createdAt: new Date(),
        serviceId,
      },
      update: {status}
    });
  },
};
