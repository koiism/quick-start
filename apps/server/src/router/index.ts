import { mergeRouters } from '@libs/trpc';
import { UserRouter } from '../user/user.router';
import { GymRouter } from '../gym/gym.router';
import { RouteRouter } from './route.router';
import { RankRouter } from './rank.router';
import { WallRouter } from './wall.router';

export const appRouter = mergeRouters(
  UserRouter,
  RouteRouter,
  GymRouter,
  RankRouter,
  WallRouter,
);

type AppRouter = typeof appRouter;

export type { AppRouter };
