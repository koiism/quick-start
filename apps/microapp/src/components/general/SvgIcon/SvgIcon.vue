<template>
  <view :class="`icon ${props.type}`"></view>
</template>

<script setup lang="ts">
type TIconTypes = 'arrow-left';
interface IProps {
  type?: TIconTypes;
}
const props = withDefaults(defineProps<IProps>(), {});
</script>

<style lang="scss">
.icon {
  @apply min-w-4 min-h-4 bg-center bg-no-repeat bg-contain flex items-center justify-center;
}
.arrow-left {
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5IiBoZWlnaHQ9IjE3IiB2aWV3Qm94PSIwIDAgOSAxNyIgZmlsbD0ibm9uZSI+ICAgPHBhdGggZD0iTTEuNzU5IDguNDU5MDVMOC4xODUgMTUuMTM3QzguNDI4IDE1LjM4IDguNDI4IDE1Ljc3NiA4LjE4NSAxNi4wMTlDNy45NDIgMTYuMjYyIDcuNTU1IDE2LjI2MiA3LjMxMiAxNi4wMTlMMC4yNjQ5OTggOC45MDAwNUMwLjAyMTk5ODQgOC42NTcwNSAwLjAyMTk5ODQgOC4yNjEwNSAwLjI2NDk5OCA4LjAxODA1TDcuMzEyIDAuODk5MDQ3QzcuNTU1IDAuNjU2MDQ3IDcuOTQyIDAuNjU2MDQ3IDguMTg1IDAuODk5MDQ3QzguNDI4IDEuMTQyMDUgOC40MjggMS41MzgwNSA4LjE4NSAxLjc4MTA1TDEuNzU5IDguNDU5MDVaIiBmaWxsPSJ3aGl0ZSIvPiAgIDxtYXNrIGlkPSJtYXNrMF84MTNfNDM3IiBzdHlsZT0ibWFzay10eXBlOmx1bWluYW5jZSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjkiIGhlaWdodD0iMTciPiAgICAgPHBhdGggZD0iTTEuNzU5IDguNDU5MDVMOC4xODUgMTUuMTM3QzguNDI4IDE1LjM4IDguNDI4IDE1Ljc3NiA4LjE4NSAxNi4wMTlDNy45NDIgMTYuMjYyIDcuNTU1IDE2LjI2MiA3LjMxMiAxNi4wMTlMMC4yNjQ5OTggOC45MDAwNUMwLjAyMTk5ODQgOC42NTcwNSAwLjAyMTk5ODQgOC4yNjEwNSAwLjI2NDk5OCA4LjAxODA1TDcuMzEyIDAuODk5MDQ3QzcuNTU1IDAuNjU2MDQ3IDcuOTQyIDAuNjU2MDQ3IDguMTg1IDAuODk5MDQ3QzguNDI4IDEuMTQyMDUgOC40MjggMS41MzgwNSA4LjE4NSAxLjc4MTA1TDEuNzU5IDguNDU5MDVaIiBmaWxsPSJ3aGl0ZSIvPiAgIDwvbWFzaz4gICA8ZyBtYXNrPSJ1cmwoI21hc2swXzgxM180MzcpIj4gICAgIDxyZWN0IHg9IjEzIiB5PSItMSIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCAxMyAtMSkiIGZpbGw9IndoaXRlIi8+ICAgPC9nPiA8L3N2Zz4=');
}
</style>
