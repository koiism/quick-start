import { mergeRouters } from '@libs/trpc';
import { UserRouter } from './user.router';

export const appRouter = mergeRouters(UserRouter);

type AppRouter = typeof appRouter;

export type { AppRouter };
