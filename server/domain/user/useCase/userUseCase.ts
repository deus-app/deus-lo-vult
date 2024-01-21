import type { User } from 'api/@types';
import type { JwtUser } from '../model/userModel';
import { userModel } from '../model/userModel';
import { userRepo } from '../repository/userRepo';

export const userUseCase = {
  findOrCreate: async (jwtUser: JwtUser): Promise<User> => {
    const user = await userRepo.findById(jwtUser.sub);
    if (user !== null) return user;

    const newUser = userModel.create(jwtUser);
    await userRepo.save(newUser);

    return newUser;
  },
};
