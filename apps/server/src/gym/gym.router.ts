import { mockGym } from '../router/mock';
import { procedure, router } from '@libs/trpc';
import { ERROR_CODE, ERROR_MESSAGE, zId, zLocation, zPagination } from '../router/zods/common';
import { TGymListResponse, TGymResponse } from './gym';
import { GymService } from './gym.service';
import { TUserResponse } from 'src/user/user';
import { Logger } from '@nestjs/common';

//  查询附近的攀岩馆列表
const getNearbyGymList = procedure
  .input(zLocation.merge(zPagination))
  .query<TGymListResponse>(async ({ input }) => {
    input;
    const result: TGymListResponse = {
      data: [mockGym],
      total: 1,
      code: 0,
      message: 'ok',
    };
    return result;
  });
// 查询最近的攀岩馆
const getNearbyGym = procedure
  .input(zLocation)
  .query<TUserResponse>(async ({ ctx, input }) => {
    const gymService = await ctx.get(GymService);
  });
//  查询攀岩馆详情
const getGymDetailById = procedure
  .input(zId)
  .query<TGymResponse>(async ({ ctx, input }) => {

    try {
      const gymService = await ctx.get(GymService);
      const gym = await gymService.getGym(input.id);
      if (gym) {
        return {
          data: gym,
          code: ERROR_CODE.SUCCESS,
          message: ERROR_MESSAGE.SUCCESS,
        };
      } else {
        return {
          code: ERROR_CODE.FAIL_BUSINESS_ERROR,
          message: ERROR_MESSAGE.FAIL_BUSINESS_ERROR,
        };
      }
    } catch (error) {
      Logger.error("get gym detail by id failed, id=", input.id, error)
      return {
        code: ERROR_CODE.FAIL_SYSTEM_ERROR,
        message: ERROR_MESSAGE.FAIL_SYSTEM_ERROR,
      };
    }
  });

const result: TGymResponse = {
  data: mockGym,
  code: 0,
  message: 'ok',
};
return result;
  });
export const GymRouter = router({
  gym: router({
    getNearbyGymList,
    getNearbyGym,
    getGymDetailById,
  }),
});
