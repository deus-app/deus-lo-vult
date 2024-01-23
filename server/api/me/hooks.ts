import type { User } from 'api/@types';
import assert from 'assert';
import type { JWT_PROP_NAME } from 'service/constants';
import { prismaClient } from 'service/prismaClient';
import { defineHooks } from './$relay';

export type AdditionalRequest = {
  [Key in typeof JWT_PROP_NAME]: { sub: string; role: 'authenticated' | 'anon' };
} & { user: User };

export default defineHooks(() => ({
  onRequest: async (req, res) => {
    try {
      await req.jwtVerify({ onlyCookie: true });
    } catch (e) {
      res.status(401).send();
      return;
    }
  },
  preHandler: async (req, res) => {
    assert(req.jwtUser);

    const user = await prismaClient.user.findUnique({ where: { id: req.jwtUser.sub } });

    if (user === null) {
      res.status(401).send();
      return;
    }

    req.user = user;
  },
}));
