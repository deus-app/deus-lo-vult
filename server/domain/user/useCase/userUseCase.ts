import type { User } from 'api/@types';
import type { JwtUser } from 'domain/user/model/userMethod';
import { userMethod } from 'domain/user/model/userMethod';
import { userRepo } from 'domain/user/repository/userRepo';

export const userUseCase = {
  findOrCreate: async (jwtUser: JwtUser): Promise<User> => {
    const user = await userRepo.findById(jwtUser.sub);
    if (user !== null) return user;

    const newUser = userMethod.create(jwtUser);
    await userRepo.save(newUser);

    return newUser;
  },
};
