import { z } from 'zod';
import { createZResponse } from './common';
import { zRouteLevel } from './route';

const zUser = z.object({
  id: z.number(),
  name: z.string(),
  avatar: z.string(),
});
type TUser = z.infer<typeof zUser>;

const zLogin = z.object({
  code: z.string(),
});
type TLogin = z.infer<typeof zLogin>;

const zAchievement = z.object({
  climbingDays: z.number(),
  exp: z.number(),
  unlockedGymNum: z.number(),
  betaNum: z.number(),
  sendNum: z.number(),
  topLevelBoulder: zRouteLevel,
  setNum: z.number(),
  topLevelSet: zRouteLevel,
});
type TAchievement = z.infer<typeof zAchievement>;

const zUserResponse = createZResponse(zUser);
type TUserResponse = z.infer<typeof zUserResponse>;

const zAchievementResponse = createZResponse(zAchievement);
type TAchievementResponse = z.infer<typeof zAchievementResponse>;

export { zUser, zLogin, zUserResponse, zAchievement, zAchievementResponse };

export type {
  TUser,
  TLogin,
  TUserResponse,
  TAchievement,
  TAchievementResponse,
};
