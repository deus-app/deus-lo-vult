import type { Feedback, Prisma, Service } from '@prisma/client';

import type { ServiceModel } from 'api/@types';
import { IDEA_STATUS, SERVICE_STATUS } from 'api/@types';
import { z } from 'zod';
import { prismaClient } from '../../service/prismaClient';

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

export const serviceRepo = {
  save: async (
    id: string,
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
  findAll: (tx: Prisma.TransactionClient, limit?: number): Promise<ServiceModel[]> =>
    tx.service
      .findMany({
        take: limit,
        include: { ideas: { include: { feedback: true } } },
        orderBy: { createdAt: 'desc' },
      })
      .then((services) => services.map(toModel)),
};
