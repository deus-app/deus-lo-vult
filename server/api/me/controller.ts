import type { UserEntity } from 'api/@types';
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

        const newUser: UserEntity = {
          id: req.jwtUser.sub,
          name: req.jwtUser.user_metadata.name,
          photoURL: req.jwtUser.user_metadata.avatar_url,
        };

        await prismaClient.user.upsert({
          where: { id: newUser.id },
          update: { name: newUser.name, photoURL: newUser.photoURL },
          create: newUser,
        });
      },
    },
    handler: ({ user }) => ({ status: 200, body: user }),
  },
}));
