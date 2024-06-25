import { procedure, router } from '@libs/trpc';
import { ERROR_CODE, ERROR_MESSAGE, zId, zLocation, zPagination } from '../router/zods/common';
import { TGymListResponse, TGymResponse } from './gym';
import { GymService } from './gym.service';
import { Logger } from '@nestjs/common';

//  查询附近的攀岩馆列表
const getNearbyGymList = procedure
  .input(zLocation.merge(zPagination))
  .query<TGymListResponse>(async ({ ctx, input }) => {
    try {
      const gymService = await ctx.get(GymService);
      const gymNum = await gymService.getTotalGym();
      if (gymNum === 0) {
        return {
          code: ERROR_CODE.FAIL_BUSINESS_ERROR,
          message: ERROR_MESSAGE.FAIL_BUSINESS_ERROR,
        };
      }
      const gyms = await gymService.getNearbyGymList(input.longitude, input.latitude, input.offset, input.size);
      return {
        data: gyms,
        total: gymNum,
        code: ERROR_CODE.SUCCESS,
        message: ERROR_MESSAGE.SUCCESS,
      };
    } catch (error) {
      Logger.error("get nearby gym list failed, location=", input.longitude, input.latitude, error)
      return {
        code: ERROR_CODE.FAIL_SYSTEM_ERROR,
        message: ERROR_MESSAGE.FAIL_SYSTEM_ERROR,
      };
    }
  });


// 查询最近的攀岩馆
const getNearbyGym = procedure
  .input(zLocation)
  .query<TGymResponse>(async ({ ctx, input }) => {
    try {
      const gymService = await ctx.get(GymService);
      const gym = await gymService.getNearbyGymList(input.longitude, input.latitude, 0, 1);
      if (gym.length === 0) {
        return {
          code: ERROR_CODE.FAIL_BUSINESS_ERROR,
          message: ERROR_MESSAGE.FAIL_BUSINESS_ERROR,
        };
      }
      return {
        data: gym[0],
        code: ERROR_CODE.SUCCESS,
        message: ERROR_MESSAGE.SUCCESS,
      };
    } catch (error) {
      Logger.error("get nearby gym failed, location=", input.longitude, input.latitude, error)
      return {
        code: ERROR_CODE.FAIL_SYSTEM_ERROR,
        message: ERROR_MESSAGE.FAIL_SYSTEM_ERROR,
      };
    }
  });


//  查询攀岩馆详情
const getGymDetailById = procedure
  .input(zId.merge(zLocation))
  .query<TGymResponse>(async ({ ctx, input }) => {
    try {
      const gymService = await ctx.get(GymService);
      const gym = await gymService.getGym(input.id, input.longitude, input.latitude);
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
export const GymRouter = router({
  gym: router({
    getNearbyGymList,
    getNearbyGym,
    getGymDetailById,
  }),
});
