import type { User } from 'api/@types';
import assert from 'assert';
import type { JwtUser } from 'domain/user/model/userMethod';
import { userRepo } from 'domain/user/repository/userRepo';
import type { JWT_PROP_NAME } from 'service/constants';
import { defineHooks } from './$relay';

export type AdditionalRequest = {
  [Key in typeof JWT_PROP_NAME]: JwtUser;
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

    const user = await userRepo.findById(req.jwtUser.sub);

    if (user === null) {
      res.status(401).send();
      return;
    }

    req.user = user;
  },
}));
