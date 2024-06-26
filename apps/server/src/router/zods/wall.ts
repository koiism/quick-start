import { z } from 'zod';
import { createZListResponse, createZResponse } from './common';

const zWall = z.object({
  id: z.number(),
  name: z.string(),
  gymId: z.number(),
  img: z.string(),
});
type TWall = z.infer<typeof zWall>;

const zWallResponse = createZResponse(zWall);
type TWallResponse = z.infer<typeof zWallResponse>;

const zWallListResponse = createZListResponse(zWall);
type TWallListResponse = z.infer<typeof zWallListResponse>;

export { zWall, zWallListResponse, zWallResponse };
export type { TWall, TWallListResponse, TWallResponse };
