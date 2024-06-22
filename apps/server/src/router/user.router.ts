import { procedure, router } from '@libs/trpc';
import { TAchievementResponse, TUserResponse, zLogin } from './zods/user';
import { mockAchievement, mockUser } from './mock';
import { ERROR_CODE, ERROR_MESSAGE } from './zods/common';

//  传入微信小程序code, 返回用户id
const login = procedure.input(zLogin).query<TUserResponse>(() => {
  return {
    code: ERROR_CODE.SUCCESS,
    message: ERROR_MESSAGE.SUCCESS,
    data: mockUser,
  };
});

//  通过cookie获取用户头像用户名信息
const getUserInfo = procedure.query<TUserResponse>(() => {
  return {
    code: ERROR_CODE.SUCCESS,
    message: ERROR_MESSAGE.SUCCESS,
    data: mockUser,
  };
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
