import { procedure, router } from '@libs/trpc';
import { ERROR_CODE, ERROR_MESSAGE, zId } from '../router/zods/common';
import { TWallListResponse, TWallResponse, zWall } from './wall';
import { WallService } from './wall.service';
import { Logger } from '@nestjs/common';

// 获取当前岩馆的所有岩壁
const getWallsByGymId = procedure
  .input(zId)
  .query<TWallListResponse>(async ({ input, ctx }) => {
    try {
      const wallService = await ctx.get(WallService);
      return {
        data: await wallService.getAllByGymId(input.id),
        code: ERROR_CODE.SUCCESS,
        message: ERROR_MESSAGE.SUCCESS,
      }
    } catch (error) {
      Logger.error("get walls by gym id fail, gym id=", input.id);
      return {
        code: ERROR_CODE.FAIL_SYSTEM_ERROR,
        message: ERROR_MESSAGE.FAIL_SYSTEM_ERROR,
      }
    }
  });

// 保存岩壁
const saveWall = procedure
  .input(zWall)
  .query<TWallResponse>(async ({ input, ctx }) => {
    try {
      const wallService = await ctx.get(WallService);
      return {
        data: await wallService.save(input),
        code: ERROR_CODE.SUCCESS,
        message: ERROR_MESSAGE.SUCCESS,
      };
    } catch (error) {
      Logger.error("save wall fail, wall=", input.id);
      return {
        code: ERROR_CODE.FAIL_SYSTEM_ERROR,
        message: ERROR_MESSAGE.FAIL_SYSTEM_ERROR,
      };
    }
  });

export const WallRouter = router({
  wall: router({
    getWallsByGymId,
    saveWall,
  }),
});
