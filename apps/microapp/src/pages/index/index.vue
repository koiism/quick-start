<template>
  <view class="page-container">
    <gym-header></gym-header>
    <scroll-view
      :="$attrs"
      class="scroll-container"
      :using-sticky="true"
      :scroll-y="true"
      :enable-flex="true"
    >
      <custom-tabs :tabs="tabs" class="mb-2">
        <custom-tab-pane :pane-key="TAB_KEY.BOULDER"></custom-tab-pane>
        <custom-tab-pane :pane-key="TAB_KEY.ROPE"></custom-tab-pane>
      </custom-tabs>
    </scroll-view>
    <tab-bar></tab-bar>
  </view>
</template>

<script setup lang="ts">
import GymHeader from './components/header.vue';
import TabBar from '../../custom-tab-bar/index.vue';
import { TTab } from '@/components/general/CustomTabs/CustomTabs.vue';
import Taro from '@tarojs/taro';
enum TAB_KEY {
  BOULDER,
  ROPE,
}
const tabs: TTab[] = [
  {
    title: '抱石线路',
    key: TAB_KEY.BOULDER,
  },
  {
    title: '难度线路',
    key: TAB_KEY.ROPE,
    disable: true,
    onSelect() {
      Taro.showToast({
        title: '功能开发中',
        icon: 'none',
      });
    },
  },
];
</script>

<style lang="scss">
.page-container {
  @apply flex flex-col gap-2 h-screen box-border;
  .scroll-container {
    @apply flex-1 flex-col gap-2 box-border px-4 min-h-0;
  }
}
</style>
