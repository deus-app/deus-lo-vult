import type { User } from '../../../api/@types';

export type JwtUser = { sub: string; email: string; role: 'authenticated' | 'anon' };

export const userModel = {
  create: (jwtUser: JwtUser): User => {
    return {
      id: jwtUser.sub,
      email: jwtUser.email,
      name: jwtUser.sub.split('-')[0],
    };
  },
};
