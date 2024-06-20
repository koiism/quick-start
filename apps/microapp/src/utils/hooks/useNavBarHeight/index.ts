import Taro from '@tarojs/taro';
import { ref, computed } from 'vue';

export const useNavBarHeight = () => {
  const systemInfo = Taro.getSystemInfoSync();
  const statusBarHeight = ref(systemInfo.statusBarHeight + 'px');

  const { top: menuTop, height: menuHeight } =
    Taro.getMenuButtonBoundingClientRect();
  const navBarHeight = computed(() => {
    const statusBarHeight = systemInfo.statusBarHeight || 0;
    const navBarPaddings = (menuTop - statusBarHeight) * 2;
    return navBarPaddings + menuHeight + 'px';
  });
  const navPlaceholderHeight = computed(() => {
    return `calc(${navBarHeight.value} + ${statusBarHeight.value})`;
  });
  return {
    statusBarHeight,
    navBarHeight,
    navPlaceholderHeight,
  };
};
