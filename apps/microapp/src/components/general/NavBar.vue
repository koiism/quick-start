<template>
  <view>
    <view class="nav-bar--placeholder"></view>
    <view :id="`nav-bar-${generateRandomId()}`" class="nav-bar" ref="navBarRef">
      首页
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { useTaroRect } from '@/utils/hooks/useTaroRect/index';
import { generateRandomId } from '@/utils/generateRandomId';
import { computed, onMounted, ref } from 'vue';

const systemInfo = Taro.getSystemInfoSync();
const statusBarHeight = ref(systemInfo.statusBarHeight + 'px');
const navBarRef = ref(null);
const navHeight = ref('auto');
const getNavHeight = () => {
  useTaroRect(navBarRef).then(
    (rect: any) => {
      navHeight.value = `${rect.height}px`;
    },
    (e) => {
      console.error(e);
      navHeight.value = 'auto';
    }
  );
};
const { top: menuTop, height: menuHeight } =
  Taro.getMenuButtonBoundingClientRect();

const navBarHeight = computed(() => {
  const statusBarHeight = systemInfo.statusBarHeight || 0;
  const navBarPaddings = (menuTop - statusBarHeight) * 2;
  return navBarPaddings + menuHeight + 'px';
});
onMounted(() => {
  setTimeout(() => {
    getNavHeight();
  }, 100);
});
</script>

<style lang="scss">
.nav-bar {
  top: 0;
  position: fixed;
  padding-top: v-bind(statusBarHeight);
  height: v-bind(navBarHeight);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  &--placeholder {
    height: v-bind(navHeight);
  }
}
</style>
