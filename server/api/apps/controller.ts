import { serviceRepo } from '$/domain/repository/serviceRepo';
import { prismaClient } from '$/service/prismaClient';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ query }) => ({
    status: 200,
    body: await serviceRepo.findAll(prismaClient, query?.limit),
  }),
}));