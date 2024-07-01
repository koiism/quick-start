import { computed } from 'vue';

export const usePagesStack = () => {
  const [stackLength, { pageInstance }] = usePage();
  const notFirstPage = stackLength > 1;
  const isIndex = computed(() => {
    return pageInstance.router?.path === '/pages/index/index';
  });

  const currentPagePath = computed(() => {
    const path = pageInstance.router?.path;
    return path;
  });

  return { notFirstPage, isIndex, currentPagePath };
};
