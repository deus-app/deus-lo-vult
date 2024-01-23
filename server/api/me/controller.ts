import assert from 'assert';
import { userUseCase } from 'domain/user/useCase/userUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  post: {
    hooks: {
      preValidation: async (req) => {
        assert(req.jwtUser);

        await userUseCase.findOrCreate(req.jwtUser);
      },
    },
    handler: ({ user }) => ({ status: 200, body: user }),
  },
}));
