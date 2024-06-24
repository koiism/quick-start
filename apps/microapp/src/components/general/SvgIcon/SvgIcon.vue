<template>
  <view :class="`svg-icon ${props.color} ${props.type}`"></view>
</template>

<script setup lang="ts">
type TIconTypes = 'arrow-left' | 'home';
type TIconColor = 'primary' | 'default' | 'icon';
interface IProps {
  type?: TIconTypes;
  color?: TIconColor;
}
const props = withDefaults(defineProps<IProps>(), {
  color: 'default',
});
</script>

<style lang="scss">
.svg-icon {
  @apply min-w-5 min-h-5 flex items-center justify-center;
  mask-position: center;
  mask-repeat: no-repeat;
  mask-size: contain;
  // icon color
  &.default {
    @apply bg-default;
  }
  &.primary {
    @apply bg-primary;
  }
  &.icon {
    @apply bg-icon;
  }

  // icon svg
  &.home {
    mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJNMTIgM0wxIDExLjRsMS4yMSAxLjU5TDQgMTEuNjJWMjFoMTZ2LTkuMzhsMS43OSAxLjM2TDIzIDExLjR6bTYgMTZINnYtOC45bDYtNC41OGw2IDQuNTh6bS05LTVjMCAuNTUtLjQ1IDEtMSAxcy0xLS40NS0xLTFzLjQ1LTEgMS0xczEgLjQ1IDEgMW0zLTFjLjU1IDAgMSAuNDUgMSAxcy0uNDUgMS0xIDFzLTEtLjQ1LTEtMXMuNDUtMSAxLTFtMyAxYzAtLjU1LjQ1LTEgMS0xczEgLjQ1IDEgMXMtLjQ1IDEtMSAxcy0xLS40NS0xLTEiLz48L3N2Zz4=');
  }
  &.arrow-left {
    mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJNMTcuNzcgMy43N0wxNiAyTDYgMTJsMTAgMTBsMS43Ny0xLjc3TDkuNTQgMTJ6Ii8+PC9zdmc+');
  }
}
</style>
