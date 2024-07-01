<template>
  <view
    :disabled="disabled"
    @click="handleChange"
    class="custom-radio"
    :class="{ checked: checked }"
  >
    <slot :active="checked"></slot>
  </view>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import {
  CustomRadioSymbol,
  defaultContext,
} from '../CustomRadioGroup/CustomRadioGroup.vue';

interface IProps {
  value: string | number;
  disabled?: boolean;
}

const props = defineProps<IProps>();

const radioGroupModel = inject(CustomRadioSymbol, defaultContext);

const checked = computed(() => {
  const checked = radioGroupModel.internalValue.value === String(props.value);
  return checked;
});

const handleChange = () => {
  if (props.disabled) {
    return;
  }
  if (!checked.value) {
    radioGroupModel.updateValue(String(props.value));
  } else {
    radioGroupModel.updateValue();
  }
};
</script>

<style lang="scss">
.custom-radio {
  @apply flex items-center justify-center text-sm py-1 px-4 gap-2 bg-card-bg rounded;
  &.checked {
    @apply ring-1 ring-inset ring-offset-primary ring-offset-1 ring-transparent;
  }
}
</style>
