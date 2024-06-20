import { procedure, router } from '@libs/trpc';
import { GreetingService } from '../service/greeting.service';
import { z } from 'zod';

export const UserRouter = router({
  user: router({
    greeting: procedure
      .input(
        z.object({
          name: z.string(),
        }),
      )
      .query(async ({ ctx, input }) => {
        const greeting = await ctx.inject(GreetingService);
        ctx.req.headers.cookie?.split('')
        return greeting.getHello(input.name);
      }),

    //  传入微信小程序code, 返回用户id
    login: procedure
      .input(
        z.object({
          code: z.string()
        })
      ).query(() => {

      }),
    //  获取用户头像用户名信息
    getUserInfo: procedure.query(() => {
      type TUserInfo = {
        userName: string,
        avatarUrl: string
      }
      const userInfo: TUserInfo = {
        userName: '',
        avatarUrl: ''
      };
      return userInfo;
    }),

    //  获取用户的成就信息
    getAchievement: procedure.query(() => {
      type TAchievement = {
        achievementName: string,
        achievementDesc: string,
        achievementImg: string
      }
      const achievement: TAchievement = {
        achievementName: '',
        achievementDesc: '',
        achievementImg: ''
      };
      return achievement;
    })
  }),
});
