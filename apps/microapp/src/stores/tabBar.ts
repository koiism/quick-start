import Taro, { useRouter } from '@tarojs/taro';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export function useRoutePath() {
  const route = useRouter();
  const path = route.path;
  return path;
}

export const useTabBarStore = defineStore('tabBar', () => {
  const selectedPagePath = ref(useRoutePath());
  const switchTab = (url) => {
    selectedPagePath.value = url;
    Taro.switchTab({ url });
  };
  return {
    selectedPagePath,
    switchTab,
  };
});
