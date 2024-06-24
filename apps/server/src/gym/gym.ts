import { z } from 'zod';
import { createZListResponse, createZResponse, zLocation } from '../router/zods/common';

const zGym = z.object({
  id: z.number(),
  name: z.string(),
  location: zLocation,
  phone: z.string(),
  distance: z.string(),
  boulderNum: z.number(),
});
type TGym = z.infer<typeof zGym>;

const zGymResponse = createZResponse(zGym);
type TGymResponse = z.infer<typeof zGymResponse>;

const zGymListResponse = createZListResponse(zGym);
type TGymListResponse = z.infer<typeof zGymListResponse>;

export { zGym, zGymResponse, zGymListResponse };

export type { TGym, TGymResponse, TGymListResponse };
