import { z } from 'zod';
import { zUser } from '../../user/user';
import { createZResponse, createZListResponse } from './common';

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

const zRouteLevel = z.nativeEnum(ROUTE_LEVEL);

const zWallAngle = z.nativeEnum(WALL_ANGLE);

const zRouteStyle = z.nativeEnum(ROUTE_STYLE);

const zRoute = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  gymId: z.number(),
  routeLevel: zRouteLevel,
  finishNum: z.number().optional(),
  creator: zUser,
  wallAngle: zWallAngle,
  style: z.array(zRouteStyle),
});
type TRoute = z.infer<typeof zRoute>;

const zRouteResponse = createZResponse(zRoute);
type TRouteResponse = z.infer<typeof zRouteResponse>;

const zRouteListResponse = createZListResponse(zRoute);
type TRouteListResponse = z.infer<typeof zRouteListResponse>;

export {
  ROUTE_LEVEL,
  WALL_ANGLE,
  ROUTE_STYLE,
  zRouteLevel,
  zWallAngle,
  zRouteStyle,
  zRoute,
  zRouteResponse,
  zRouteListResponse,
};

export type { TRoute, TRouteResponse, TRouteListResponse };
