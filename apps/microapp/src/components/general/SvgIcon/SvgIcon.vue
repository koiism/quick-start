<template>
  <view :class="`icon ${props.type}`"></view>
</template>

<script setup lang="ts">
type TIconTypes = 'arrow-left' | 'home';
interface IProps {
  type?: TIconTypes;
}
const props = withDefaults(defineProps<IProps>(), {});
</script>

<style lang="scss">
.icon {
  @apply min-w-5 min-h-5 bg-center bg-no-repeat bg-contain flex items-center justify-center;
}
.home {
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJNMTIgM0wxIDExLjRsMS4yMSAxLjU5TDQgMTEuNjJWMjFoMTZ2LTkuMzhsMS43OSAxLjM2TDIzIDExLjR6bTYgMTZINnYtOC45bDYtNC41OGw2IDQuNTh6bS05LTVjMCAuNTUtLjQ1IDEtMSAxcy0xLS40NS0xLTFzLjQ1LTEgMS0xczEgLjQ1IDEgMW0zLTFjLjU1IDAgMSAuNDUgMSAxcy0uNDUgMS0xIDFzLTEtLjQ1LTEtMXMuNDUtMSAxLTFtMyAxYzAtLjU1LjQ1LTEgMS0xczEgLjQ1IDEgMXMtLjQ1IDEtMSAxcy0xLS40NS0xLTEiLz48L3N2Zz4=');
}
.arrow-left {
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJNMTcuNzcgMy43N0wxNiAyTDYgMTJsMTAgMTBsMS43Ny0xLjc3TDkuNTQgMTJ6Ii8+PC9zdmc+');
}
</style>
