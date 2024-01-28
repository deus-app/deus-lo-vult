import { serviceQuery } from 'domain/app/query/serviceQuery';
import { prismaClient } from 'service/prismaClient';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ query }) => ({
    status: 200,
    body: await serviceQuery.findAll(prismaClient, query?.limit),
  }),
}));
