<template>
  <nav-bar></nav-bar>
  <view class="page-container" :="$attrs">
    <view>
      <nut-button type="primary" @click="handleClick">Hello</nut-button>
    </view>
    <view class="btn-special">Hello {{ name ? ', ' + name : '' }}</view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { client } from '@/queries';

const name = ref('');

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
