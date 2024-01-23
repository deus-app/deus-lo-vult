import assert from 'assert';
import { prismaClient } from 'service/prismaClient';
import { defineController } from './$relay';

export default defineController(() => ({
  post: {
    hooks: {
      preValidation: async (req) => {
        assert(req.jwtUser);

        const user = await prismaClient.user.findUnique({ where: { id: req.jwtUser.sub } });
        if (user !== null) return user;

        const newUser = { id: req.jwtUser.sub, name: req.jwtUser.sub.split('-')[0] };
        await prismaClient.user.upsert({
          where: { id: newUser.id },
          update: { name: newUser.name },
          create: { id: newUser.id, name: newUser.name },
        });
      },
    },
    handler: ({ user }) => ({ status: 200, body: user }),
  },
}));
