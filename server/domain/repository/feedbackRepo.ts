import { prismaClient } from '$/service/prismaClient';

export const feedbackRepo = {
  save: async (id: string, feedback: string, ideaId: string) => {
    await prismaClient.feedback.create({
      data: {
        id,
        feedback,
        createdAt: new Date(),
        ideaId,
      },
    });
  },
};
