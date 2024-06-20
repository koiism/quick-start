import { mergeRouters } from '@libs/trpc';
import { UserRouter } from './user.router';
import { GymRouter } from './gym.router';

export const appRouter = mergeRouters(UserRouter, GymRouter);

type AppRouter = typeof appRouter;

export type { AppRouter };
