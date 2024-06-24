import { createTRPCProxyClient } from '@trpc/client';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import type { AppRouter } from '@/server/router';
import { useUserStore } from '@/stores/authorization';

const baseUrl = 'http://localhost:3000';
const url = `${baseUrl}/trpc`;

export const client: ReturnType<typeof createTRPCProxyClient<AppRouter>> =
  createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url,
        headers: () => {
          const { authorization } = useUserStore();
          return {
            'mie-mie-shi-zhu-cheng': authorization.toString(),
          };
        },
      }),
    ],
  });
