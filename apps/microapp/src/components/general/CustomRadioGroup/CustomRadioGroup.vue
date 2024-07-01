<template>
  <view class="flex items-center justify-center">
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import { provide } from 'vue';

const internalValue = defineModel({ type: String });
const emit = defineEmits(['change']);

const updateValue = (newValue) => {
  if (internalValue !== newValue) {
    internalValue.value = newValue;
    emit('change', newValue);
  }
};

provide<ICustomRadioContext>(CustomRadioSymbol, {
  internalValue,
  updateValue,
});
</script>

<script lang="ts">
export const CustomRadioSymbol = Symbol('customRadioGroupModel');
export interface ICustomRadioContext {
  internalValue: Ref<string | undefined>;
  updateValue: (newValue?: string) => void;
}
export const defaultContext: ICustomRadioContext = {
  internalValue: ref(),
  updateValue: (_value) => {},
};
</script>
