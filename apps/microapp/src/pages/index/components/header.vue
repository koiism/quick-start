<template>
  <view class="flex flex-col gap-2 items-stretch px-4 mb-2">
    <view
      class="flex items-center justify-between"
      :style="{
        'padding-top': navPlaceholderHeight,
      }"
    >
      <view class="flex items-center gap-1 text-sm">
        <!-- <svg-icon type="heart" color="icon" size="sm"></svg-icon> -->
        {{ gymData?.name }}
        <svg-icon
          type="arrow"
          direction="right"
          color="icon"
          size="sm"
        ></svg-icon>
      </view>
      <svg-icon type="share" color="icon" size="sm"></svg-icon>
    </view>
    <view class="flex gap-2 items-center justify-between">
      <view class="flex flex-col gap-1">
        <view class="flex gap-1 items-baseline">
          <svg-icon type="location" size="xs" color="icon"></svg-icon>
          <view v-if="gymData?.distance" class="text-icon"
            >距离您{{ gymData?.distance }}</view
          >
        </view>
        <view class="flex gap-1 items-baseline">
          <svg-icon type="time" size="xs" color="icon"></svg-icon>
          <view class="text-icon"
            >营业时间: 周一到周五 8:00 - 16:00，周末 6:00 - 20:00</view
          >
        </view>
      </view>
      <nut-button type="primary" @click="onPhoneCall">
        <view class="flex text-xs gap-1 items-center">
          <svg-icon type="phone" size="md" color="primary-text"></svg-icon>
          联系门店
        </view>
      </nut-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useNavBarHeight } from '@/utils/hooks/useNavBarHeight';
import { client } from '@/queries/index';
import { onMounted, ref } from 'vue';
import { TGym } from '@/server/router/zods/gym';
import Taro from '@tarojs/taro';

const gymData = ref<TGym | null>(null);
const getGymData = async () => {
  gymData.value = (await client.gym.getGymDetailById.query({ id: 1 })).data;
};
const onPhoneCall = () => {
  Taro.makePhoneCall({
    phoneNumber: gymData.value?.phone || '',
  });
};
onMounted(() => {
  getGymData();
});

const { navPlaceholderHeight } = useNavBarHeight();
</script>

<style></style>
