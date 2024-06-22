import { mockGym } from './mock';
import { procedure, router } from '@libs/trpc';
import { zId, zLocation, zPagination } from './zods/common';
import { TGymListResponse, TGymResponse } from './zods/gym';

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
  .query<TGymResponse>(async ({ input }) => {
    input;
    const result: TGymResponse = {
      data: mockGym,
      code: 0,
      message: 'ok',
    };
    return result;
  });
//  查询攀岩馆详情
const getGymDetailById = procedure
  .input(zId)
  .query<TGymResponse>(async ({ input }) => {
    input;
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
