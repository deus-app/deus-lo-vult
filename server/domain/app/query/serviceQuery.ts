import type { Feedback, Prisma, Service } from '@prisma/client';
import { IDEA_STATUS, SERVICE_STATUS, type ServiceModel } from 'api/@types';
import { z } from 'zod';

const toModel = (
  service: Service & {
    ideas: {
      id: string;
      name: string;
      description: string;
      status: string;
      createdAt: Date;
      feedback: Feedback | null;
    }[];
  }
): ServiceModel => ({
  id: service.id,
  area: service.area,
  name: service.name ?? undefined,
  similarName: service.similarName ?? undefined,
  status: z.enum(SERVICE_STATUS).parse(service.status),
  createdAt: service.createdAt.getTime(),
  ideas: service.ideas.map((idea) => ({
    id: idea.id,
    name: idea.name,
    description: idea.description,
    status: z.enum(IDEA_STATUS).parse(idea.status),
    createdAt: idea.createdAt.getTime(),
    feedback:
      idea.feedback === null
        ? undefined
        : {
            id: idea.feedback.id,
            feedback: idea.feedback.feedback,
            createdAt: idea.feedback.createdAt.getTime(),
          },
  })),
});

export const serviceQuery = {
  countAll: async (tx: Prisma.TransactionClient): Promise<number> => await tx.service.count(),
  findAll: async (tx: Prisma.TransactionClient, limit?: number): Promise<ServiceModel[]> =>
    await tx.service
      .findMany({
        take: limit,
        include: { ideas: { include: { feedback: true } } },
        orderBy: { createdAt: 'desc' },
      })
      .then((services) => services.map(toModel)),
  findAllAreas: async (tx: Prisma.TransactionClient): Promise<string[]> =>
    await tx.service
      .findMany({ select: { area: true }, distinct: ['area'] })
      .then((services) => services.map((s) => s.area)),
};
