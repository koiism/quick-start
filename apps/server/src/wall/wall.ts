import { createZListResponse, createZResponse } from 'src/router/zods/common';
import { z } from 'zod';

const zWall = z.object({
  id: z.number().optional(),
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
