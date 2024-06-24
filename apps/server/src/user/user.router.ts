import { procedure, router } from '@libs/trpc';
import { TAchievementResponse, TUserResponse, zLogin } from './user';
import { mockAchievement } from '../router/mock';
import { ERROR_CODE, ERROR_MESSAGE } from '../router/zods/common';
import { UserService } from './user.service';
import { Logger } from '@nestjs/common';

//  传入微信小程序code, 返回用户id
const login = procedure.input(zLogin).query<TUserResponse>(async ({ ctx, input }) => {
  const userService = await ctx.get(UserService);
  const user = await userService.login(input.code);
  return {
    code: ERROR_CODE.SUCCESS,
    message: ERROR_MESSAGE.SUCCESS,
    data: user,
  };
});

function getUserId(ctx): number {
  if (!ctx.req.headers["mie-mie-shi-zhu-cheng"]?.length) {
    return Number.NaN;
  }
  return Number(ctx.req.headers["mie-mie-shi-zhu-cheng"]);
}

//  通过Header获取用户头像用户名信息
const getUserInfo = procedure.query<TUserResponse>(async ({ ctx }) => {
  const userId = getUserId(ctx);
  if (Number.isNaN(userId)) {
    return {
      code: ERROR_CODE.FAIL_INVALID_REQUEST,
      message: ERROR_MESSAGE.FAIL_INVALID_REQUEST,
    };
  }

  try {
    const userService = await ctx.get(UserService);
    const user = await userService.getUserInfo(userId);
    if (user) {
      return {
        code: ERROR_CODE.SUCCESS,
        message: ERROR_MESSAGE.SUCCESS,
        data: user,
      };
    } else {
      return {
        code: ERROR_CODE.FAIL_INTERNAL_ERROR,
        message: ERROR_MESSAGE.FAIL_INTERNAL_ERROR,
      };
    }
  } catch (error) {
    Logger.error("get user info failed, user id=", userId, error)
    return {
      code: ERROR_CODE.FAIL_INTERNAL_ERROR,
      message: ERROR_MESSAGE.FAIL_INTERNAL_ERROR,
    };
  }
});

//  获取用户的成就信息
const getAchievement = procedure.query<TAchievementResponse>(() => {
  return {
    code: ERROR_CODE.SUCCESS,
    message: ERROR_MESSAGE.SUCCESS,
    data: mockAchievement,
  };
});
export const UserRouter = router({
  user: router({
    login,
    getUserInfo,
    getAchievement,
  }),
});
