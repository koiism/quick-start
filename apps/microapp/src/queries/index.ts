import { createTRPCProxyClient } from '@trpc/client';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import type { AppRouter } from '@server/router';

const baseUrl = 'http://localhost:3000';
const url = `${baseUrl}/trpc`;

export const client = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url })],
});
