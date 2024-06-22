import { procedure, router } from '@libs/trpc';
import { zId, zPagination } from './zods/common';
import { TRouteListResponse, TRouteResponse, zRoute } from './zods/route';
import { mockRoute } from './mock';

// 获取岩馆7天内最受欢迎的线路
const getPopularRoutesOfGym = procedure
  .input(zId)
  .query<TRouteListResponse>(async ({ input, ctx }) => {
    input;
    ctx;
    return {
      data: [mockRoute],
      total: 1,
      code: 0,
      message: 'ok',
    };
  });

// 获取岩馆所有线路 带分页
const getRoutesOfGym = procedure
  .input(zId.merge(zPagination))
  .query<TRouteListResponse>(async ({ input, ctx }) => {
    input;
    ctx;
    return {
      data: [mockRoute],
      total: 1,
      code: 0,
      message: 'ok',
    };
  });

// 新增线路
const createNewRoute = procedure
  .input(zRoute)
  .mutation<TRouteResponse>(async ({ input, ctx }) => {
    input;
    ctx;
    return {
      data: mockRoute,
      code: 0,
      message: 'ok',
    };
  });

// 获取当前用户所有完攀线路 带分页
const getSendedRoutesByUserId = procedure
  .input(zId.merge(zPagination))
  .query<TRouteListResponse>(async ({ input, ctx }) => {
    input;
    ctx;
    return {
      data: [mockRoute],
      total: 1,
      code: 0,
      message: 'ok',
    };
  });

// 获取当前用户所有定线 带分页
const getSettledRoutesByUserId = procedure
  .input(zId.merge(zPagination))
  .query<TRouteListResponse>(async ({ input, ctx }) => {
    input;
    ctx;
    return {
      data: [mockRoute],
      total: 1,
      code: 0,
      message: 'ok',
    };
  });

// 获取当前用户所有线路收藏 带分页
const getFavoriteRoutesByUserId = procedure
  .input(zId.merge(zPagination))
  .query<TRouteListResponse>(async ({ input, ctx }) => {
    input;
    ctx;
    return {
      data: [mockRoute],
      total: 1,
      code: 0,
      message: 'ok',
    };
  });

export const RouteRouter = router({
  route: router({
    getPopularRoutesOfGym,
    getRoutesOfGym,
    createNewRoute,
    getSendedRoutesByUserId,
    getSettledRoutesByUserId,
    getFavoriteRoutesByUserId,
  }),
});
