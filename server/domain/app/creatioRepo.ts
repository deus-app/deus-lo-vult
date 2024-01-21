import { CREATIO_API_ORIGIN, DEUS_LO_VULT_TOKEN } from '../../service/envValues';

export const creatioRepo = {
  post: async (body: string): Promise<void> => {
    await fetch(`${CREATIO_API_ORIGIN}/api/deus`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${DEUS_LO_VULT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body,
    }).catch((e) => console.error(e));
  },
};
