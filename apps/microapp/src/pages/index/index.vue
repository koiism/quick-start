<template>
  <nav-bar></nav-bar>
  <view class="demo">
    <view>
      <nut-button type="primary" @click="handleClick">Hello</nut-button>
    </view>
    <view>Hello {{ name ? ', ' + name : '' }}</view>
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
.demo {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
