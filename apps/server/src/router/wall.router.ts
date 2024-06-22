import { procedure, router } from '@libs/trpc';
import { mockWall } from './mock';
import { zId } from './zods/common';
import { TWallListResponse, TWallResponse, zWall } from './zods/wall';

// 获取当前岩馆的所有岩壁
const getWallsByGymId = procedure
  .input(zId)
  .query<TWallListResponse>(async ({ input, ctx }) => {
    input;
    ctx;
    return {
      data: [mockWall],
      total: 1,
      code: 0,
      message: 'ok',
    };
  });

// 获取当前岩馆的所有岩壁
const createNewWall = procedure
  .input(zWall)
  .query<TWallResponse>(async ({ input, ctx }) => {
    input;
    ctx;
    return {
      data: mockWall,
      total: 1,
      code: 0,
      message: 'ok',
    };
  });

export const WallRouter = router({
  wall: router({
    getWallsByGymId,
    createNewWall,
  }),
});
