import { procedure, router } from '@libs/trpc';
import { mockRank } from './mock';
import { zId, zPagination } from './zods/common';
import { TRankListResponse, TRankResponse, zRankProperties } from './zods/rank';

// 获取排行榜信息 带分页
const getRankList = procedure
  .input(zRankProperties.merge(zPagination))
  .query<TRankListResponse>(async ({ input, ctx }) => {
    input;
    ctx;
    return {
      data: [mockRank],
      total: 1,
      code: 0,
      message: 'ok',
    };
  });

// 获取当前用户排行信息
const getUserRankById = procedure
  .input(zId)
  .query<TRankResponse>(async ({ input, ctx }) => {
    input;
    ctx;
    return {
      data: mockRank,
      total: 1,
      code: 0,
      message: 'ok',
    };
  });

export const RankRouter = router({
  rank: router({
    getRankList,
    getUserRankById,
  }),
});
