import { createZListResponse, createZResponse } from 'src/router/zods/common';
import { zUser } from 'src/user/user';
import { z } from 'zod';

enum RANK_TYPE {
  EXP,
}
const zRankType = z.nativeEnum(RANK_TYPE);

enum RANK_TIME_DIMENSION {
  DAY,
  MONTH,
  YEAR,
  ALL,
}
const zRankTimeDimension = z.nativeEnum(RANK_TIME_DIMENSION);

const zRankProperties = z.object({
  type: zRankType,
  timeDimension: zRankTimeDimension,
});
type TRankProperties = z.infer<typeof zRankProperties>;

const zRank = z.object({
  user: zUser,
  exp: z.number(),
  rank: z.number()
});
type TRank = z.infer<typeof zRank>;

const zRankResponse = createZResponse(zRank);
type TRankResponse = z.infer<typeof zRankResponse>;

const zRankListResponse = createZListResponse(zRank);
type TRankListResponse = z.infer<typeof zRankListResponse>;

export {
  RANK_TYPE,
  zRankType,
  RANK_TIME_DIMENSION,
  zRankProperties,
  zRankTimeDimension,
  zRank,
  zRankListResponse,
  zRankResponse,
};
export type { TRank, TRankListResponse, TRankResponse, TRankProperties };