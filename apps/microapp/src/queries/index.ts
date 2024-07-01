import { createTRPCProxyClient, loggerLink } from '@trpc/client';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import type { AppRouter } from '@/server/router';
import { useUserStore } from '@/stores/authorization';
import { middleware } from './middleware';

const baseUrl = 'http://localhost:3000';
const url = `${baseUrl}/trpc`;

export const client: ReturnType<typeof createTRPCProxyClient<AppRouter>> =
  createTRPCProxyClient<AppRouter>({
    links: [
      middleware(),
      loggerLink({
        enabled: (opts) =>
          (process.env.NODE_ENV === 'development' &&
            typeof window !== 'undefined') ||
          (opts.direction === 'down' && opts.result instanceof Error),
      }),
      httpBatchLink({
        url,
        headers: () => {
          const { authorization } = useUserStore();
          return {
            'mie-mie-shi-zhu-cheng': authorization.toString(),
          };
        },
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: 'include',
          });
        },
      }),
    ],
  });
