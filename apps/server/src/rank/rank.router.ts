import { procedure, router } from '@libs/trpc';
import { mockRank } from '../router/mock';
import { ERROR_CODE, ERROR_MESSAGE, zId, zPagination } from '../router/zods/common';
import { RANK_TYPE, TRankListResponse, TRankResponse, zRankProperties } from './rank';
import { Logger } from '@nestjs/common';
import { RankService } from './rank.service';

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
  .input(zRankProperties)
  .query<TRankResponse>(async ({ input, ctx }) => {
    const userId = getUserId(ctx);
    if (Number.isNaN(userId)) {
      return {
        code: ERROR_CODE.FAIL_REQUEST_ERROR,
        message: ERROR_MESSAGE.FAIL_REQUEST_ERROR,
      };
    }
    try {
      const rankService = await ctx.get(RankService);

      if (input.type === RANK_TYPE.EXP) {
        const rank = await rankService.getUserExpRankById(userId, input.timeDimension);
        if (rank) {
          return {
            code: ERROR_CODE.SUCCESS,
            message: ERROR_MESSAGE.SUCCESS,
            data: rank,
          }
        } else {
          return {
            code: ERROR_CODE.FAIL_REQUEST_ERROR,
            message: ERROR_MESSAGE.FAIL_REQUEST_ERROR,
          };
        }
      } else {
        return {
          code: ERROR_CODE.FAIL_REQUEST_ERROR,
          message: ERROR_MESSAGE.FAIL_REQUEST_ERROR,
        };
      }
    } catch (error) {
      Logger.error("get user rank by id failed, user id=", userId, error)
      return {
        code: ERROR_CODE.FAIL_SYSTEM_ERROR,
        message: ERROR_MESSAGE.FAIL_SYSTEM_ERROR,
      };
    }
  });

export const RankRouter = router({
  rank: router({
    getRankList,
    getUserRankById,
  }),
});
