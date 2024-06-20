<template>
  <view class="nav-bar--placeholder" v-if="!props.fullScreen"></view>
  <view class="nav-bar" :class="{ 'full-screen': props.fullScreen }" :="$attrs">
    <view class="h-full w-full flex items-center justify-center relative">
      <view
        class="nav-bar-left"
        v-if="props.leftShow && notFirstPage"
        @click="goBack"
      >
        <svg-icon type="arrow-left"></svg-icon>
      </view>
      <slot></slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useNavBarHeight } from '@/utils/hooks/useNavBarHeight';
import { usePagesStack } from '@/utils/hooks/usePagesStack';
import { goBack } from '@/utils/routers';

interface IProps {
  leftShow?: boolean;
  fullScreen?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  leftShow: true,
  fullScreen: false,
});

const { notFirstPage } = usePagesStack();

const { statusBarHeight, navBarHeight, navPlaceholderHeight } =
  useNavBarHeight();
</script>

<style lang="scss">
.nav-bar {
  @apply top-0 fixed flex items-center justify-center w-screen bg-nav-bg shadow-md z-50;
  padding-top: v-bind(statusBarHeight);
  height: v-bind(navBarHeight);
  &.full-screen {
    @apply bg-transparent;
  }
  &--placeholder {
    height: v-bind(navPlaceholderHeight);
  }
  &-left {
    @apply absolute left-0 top-0 flex items-center justify-center h-full pl-4;
  }
}
</style>
