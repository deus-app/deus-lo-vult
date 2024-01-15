import { prismaClient } from '$/service/prismaClient';

export const ideaRepo = {
  save: async (
    id: string,
    name: string,
    description: string,
    status: 'complete' | 'incomplete',
    serviceId: string
  ) => {
    await prismaClient.idea.create({
      data: {
        id,
        name,
        description,
        status,
        createdAt: new Date(),
        serviceId,
      },
    });
  },
};
