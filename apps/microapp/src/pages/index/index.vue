<template>
  <scroll-view
    :="$attrs"
    class="page-container"
    :using-sticky="true"
    :scroll-y="true"
    :enable-flex="true"
  >
    <gym-header></gym-header>
  </scroll-view>
</template>

<script setup lang="ts">
import GymHeader from './components/header.vue';
</script>

<style lang="scss">
.page-container {
  @apply flex flex-col gap-2 h-screen box-border;
}
</style>
