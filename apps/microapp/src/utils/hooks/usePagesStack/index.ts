import Taro from '@tarojs/taro';

export const usePagesStack = () => {
  const pagesStack = Taro.getCurrentPages();
  const notFirstPage = pagesStack.length > 1;
  return { notFirstPage };
};
