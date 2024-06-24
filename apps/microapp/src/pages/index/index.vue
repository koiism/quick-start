<template>
  <scroll-view :="$attrs" class="page-container">
    <view
      class="head"
      :style="{
        'padding-top': navPlaceholderHeight,
      }"
    ></view>
  </scroll-view>
</template>

<script setup lang="ts">
import { useNavBarHeight } from '@/utils/hooks/useNavBarHeight';

const { navPlaceholderHeight } = useNavBarHeight();
</script>

<style lang="scss">
.page-container {
  .head {
    height: 100rpx;
  }
}
</style>
