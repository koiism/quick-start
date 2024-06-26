<template>
  <view class="tab-titles" :="$attrs">
    <view
      v-for="(item, index) in props.tabs"
      class="tab-title"
      :class="{ active: currentKey === item.key }"
      :key="index"
      @click="handleTabClick(index)"
    >
      <view class="tab-title-item">
        <view>{{ item.title }}</view>
      </view>
    </view>
  </view>
  <slot></slot>
</template>

<script setup lang="ts">
import { computed, ref, provide } from 'vue';
import { TIconTypes } from '../SvgIcon/SvgIcon.vue';
import { effect } from 'vue';
import { onMounted } from 'vue';
import { Ref } from 'vue';

const props = withDefaults(defineProps<IProp>(), {});

const currentKey = ref(props.defaultKey);
provide(TABS_KEY, {
  currentKey,
});
const activeIndex = ref(0);
const initActiveIndex = () => {
  const index = props.tabs.findIndex((item) => item.key === props.defaultKey);
  if (index !== -1) {
    activeIndex.value = index;
  }
};
onMounted(() => {
  initActiveIndex();
});
effect(() => {
  currentKey.value = props.tabs[activeIndex.value]?.key;
});

const emit = defineEmits<{
  (e: 'select', key: TKey): boolean;
}>();

const handleTabClick = (index: number) => {
  const currentTab = props.tabs[index];
  emit('select', currentTab.key);
  currentTab.onSelect?.();
  if (currentTab.disable) {
    return;
  }
  activeIndex.value = index;
};

const translateX = computed(() => {
  return `translateX(${activeIndex.value * 100}%)`;
});
</script>

<script lang="ts">
export const TABS_KEY = Symbol('nut-tab');
interface IProp {
  tabs: TTab[];
  defaultKey?: TKey;
}
export type TTab = {
  title: string;
  key: any;
  icon?: TIconTypes;
  total?: number;
  disable?: boolean;
  onSelect?: () => void;
};

export type TKey = IProp['tabs'][number]['key'];
export type TCustomTabsContext = {
  currentKey: Ref<TKey>;
};
</script>

<style lang="scss">
.tab-titles {
  @apply bg-card-bg p-1 flex items-center justify-between gap-0 rounded;
  .tab-title {
    @apply py-1 rounded transition-all flex-1 flex items-center justify-center relative;
    &.active {
      .tab-title-item {
        @apply text-primary-text;
      }
    }
    &-item {
      @apply z-1;
    }
    &:nth-child(1)::before {
      @apply bg-primary rounded absolute top-0 bottom-0 left-0 right-0 transition-all;
      transform: v-bind(translateX);
      content: '';
    }
  }
}
</style>
