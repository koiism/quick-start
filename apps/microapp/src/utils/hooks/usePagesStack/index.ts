import { computed } from 'vue';

export const usePagesStack = () => {
  const [stackLength, { pageInstance }] = usePage();
  const notFirstPage = stackLength > 1;
  const isIndex = computed(() => {
    return pageInstance.router?.path === '/pages/index/index';
  });

  const currentPagePath = computed(() => {
    return pageInstance.router?.path;
  });

  return { notFirstPage, isIndex, currentPagePath };
};
