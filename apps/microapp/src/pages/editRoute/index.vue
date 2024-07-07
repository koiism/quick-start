<template>
  <view class="page-container overflow-hidden">
    <nav-bar>添加线路</nav-bar>
    <view class="flex-1 w-full relative">
      <view
        class="absolute top-3 w-full flex items-center justify-between px-4 z-100 box-border"
      >
        <view>模式: {{ engine.modeText }}</view>
      </view>
      <canvas
        :id="worldElementId"
        :canvas-id="worldElementId"
        class="absolute top-0 bottom-0 left-0 right-0 z-0 w-auto h-auto"
        ref="canvasRef"
        type="webgl"
        @touchstart="touchEvent"
        @touchmove="touchEvent"
        @touchend="touchEvent"
        @tap="touchEvent"
      ></canvas>
      <view class="toolbar absolute left-0 right-0 bottom-0 z-100 px-4">
        <custom-radio-group
          v-model="selectedHoldType"
          class="w-full flex items-center justify-between"
        >
          <custom-radio :value="HOLD_TYPE.START_END" v-slot="{ active }"
            ><view class="btn-hold-st" :class="{ active }"></view
            >起始/结束点</custom-radio
          >
          <custom-radio :value="HOLD_TYPE.MIDDLE" v-slot="{ active }"
            ><view class="btn-hold-m" :class="{ active }"></view
            >中间点</custom-radio
          >
          <custom-radio :value="HOLD_TYPE.FOOT" v-slot="{ active }"
            ><view class="btn-hold-f" :class="{ active }"></view
            >脚点</custom-radio
          >
        </custom-radio-group>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// @ts-ignore
import { createPIXI } from '@/utils/pixi/pixi.miniprogram';
import { generateRandomId } from '@/utils/generateRandomId';
import { onMounted, ref } from 'vue';
import { HOLD_TYPE } from '@/server/router/zods/route';
import RouteEditorEngine, { CANVAS_MODE } from './service';
import { watch } from 'vue';

const canvasRef = ref();
const worldElementId = generateRandomId();
const selectedHoldType = ref<HOLD_TYPE>();
watch(
  () => selectedHoldType.value,
  (value) => {
    if (value) {
      engine.mode = CANVAS_MODE.INSERT;
    } else {
      engine.mode = CANVAS_MODE.VIEW;
    }
  }
);

const engine = new RouteEditorEngine(canvasRef);

let touchEvent = engine.eventDispatcher;

onMounted(async () => {
  await engine.initWorld();
  engine.initWall(
    'https://gitee.com/pidanMoe/files/raw/3153d1f9f199be70f3734653afd6f262d6cd3f81/d15d61782b34515b779e4f2421801e31.png'
  );
});
</script>

<style lang="scss">
.page-container {
  @apply h-screen flex flex-col items-center justify-center;
  .toolbar {
    padding-bottom: calc(env(safe-area-inset-bottom) + 12px);
    .btn-hold-st {
      @apply h-4 w-4 rounded-full ring-1 ring-inset ring-offset-hold-st ring-offset-1 ring-transparent;
    }
    .btn-hold-m {
      @apply h-4 w-4 rounded-full ring-1 ring-inset ring-offset-hold-m ring-offset-1 ring-transparent;
    }
    .btn-hold-f {
      @apply h-4 w-4 ring-1 ring-inset ring-offset-hold-f ring-offset-1 ring-transparent;
    }
  }
}
</style>
