import { TGym } from '../zods/gym';
import { TRank } from '../zods/rank';
import { ROUTE_LEVEL, ROUTE_STYLE, TRoute, WALL_ANGLE } from '../zods/route';
import { TAchievement, TUser } from '../zods/user';
import { TWall } from '../zods/wall';

export const mockGym: TGym = {
  id: 1,
  name: 'mock gym',
  address: 'mock address',
  phone: '17726062961',
  distance: '837m',
  boulderNum: 12,
};

export const mockRoute: TRoute = {
  id: 1,
  name: 'mock route',
  description: '',
  gymId: 1,
  routeLevel: ROUTE_LEVEL.V0,
  finishNum: 9,
  creator: {
    id: 1,
    name: 'mock creator',
    avatar: 'https://avatars.githubusercontent.com/u/100000000?v=4',
  },
  wallAngle: WALL_ANGLE.ROOF,
  style: [ROUTE_STYLE.DYNO],
};

export const mockUser: TUser = {
  id: 1,
  name: '咩咩',
  avatar: 'https://avatars.githubusercontent.com/u/100000000?v=4',
};

export const mockAchievement: TAchievement = {
  climbingDays: 1,
  exp: 1,
  unlockedGymNum: 1,
  betaNum: 1,
  sendNum: 1,
  topLevelBoulder: ROUTE_LEVEL.V0,
  setNum: 1,
  topLevelSet: ROUTE_LEVEL.V0,
};

export const mockWall: TWall = {
  id: '1',
  name: 'mock wall',
  gymId: '1',
  img: 'https://avatars.githubusercontent.com/u/100000000?v=4',
};

export const mockRank: TRank = {
  user: {
    id: 1,
    name: '咩咩',
    avatar: 'https://avatars.githubusercontent.com/u/100000000?v=4',
  },
  exp: 1,
};
