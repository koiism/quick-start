<template>
  <template v-if="parentOption.currentKey.value === props.paneKey">
    <slot></slot>
  </template>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import {
  TABS_KEY,
  TCustomTabsContext,
  TKey,
} from '../CustomTabs/CustomTabs.vue';
const parentOption = inject(TABS_KEY) as TCustomTabsContext;
const props = defineProps<{ paneKey: TKey }>();
</script>

<style lang="scss"></style>
