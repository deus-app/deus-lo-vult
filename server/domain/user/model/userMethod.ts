import type { User } from 'api/@types';

export type JwtUser = { sub: string; role: 'authenticated' | 'anon' };

export const userMethod = {
  create: (jwtUser: JwtUser): User => {
    return {
      id: jwtUser.sub,
      name: jwtUser.sub.split('-')[0],
    };
  },
};
