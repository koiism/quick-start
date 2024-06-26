import { z } from 'zod';
import { zUser } from '../../user/user';
import { createZResponse, createZListResponse } from './common';
import { zWall } from 'src/wall/wall';

enum ROUTE_LEVEL {
  V0,
  V1,
  V2,
  V3,
  V4,
  V5,
  V6,
  V7,
  V8,
  V9,
}

enum WALL_ANGLE {
  SLAB, // 俯角
  VERTICAL,
  OVERHANG, // 仰角
  ROOF,
  ARETES, // 边角
}

enum ROUTE_STYLE {
  DYNO, // 动态
  POWER, // 力量
  BALANCE, // 平衡
  CRIMP, // 指力
  POCKET, // 指洞
  SLOPEY, // 开放点
}

enum HOLD_TYPE {
  START_END,
  HAND,
  FOOT,
}

const zRouteLevel = z.nativeEnum(ROUTE_LEVEL);

const zWallAngle = z.nativeEnum(WALL_ANGLE);

const zRouteStyle = z.nativeEnum(ROUTE_STYLE);

const zHoldType = z.nativeEnum(HOLD_TYPE);


const zRouteBase = z.object({
  id: z.number(),
  name: z.string(),
  gymId: z.number(),
  wallAngle: zWallAngle,
  style: z.array(zRouteStyle),
  routeLevel: zRouteLevel,
  hold: z.array(z.object({
    x: z.number(),
    y: z.number(),
    size: z.number(),
    type: zHoldType,
  }))
});

const zRouteResult = zRouteBase.merge(z.object({
  favoriteNum: z.number(),
  finishNum: z.number(),
  creator: zUser,
  wall: zWall,
}));

const zRouteRequest = zRouteBase.merge(z.object({
  wallId: z.number(),
  creatorId: z.number()
}));

type TRouteRequest = z.infer<typeof zRouteRequest>;
type TRoute = z.infer<typeof zRouteResult>;

const zRouteResponse = createZResponse(zRouteResult);
type TRouteResponse = z.infer<typeof zRouteResponse>;

const zRouteListResponse = createZListResponse(zRouteResult);
type TRouteListResponse = z.infer<typeof zRouteListResponse>;

export {
  ROUTE_LEVEL,
  WALL_ANGLE,
  ROUTE_STYLE,
  HOLD_TYPE,
  zRouteLevel,
  zWallAngle,
  zRouteStyle,
  zRouteRequest,
  zRouteResult,
  zRouteResponse,
  zRouteListResponse,
};

export type { TRoute, TRouteRequest, TRouteResponse, TRouteListResponse };
