<template>
  <nav-bar full-screen>首页</nav-bar>
  <view
    class="page-container"
    :="$attrs"
    :style="{
      'padding-top': navPlaceholderHeight,
    }"
  >
    <view>
      <nut-button type="primary" @click="handleClick">Hello</nut-button>
    </view>
    <view class="text-primary">Hello {{ name ? ', ' + name : '' }}</view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { client } from '@/queries';
import { useNavBarHeight } from '@/utils/hooks/useNavBarHeight';

const name = ref('');

const { navPlaceholderHeight } = useNavBarHeight();
const handleClick = async () => {
  const response = await client.user.greeting.query({ name: 'Tim' });
  name.value = response;
};
</script>

<style>
.page-container {
  @apply h-full flex flex-col items-center justify-center;
}
</style>
