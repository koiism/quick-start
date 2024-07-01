import { TRPCLink } from '@trpc/client';

export const middleware = (): TRPCLink<any> => {
  return () => {
    return ({ op, next }) => {
      // 预处理
      return next(op).pipe((originalObserver) => {
        return {
          subscribe(observer) {
            return originalObserver.subscribe({
              next(v) {
                // 后处理
                observer.next?.(v);
              },
              error(v) {
                // 错误处理
                observer.error?.(v);
              },
              complete() {
                // 完成处理
                observer.complete?.();
              },
            });
          },
        };
      });
    };
  };
};
